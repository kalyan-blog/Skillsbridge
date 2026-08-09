from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # JWT
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # AI
    GEMINI_API_KEY: Optional[str] = None

    # Environment
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
