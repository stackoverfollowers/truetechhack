from datetime import datetime

from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from starlette import status

from constants import JWT_SECRET_KEY, JWT_ALGORITHM, ADMINS_USERNAMES
from models import TokenPayload
from db.models import User, Preferences, UploadedVideo

oauth = OAuth2PasswordBearer(tokenUrl="/login", scheme_name="JWT")


async def get_current_user(token: str = Depends(oauth)) -> User:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
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
    if user.username not in ADMINS_USERNAMES:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
