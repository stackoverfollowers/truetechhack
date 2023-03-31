import logging
from contextlib import contextmanager
from collections.abc import AsyncGenerator

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import Session, scoped_session, sessionmaker

from config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()
async_engine = create_async_engine(url=settings.DATABASE_URI)

engine = create_engine(url=settings.CELERY_DBURI)


@contextmanager
def get_session() -> Session:
    connection = engine.connect()
    session = scoped_session(
        sessionmaker(
            autocommit=False,
            autoflush=True,
            bind=engine,
        )
    )
    yield session
    session.close()
    connection.close()


async def get_async_session() -> AsyncGenerator:
    async_session = sessionmaker(
        async_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except (SQLAlchemyError, HTTPException) as exc:
            await session.rollback()
            logger.exception(exc)
            raise exc
        finally:
            await session.close()
