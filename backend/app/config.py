from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""

    # Database
    DATABASE_URL: str = "postgresql://bhxh_user:bhxh_password@postgres:5432/bhxh_db"

    # Redis
    REDIS_URL: str = "redis://redis:6379/0"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://frontend:3000"]

    # Application
    APP_NAME: str = "BHXH Calculator API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
