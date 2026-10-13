from datetime import date, timedelta
from app.services.price_demand_supply import (
    predict_price_from_demand_supply,
    recommend_best_selling_window,
)


def test_price_rises_when_demand_exceeds_supply():
    price = predict_price_from_demand_supply(current_price=1000, demand_index=1.3, supply_index=0.8)
    assert price > 1000


def test_price_falls_when_supply_exceeds_demand():
    price = predict_price_from_demand_supply(current_price=1000, demand_index=0.8, supply_index=1.3)
    assert price < 1000


def test_best_selling_window_returns_valid_date_in_horizon():
    today = date.today()
    demand = {today + timedelta(days=i): 1.0 + 0.01 * i for i in range(10)}
    supply = {today + timedelta(days=i): 300 for i in range(10)}
    result = recommend_best_selling_window(
        current_price=1500, baseline_avg_supply=300,
        forecast_demand_by_day=demand, forecast_supply_by_day=supply,
    )
    assert today <= result["best_sell_date"] <= today + timedelta(days=9)
    assert "reasoning" in result
