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
    crop_id: int = Query(...),
    mandi_id: int | None = None,
    limit: int = Query(30, ge=1, le=100),
    db: Session = Depends(get_db),
):
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
