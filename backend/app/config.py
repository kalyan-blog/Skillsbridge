from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # JWT Security
    SECRET_KEY: str = "change-this-secret-key-in-production-very-important"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    DATABASE_URL: str = "sqlite:///./data/skillbridge.db"

    # AI APIs
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None

    # Environment
    DEBUG_MODE: bool = False
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
