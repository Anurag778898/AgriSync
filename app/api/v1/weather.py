from fastapi import APIRouter, HTTPException
from app.external.weather_client import fetch_weather

router = APIRouter(prefix="/api/v1/weather", tags=["weather"])


@router.get("/forecast")
async def get_forecast(lat: float, lon: float):
    try:
        return await fetch_weather(lat, lon)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Weather service unavailable: {e}")
