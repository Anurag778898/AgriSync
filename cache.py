"""
Thin cache wrapper. Uses Redis if reachable, otherwise falls back to an
in-process dict so the app still runs on a laptop with no Redis installed.
"""
import json
import time
from typing import Any, Optional

try:
    import redis
    from app.core.config import settings
    _redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    _redis_client.ping()
    USE_REDIS = True
except Exception:
    _redis_client = None
    USE_REDIS = False

_local_cache: dict[str, tuple[float, str]] = {}  # key -> (expires_at, value)


def cache_set(key: str, value: Any, ttl_seconds: int = 3600) -> None:
    payload = json.dumps(value)
    if USE_REDIS:
        _redis_client.setex(key, ttl_seconds, payload)
    else:
        _local_cache[key] = (time.time() + ttl_seconds, payload)


def cache_get(key: str) -> Optional[Any]:
    if USE_REDIS:
        val = _redis_client.get(key)
        return json.loads(val) if val else None
    entry = _local_cache.get(key)
    if not entry:
        return None
    expires_at, payload = entry
    if time.time() > expires_at:
        del _local_cache[key]
        return None
    return json.loads(payload)
