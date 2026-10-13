"""
Weighted-scoring crop recommendation engine (Module 4 of the roadmap).
Transparent and tunable — not a black-box ML model, by design (see notes
in the roadmap doc for why).
"""
from dataclasses import dataclass

WEIGHTS = {
    "profit": 0.35,
    "demand": 0.25,
    "weather": 0.20,
    "soil": 0.20,
}

# crude rule-based soil suitability lookup — expand this table over time
SOIL_SUITABILITY = {
    ("cotton", "black"): 1.0,
    ("cotton", "loamy"): 0.6,
    ("wheat", "loamy"): 1.0,
    ("rice", "clay"): 1.0,
    ("sugarcane", "loamy"): 0.9,
}


def normalize(value: float, min_v: float, max_v: float) -> float:
    if max_v == min_v:
        return 0.5
    return max(0.0, min(1.0, (value - min_v) / (max_v - min_v)))


@dataclass
class CropCandidate:
    crop_name: str
    predicted_profit: float
    demand_trend_index: float  # 1.0 = normal, >1 = rising
    weather_suitability: float  # 0-1, precomputed rule-based or model-based
    soil_type: str


def score_crop(candidate: CropCandidate, all_profits: list[float]) -> dict:
    profit_score = normalize(candidate.predicted_profit, min(all_profits), max(all_profits))
    demand_score = normalize(candidate.demand_trend_index, 0.5, 1.5)
    weather_score = candidate.weather_suitability
    soil_score = SOIL_SUITABILITY.get((candidate.crop_name.lower(), candidate.soil_type.lower()), 0.5)

    total = (
        WEIGHTS["profit"] * profit_score
        + WEIGHTS["demand"] * demand_score
        + WEIGHTS["weather"] * weather_score
        + WEIGHTS["soil"] * soil_score
    )

    return {
        "crop": candidate.crop_name,
        "score": round(total, 4),
        "breakdown": {
            "profit_score": round(profit_score, 3),
            "demand_score": round(demand_score, 3),
            "weather_score": round(weather_score, 3),
            "soil_score": round(soil_score, 3),
        },
    }


def rank_crops(candidates: list[CropCandidate]) -> list[dict]:
    all_profits = [c.predicted_profit for c in candidates]
    scored = [score_crop(c, all_profits) for c in candidates]
    return sorted(scored, key=lambda x: x["score"], reverse=True)
