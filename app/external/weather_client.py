"""
Open-Meteo client (free, no API key needed). See Module 1 of the roadmap.
"""
import httpx
from app.core.config import settings
from app.core.cache import cache_get, cache_set


async def fetch_weather(lat: float, lon: float) -> dict:
    cache_key = f"weather:{lat}:{lon}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(
            settings.WEATHER_API_BASE,
            params={
                "latitude": lat,
                "longitude": lon,
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean",
                "timezone": "Asia/Kolkata",
            },
        )
        resp.raise_for_status()
        data = resp.json()

    cache_set(cache_key, data, ttl_seconds=6 * 3600)
    return data
