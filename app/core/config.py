"""
Central app configuration. Reads from environment variables / .env file.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./agrisync.db"

    JWT_SECRET_KEY: str = "dev-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    REDIS_URL: str = "redis://localhost:6379/0"

    DATA_GOV_IN_API_KEY: str = ""
    DATA_GOV_IN_RESOURCE_ID: str = "9ef84268-d588-465a-a308-a864a43d0070"
    WEATHER_API_BASE: str = "https://api.open-meteo.com/v1/forecast"

    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
