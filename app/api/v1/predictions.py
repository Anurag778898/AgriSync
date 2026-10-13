from datetime import date, timedelta
from fastapi import APIRouter, HTTPException
from app.schemas.schemas import SupplyDemandPriceRequest
from app.services.price_demand_supply import (
    predict_price_from_demand_supply,
    recommend_best_selling_window,
)

router = APIRouter(prefix="/api/v1/predictions", tags=["predictions"])


@router.post("/price-from-supply-demand")
def price_from_supply_demand(payload: SupplyDemandPriceRequest):
    """
    Quick single-point prediction: given today's price + a demand/supply
    forecast for one target point, return the adjusted predicted price.
    """
    supply_index = (
        payload.forecast_supply_qty / payload.current_supply_qty
        if payload.current_supply_qty > 0
        else 1.0
    )
    predicted = predict_price_from_demand_supply(
        current_price=payload.current_price,
        demand_index=payload.forecast_demand_index,
        supply_index=supply_index,
    )
    return {
        "crop_id": payload.crop_id,
        "mandi_id": payload.mandi_id,
        "predicted_price": predicted,
    }


@router.post("/best-selling-window")
def best_selling_window(payload: SupplyDemandPriceRequest):
    """
    Full recommendation: walks the next `horizon_days` and returns the best
    date + mandi to sell at, factoring in perishability/holding cost.

    NOTE: this endpoint builds a simple linear demand/supply projection from
    the single forecast point you pass in, for demo purposes. In production,
    replace `forecast_demand_by_day` / `forecast_supply_by_day` with the
    actual day-by-day output of your trained demand model (Module 5) and
    market data pipeline (Module 2) — see app/ml/inference/predict.py.
    """
    if payload.horizon_days < 1 or payload.horizon_days > 60:
        raise HTTPException(status_code=400, detail="horizon_days must be between 1 and 60")

    today = date.today()
    demand_by_day = {}
    supply_by_day = {}
    demand_step = (payload.forecast_demand_index - 1.0) / payload.horizon_days
    supply_step = (payload.forecast_supply_qty - payload.current_supply_qty) / payload.horizon_days

    for i in range(payload.horizon_days):
        d = today + timedelta(days=i)
        demand_by_day[d] = 1.0 + demand_step * i
        supply_by_day[d] = payload.current_supply_qty + supply_step * i

    result = recommend_best_selling_window(
        current_price=payload.current_price,
        baseline_avg_supply=payload.current_supply_qty or 1.0,
        forecast_demand_by_day=demand_by_day,
        forecast_supply_by_day=supply_by_day,
    )
    return {"crop_id": payload.crop_id, "mandi_id": payload.mandi_id, **result}
