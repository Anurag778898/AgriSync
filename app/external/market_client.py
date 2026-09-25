"""
data.gov.in Agmarknet price client. Meant to be called from a scheduled
batch job (see app/workers/scheduler.py), NOT live per-request — see
Module 2 of the roadmap for why (rate limits, staleness, inconsistent naming).
"""
import httpx
from fastapi import HTTPException
from app.core.config import settings

# Example resource id for the Agmarknet daily prices dataset on data.gov.in.
# Verify/replace with the exact resource id for your target dataset at
# https://data.gov.in — dataset ids periodically change.
BASE_URL = "https://api.data.gov.in/resource"


async def fetch_market_prices(state: str = "", commodity: str = "", limit: int = 100) -> list[dict]:
    """Fetch and normalize Agmarknet records from India's open-data portal.

    A data.gov.in key is required.  Keeping it server-side prevents exposing
    it in the browser and gives the frontend one stable response shape.
    """
    if not settings.DATA_GOV_IN_API_KEY or settings.DATA_GOV_IN_API_KEY == "your-data-gov-in-key-here":
        raise HTTPException(
            status_code=503,
            detail="Market data is not configured. Add DATA_GOV_IN_API_KEY to .env from data.gov.in.",
        )
    params = {
        "api-key": settings.DATA_GOV_IN_API_KEY,
        "format": "json",
        "limit": limit,
    }
    if state:
        params["filters[state]"] = state
    if commodity:
        params["filters[commodity]"] = commodity

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(f"{BASE_URL}/{settings.DATA_GOV_IN_RESOURCE_ID}", params=params)
        resp.raise_for_status()
        payload = resp.json()

    records = payload.get("records", [])
    return [
        {
            "commodity": record.get("commodity") or record.get("Commodity") or commodity,
            "variety": record.get("variety") or record.get("Variety") or "—",
            "market": record.get("market") or record.get("Market") or record.get("mandi") or "—",
            "district": record.get("district") or record.get("District") or "—",
            "state": record.get("state") or record.get("State") or state,
            "date": record.get("arrival_date") or record.get("Arrival_Date") or record.get("date") or "—",
            "min_price": record.get("min_price") or record.get("Min_Price"),
            "max_price": record.get("max_price") or record.get("Max_Price"),
            "modal_price": record.get("modal_price") or record.get("Modal_Price"),
            "unit": "₹ / quintal",
        }
        for record in records
    ]
