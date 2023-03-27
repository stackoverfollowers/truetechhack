from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, Optional, Union

from pydantic import BaseSettings, PostgresDsn, RedisDsn, validator


class Settings(BaseSettings):
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_HOST: str
    POSTGRES_DB: str
    POSTGRES_PORT: str
    DATABASE_URI: Optional[PostgresDsn] = None

    @validator("DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+asyncpg",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_HOST"),
            path=f'/{values.get("POSTGRES_DB") or ""}',
            port=f'{values.get("POSTGRES_PORT") or ""}',
        )

    REDIS_HOST: str
    REDIS_PORT: str
    REDIS_PASSWORD: str

    REDIS_URI: Optional[RedisDsn] = None

    @validator("REDIS_URI", pre=True)
    def assemble_redis_uri(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return RedisDsn.build(
            scheme="redis",
            host=values.get("REDIS_HOST"),
            port=values.get("REDIS_PORT"),
            password=values.get("REDIS_PASSWORD"),
            path="/1",
        )

    CELERY_DBURI: Optional[PostgresDsn] = None

    @validator("CELERY_DBURI", pre=True)
    def assemble_celery_dburi(cls, v: Optional[str], values: Union[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        return PostgresDsn.build(
            scheme="postgresql+psycopg2",
            user=values.get("POSTGRES_USER"),
            password=values.get("POSTGRES_PASSWORD"),
            host=values.get("POSTGRES_HOST"),
            path=f"/{values.get('POSTGRES_DB') or ''}",
            port=f"{values.get('POSTGRES_PORT') or ''}",
        )

    JWT_SECRET_KEY: str
    JWT_REFRESH_SECRET_KEY: str

    STATIC_PATH: Path

    @validator("STATIC_PATH")
    def validate_path(cls, v):
        return Path(v)

    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7
    JWT_ALGORITHM = "HS256"
    CHUNK_SIZE = 1024 * 1024

    ADMINS_USERNAMES = ["admin"]


@lru_cache()
def get_settings():
    return Settings()
