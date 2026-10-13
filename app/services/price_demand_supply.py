"""
Demand-Supply Price Prediction + Optimal Selling Window Recommender.

WHAT THIS DOES
---------------
Two things, on top of your existing XGBoost price model:

1. predict_price_from_demand_supply()
   Adjusts a base/current price using classical price-elasticity economics:
   price moves up when demand > supply, and down when supply > demand.
   This is a fast, explainable "sanity layer" that works even before you
   have enough historical data to train a full ML price model, and later
   works well ENSEMBLED with your XGBoost model (average or weighted blend).

2. recommend_best_selling_window()
   Given a forecast horizon (e.g. next 14 days), it walks day by day,
   predicts price for each day using the elasticity model (or your ML
   model if you pass one in), applies a "holding penalty" for crops that
   spoil/lose quality the longer the farmer waits (perishability), and
   returns the single best day + mandi to sell at.

THE MATH (elasticity model)
----------------------------
    price_change_pct = elasticity * (demand_index - supply_index) / supply_index
    predicted_price   = current_price * (1 + price_change_pct)

- demand_index / supply_index are normalized indices (e.g. supply_index =
  forecast_supply_qty / historical_avg_supply_qty). If both are ~1.0,
  price stays roughly flat.
- `elasticity` is crop-specific. Perishables (tomato, onion) tend to have
  HIGH elasticity (price swings a lot with small supply changes).
  Grains (wheat, rice) have LOW elasticity (price is more stable, MSP-backed).
  Start with elasticity=0.6 for perishables, 0.2 for grains, and tune once
  you have enough historical price/arrival data to fit it via regression
  (see `estimate_elasticity_from_history` below).

HOLDING PENALTY (why "sell now" sometimes beats "wait for a higher price")
----------------------------------------------------------------------------
Waiting has a cost: storage, spoilage risk, and cash-flow delay. We model
this as a simple linear decay applied to the predicted price once the
farmer has held the crop past `crop.perishability_days`:

    effective_price = predicted_price * max(0, 1 - decay_rate * days_over_limit)

This stops the recommender from telling a tomato farmer to "wait 30 days
for a 5% higher price" when the tomatoes will have rotted by then.
"""
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Optional, Callable


# ---- Tunable defaults; override per-crop once you have real data ----
DEFAULT_ELASTICITY_PERISHABLE = 0.6
DEFAULT_ELASTICITY_STAPLE = 0.2
DEFAULT_HOLDING_DECAY_RATE = 0.03  # 3% value loss per day held past perishability window


@dataclass
class DailyPricePoint:
    day: date
    predicted_price: float
    effective_price: float  # after holding-penalty adjustment
    supply_index: float
    demand_index: float


def predict_price_from_demand_supply(
    current_price: float,
    demand_index: float,
    supply_index: float,
    elasticity: float = DEFAULT_ELASTICITY_PERISHABLE,
) -> float:
    """
    Core elasticity-based price prediction.

    Args:
        current_price: today's known/modal price (₹/quintal)
        demand_index: forecasted demand relative to baseline (1.0 = normal)
        supply_index: forecasted supply/arrivals relative to baseline (1.0 = normal)
        elasticity: crop-specific sensitivity (0.1 = stable staple, 0.8 = volatile perishable)

    Returns:
        predicted price (₹/quintal)
    """
    if supply_index <= 0:
        supply_index = 0.01  # avoid divide-by-zero; treat as extreme scarcity

    price_change_pct = elasticity * (demand_index - supply_index) / supply_index
    # clip to a sane range so one bad data point can't produce a 500% swing
    price_change_pct = max(-0.5, min(0.5, price_change_pct))

    predicted_price = current_price * (1 + price_change_pct)
    return round(predicted_price, 2)


def estimate_elasticity_from_history(price_series: list[float], supply_series: list[float]) -> float:
    """
    OPTIONAL upgrade: fit elasticity from real history instead of using a
    fixed default. Uses simple log-log regression:
        log(price) = a + elasticity_est * log(supply)
    (Negative slope expected: more supply -> lower price. We return the
    absolute value since our formula above already encodes the sign via
    demand-supply direction.)

    Requires numpy — falls back to the perishable default if data is too
    thin (< 10 points) or if numpy isn't available in a stripped-down env.
    """
    if len(price_series) < 10 or len(price_series) != len(supply_series):
        return DEFAULT_ELASTICITY_PERISHABLE
    try:
        import numpy as np
        log_p = np.log([p for p in price_series if p > 0])
        log_s = np.log([s for s in supply_series if s > 0])
        n = min(len(log_p), len(log_s))
        slope, _ = np.polyfit(log_s[:n], log_p[:n], 1)
        return round(abs(float(slope)), 3)
    except Exception:
        return DEFAULT_ELASTICITY_PERISHABLE


def recommend_best_selling_window(
    current_price: float,
    baseline_avg_supply: float,
    forecast_demand_by_day: dict[date, float],   # date -> demand_index (1.0 = normal)
    forecast_supply_by_day: dict[date, float],   # date -> raw predicted arrival qty
    perishability_days: int = 14,
    elasticity: float = DEFAULT_ELASTICITY_PERISHABLE,
    holding_decay_rate: float = DEFAULT_HOLDING_DECAY_RATE,
    ml_price_model_fn: Optional[Callable[[date], float]] = None,
) -> dict:
    """
    Walks the forecast horizon day by day and picks the best day to sell.

    Args:
        current_price: today's modal price
        baseline_avg_supply: historical average arrival qty for this crop/mandi
                              (used to normalize forecast_supply into an index)
        forecast_demand_by_day: {date: demand_index} for each day in horizon
        forecast_supply_by_day: {date: predicted_arrival_qty} for each day in horizon
        perishability_days: days before holding penalty kicks in
        elasticity: crop-specific elasticity (see predict_price_from_demand_supply)
        holding_decay_rate: value lost per day held past perishability_days
        ml_price_model_fn: OPTIONAL — pass a function `f(day) -> price` from your
                            trained XGBoost model to ENSEMBLE with the elasticity
                            estimate (we average the two if provided). This is how
                            you plug in Module 6's trained model instead of relying
                            purely on the economic formula.

    Returns:
        dict with best_day, predicted_price, effective_price, full daily curve,
        and a human-readable reasoning string.
    """
    today = min(forecast_demand_by_day.keys())
    curve: list[DailyPricePoint] = []

    for day, demand_index in sorted(forecast_demand_by_day.items()):
        supply_qty = forecast_supply_by_day.get(day, baseline_avg_supply)
        supply_index = supply_qty / baseline_avg_supply if baseline_avg_supply > 0 else 1.0

        elasticity_price = predict_price_from_demand_supply(
            current_price, demand_index, supply_index, elasticity
        )

        if ml_price_model_fn:
            ml_price = ml_price_model_fn(day)
            predicted_price = round((elasticity_price + ml_price) / 2, 2)
        else:
            predicted_price = elasticity_price

        days_held = (day - today).days
        days_over_limit = max(0, days_held - perishability_days)
        decay_factor = max(0.0, 1 - holding_decay_rate * days_over_limit)
        effective_price = round(predicted_price * decay_factor, 2)

        curve.append(DailyPricePoint(day, predicted_price, effective_price, supply_index, demand_index))

    best_point = max(curve, key=lambda p: p.effective_price)
    gain_pct = round(((best_point.effective_price - current_price) / current_price) * 100, 2)

    if best_point.day == today:
        reasoning = (
            "Selling today gives the best expected return — waiting doesn't pay off "
            "once storage/spoilage risk is factored in."
        )
    elif (best_point.day - today).days > perishability_days:
        reasoning = (
            f"Prices are expected to peak on {best_point.day}, but note this is past the "
            f"typical {perishability_days}-day storage window for this crop — factor in "
            f"real storage availability before committing to hold that long."
        )
    else:
        reasoning = (
            f"Prices are expected to rise from ₹{current_price} to ₹{best_point.predicted_price} "
            f"by {best_point.day} due to tightening supply relative to demand — "
            f"a {gain_pct}% gain over selling today."
        )

    return {
        "best_sell_date": best_point.day,
        "predicted_price": best_point.predicted_price,
        "effective_price_after_holding_cost": best_point.effective_price,
        "expected_price_gain_pct": gain_pct,
        "reasoning": reasoning,
        "daily_price_curve": [
            {
                "date": p.day.isoformat(),
                "predicted_price": p.predicted_price,
                "effective_price": p.effective_price,
                "supply_index": round(p.supply_index, 3),
                "demand_index": round(p.demand_index, 3),
            }
            for p in curve
        ],
    }


# ---------------------------------------------------------------------------
# Example / manual test — run this file directly to see sample output:
#   python -m app.services.price_demand_supply
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    today = date.today()
    demand_forecast = {today + timedelta(days=i): 1.0 + 0.02 * i for i in range(14)}  # rising demand
    supply_forecast = {today + timedelta(days=i): 500 - 10 * i for i in range(14)}    # falling supply

    result = recommend_best_selling_window(
        current_price=1800.0,
        baseline_avg_supply=500.0,
        forecast_demand_by_day=demand_forecast,
        forecast_supply_by_day=supply_forecast,
        perishability_days=10,
        elasticity=0.6,
    )
    import json
    print(json.dumps(result, indent=2, default=str))
