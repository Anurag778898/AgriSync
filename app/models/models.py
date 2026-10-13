"""
ORM models. Run `alembic revision --autogenerate` + `alembic upgrade head`
after editing this file (see README for exact commands), or for quick local
dev just call Base.metadata.create_all(engine) once (main.py does this).
"""
from sqlalchemy import (
    Column, Integer, String, Numeric, Date, DateTime, Boolean, ForeignKey, JSON, Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="farmer")
    created_at = Column(DateTime, server_default=func.now())

    farmer = relationship("Farmer", back_populates="user", uselist=False)


class Farmer(Base):
    __tablename__ = "farmers"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255))
    district = Column(String(100))
    state = Column(String(100))
    lat = Column(Numeric(9, 6))
    lon = Column(Numeric(9, 6))
    land_size_acres = Column(Numeric(6, 2))
    soil_type = Column(String(50))
    irrigation_type = Column(String(50))
    budget = Column(Numeric(12, 2))

    user = relationship("User", back_populates="farmer")


class Crop(Base):
    __tablename__ = "crops"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True)
    season = Column(String(20))
    category = Column(String(50))
    perishability_days = Column(Integer, default=14)  # how long it can be stored before quality drops


class Mandi(Base):
    __tablename__ = "mandis"
    id = Column(Integer, primary_key=True)
    name = Column(String(150))
    district = Column(String(100))
    state = Column(String(100))
    lat = Column(Numeric(9, 6))
    lon = Column(Numeric(9, 6))


class MarketPrice(Base):
    __tablename__ = "market_prices"
    id = Column(Integer, primary_key=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    mandi_id = Column(Integer, ForeignKey("mandis.id"))
    price_date = Column(Date, nullable=False)
    min_price = Column(Numeric(10, 2))
    max_price = Column(Numeric(10, 2))
    modal_price = Column(Numeric(10, 2))
    arrival_qty = Column(Numeric(10, 2))  # supply proxy: quantity arriving at mandi
    source = Column(String(50))
    fetched_at = Column(DateTime, server_default=func.now())


class WeatherCache(Base):
    __tablename__ = "weather_cache"
    id = Column(Integer, primary_key=True)
    lat = Column(Numeric(9, 6))
    lon = Column(Numeric(9, 6))
    forecast_date = Column(Date)
    temp_max = Column(Numeric(5, 2))
    temp_min = Column(Numeric(5, 2))
    rainfall_mm = Column(Numeric(6, 2))
    humidity = Column(Numeric(5, 2))
    fetched_at = Column(DateTime, server_default=func.now())


class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    mandi_id = Column(Integer, ForeignKey("mandis.id"))
    prediction_type = Column(String(30))  # 'price' | 'demand' | 'supply_demand_price'
    target_date = Column(Date)
    predicted_value = Column(Numeric(12, 2))
    model_version = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())


class Recommendation(Base):
    __tablename__ = "recommendations"
    id = Column(Integer, primary_key=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"))
    score = Column(Numeric(5, 4))
    score_breakdown = Column(JSON)
    best_sell_date = Column(Date, nullable=True)  # from selling-window recommender
    best_sell_mandi_id = Column(Integer, ForeignKey("mandis.id"), nullable=True)
    created_at = Column(DateTime, server_default=func.now())


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"))
    type = Column(String(30))
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())


class ApiLog(Base):
    __tablename__ = "api_logs"
    id = Column(Integer, primary_key=True)
    endpoint = Column(String(255))
    status_code = Column(Integer)
    response_time_ms = Column(Integer)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())


class GovScheme(Base):
    __tablename__ = "gov_schemes"
    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    description = Column(Text)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=True)
    state = Column(String(100))
    valid_from = Column(Date)
    valid_to = Column(Date)
