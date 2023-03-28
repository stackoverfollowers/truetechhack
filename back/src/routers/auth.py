from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette import status

from db.engine import get_async_session
from db.models import User, UserPreferences
from schemas import Token, UserInSchema, UserSchema
from utils import (
    create_access_token,
    create_refresh_token,
    get_hashed_password,
    verify_password,
)

router = APIRouter(tags=["auth"], prefix="/auth")


@router.post("/signup", response_model=UserSchema)
async def create_user(
    data: UserInSchema, session: AsyncSession = Depends(get_async_session)
):
    q = select(User).filter_by(username=data.username)

    user = (await session.execute(q)).scalars().first()
    if user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this username is already exist",
        )
    user = User(
        username=data.username,
        password=get_hashed_password(data.password.get_secret_value()),
    )
    print(data.password.get_secret_value())
    session.add(user)
    session.add(UserPreferences(user=user))
    await session.commit()
    await session.refresh(user)
    return UserSchema.from_orm(user)


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_async_session),
):
    q = select(User).filter_by(username=form_data.username)

    user = (await session.execute(q)).scalars().first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
        )
    password_verified = verify_password(
        password=form_data.password, hashed_password=user.password
    )
    if not password_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect username or password",
        )
    return Token(
        access_token=create_access_token(user.username),
        refresh_token=create_refresh_token(user.username),
        user=UserSchema.from_orm(user),
    )
