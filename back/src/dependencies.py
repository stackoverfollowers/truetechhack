from datetime import datetime

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from starlette import status

from constants import get_settings
from db.models import Preferences, UploadedVideo, User
from schemas import TokenPayload

settings = get_settings()

oauth = OAuth2PasswordBearer(tokenUrl="/login", scheme_name="JWT")


async def get_current_user(token: str = Depends(oauth)) -> User:
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

    user = await User.get_or_none(username=token_data.username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find user",
        )
    return user


async def get_user_preferences(user: User = Depends(get_current_user)) -> Preferences:
    preferences, _ = await Preferences.get_or_create(user=user)
    return preferences


async def get_video(video_id: int) -> UploadedVideo:
    video = await UploadedVideo.get_or_none(pk=video_id)
    if video is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )
    return video


async def ensure_admin(user: User = Depends(get_current_user)):
    # Бичевская реализация "админки :)"
    if user.username not in settings.ADMINS_USERNAMES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
