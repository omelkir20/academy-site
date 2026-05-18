from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    LLM_MODEL: str = "gpt-4o-mini"
    REDIS_URL: str = "redis://:redis_secret@redis:6379"
    JWT_SECRET: str = "supersecretjwtkey_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    COURSE_SERVICE_URL: str = "http://course-service:8001"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
