from fastapi import APIRouter
from pydantic import BaseModel
from app.services.recommendation_engine import CropCandidate, rank_crops

router = APIRouter(prefix="/api/v1/recommendations", tags=["recommendations"])


class CandidateIn(BaseModel):
    crop_name: str
    predicted_profit: float
    demand_trend_index: float
    weather_suitability: float
    soil_type: str


class RankRequest(BaseModel):
    candidates: list[CandidateIn]


@router.post("/rank")
def rank(payload: RankRequest):
    candidates = [CropCandidate(**c.model_dump()) for c in payload.candidates]
    return rank_crops(candidates)
