from datetime import date
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class FarmerProfileIn(BaseModel):
    name: str
    district: str
    state: str
    lat: float
    lon: float
    land_size_acres: float
    soil_type: str
    irrigation_type: str
    budget: float


class SupplyDemandPriceRequest(BaseModel):
    crop_id: int
    mandi_id: int
    current_price: float          # today's modal price (₹/quintal)
    current_supply_qty: float     # today's arrival quantity at mandi
    forecast_demand_index: float  # 0-1+, output of demand model (Module 5), normalized
    forecast_supply_qty: float    # predicted arrivals for target date
    horizon_days: int = 14        # how far ahead to search for best selling day


class SellingWindowRecommendation(BaseModel):
    crop_id: int
    mandi_id: int
    best_sell_date: date
    predicted_price: float
    predicted_price_today_equivalent: float
    expected_price_gain_pct: float
    reasoning: str
    daily_price_curve: list[dict]

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
