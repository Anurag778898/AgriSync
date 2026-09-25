"""
App entrypoint. Run locally with:
    uvicorn app.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.db.session import Base, engine
from app.models import models  # noqa: F401  (import so tables register with Base)
from app.api.v1 import auth, weather, market, predictions, recommendations, notifications, chat

app = FastAPI(title="AgriSync API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    # Wide open for local dev so the static frontend (opened from disk or any
    # localhost port) can call the API. Tighten this to your real domain
    # before deploying publicly.
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Quick local dev only — for real migrations use Alembic (see README)
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(weather.router)
app.include_router(market.router)
app.include_router(predictions.router)
app.include_router(recommendations.router)
app.include_router(notifications.router)
app.include_router(chat.router)

@app.get("/health")
def health():
    return {"status": "ok"}


# Serve the dashboard from the same local server as the API.  This keeps the
# frontend/API origin consistent and makes http://127.0.0.1:8000/ usable.
frontend_dir = Path(__file__).resolve().parents[1] / "frontend"
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
