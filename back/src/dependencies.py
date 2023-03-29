import uuid
from datetime import datetime

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from starlette import status

from constants import get_settings
from db.engine import get_async_session
from db.models import EpilepticTiming, User, UserPreferences, Video, VideoPreferences
from schemas import TokenPayload

settings = get_settings()

oauth = OAuth2PasswordBearer(tokenUrl="/api/auth/login", scheme_name="JWT")


async def get_current_user(
    token: str = Depends(oauth), session: AsyncSession = Depends(get_async_session)
) -> User:
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM]
        )
        token_data = TokenPayload(**payload)

        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    q = select(User).filter_by(username=token_data.username)

    user = (await session.execute(q)).scalars().first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find user",
        )
    return user


async def get_user_preferences(
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
) -> UserPreferences:
    q = select(UserPreferences).filter_by(user=user)
    prefs = (await session.execute(q)).scalars().first()
    if prefs is not None:
        return prefs
    prefs = UserPreferences(user=user)
    session.add(prefs)
    return prefs


async def get_video(
    video_id: int, session: AsyncSession = Depends(get_async_session)
) -> Video:
    video = await session.get(Video, video_id)
    if video is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )
    return video


async def get_video_with_timings(
    video_id: int, session: AsyncSession = Depends(get_async_session)
) -> Video:
    q = (
        select(Video)
        .filter_by(id=video_id)
        .options(selectinload(Video.epileptic_timings))
    )
    video = (await session.execute(q)).scalars().first()
    if video is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )
    return video


async def get_video_prefs(
    video_id: int,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
) -> VideoPreferences:
    q = select(VideoPreferences).filter_by(user=user, video_id=video_id)
    prefs = (await session.execute(q)).scalars().first()
    if prefs is not None:
        return prefs
    prefs = VideoPreferences(user=user, video_id=video_id)
    session.add(prefs)
    await session.commit()
    await session.refresh(prefs)
    return prefs


async def ensure_admin(user: User = Depends(get_current_user)):
    if user.username not in settings.ADMINS_USERNAMES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
