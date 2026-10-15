import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import MarketPrice
from app.external.market_client import fetch_market_prices

router = APIRouter(prefix="/api/v1/market", tags=["market"])


@router.get("/live-prices")
async def get_live_prices(
    state: str = Query("", max_length=100),
    commodity: str = Query("", max_length=100),
    limit: int = Query(25, ge=1, le=100),
):
    """Live Agmarknet prices, proxied from data.gov.in with the key protected."""
    try:
        return await fetch_market_prices(state=state, commodity=commodity, limit=limit)
    except HTTPException:
        raise
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=503, detail="Government market service is temporarily unavailable.") from exc


@router.get("/prices")
def get_prices(
    crop_id: int | None = Query(None),
    commodity: str = Query("wheat"),
    unit: str = Query("quintal"),
    mandi_id: int | None = None,
    limit: int = Query(30, ge=1, le=100),
    db: Session = Depends(get_db),
):
    if crop_id is not None:
        q = db.query(MarketPrice).filter(MarketPrice.crop_id == crop_id)
        if mandi_id:
            q = q.filter(MarketPrice.mandi_id == mandi_id)
        rows = q.order_by(MarketPrice.price_date.desc()).limit(limit).all()
        return [
            {
                "date": r.price_date.isoformat(),
                "mandi_id": r.mandi_id,
                "modal_price": float(r.modal_price) if r.modal_price else None,
                "arrival_qty": float(r.arrival_qty) if r.arrival_qty else None,
            }
            for r in rows
        ]

    # Fallback default price data for frontend commodity intelligence
    prices_map = {
        "wheat": {"current_price": 2275.0, "change_pct": 2.4},
        "rice": {"current_price": 3150.0, "change_pct": -1.2},
        "tomato": {"current_price": 1850.0, "change_pct": 5.8},
        "onion": {"current_price": 1420.0, "change_pct": 3.1},
        "soybean": {"current_price": 4600.0, "change_pct": 0.8},
        "cotton": {"current_price": 7100.0, "change_pct": -0.5},
    }
    info = prices_map.get(commodity.lower(), {"current_price": 2350.0, "change_pct": 1.5})
    return {
        "commodity": commodity,
        "unit": unit,
        "current_price": info["current_price"],
        "change_pct": info["change_pct"],
        "history": [
            {"date": "2026-10-08", "price": info["current_price"] - 45},
            {"date": "2026-10-09", "price": info["current_price"] - 20},
            {"date": "2026-10-10", "price": info["current_price"] - 10},
            {"date": "2026-10-11", "price": info["current_price"] + 15},
            {"date": "2026-10-12", "price": info["current_price"] + 30},
            {"date": "2026-10-13", "price": info["current_price"] + 25},
            {"date": "2026-10-14", "price": info["current_price"]},
        ],
    }

