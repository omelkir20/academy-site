from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://learning:learning_secret@postgres:5432/learning_db"
    REDIS_URL: str = "redis://:redis_secret@redis:6379"
    JWT_SECRET: str = "supersecretjwtkey_change_in_production"
    JWT_ALGORITHM: str = "HS256"
    MINIO_ENDPOINT: str = "minio"
    MINIO_PORT: int = 9000
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin_secret"
    MINIO_BUCKET: str = "course-media"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
