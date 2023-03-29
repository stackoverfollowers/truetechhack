from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette import status

from constants import get_settings
from db.engine import get_async_session
from db.models import User, UserPreferences
from schemas import Token, UserInSchema, UserSchema, HTTPExceptionSchema
from utils import (
    create_access_token,
    create_refresh_token,
    get_hashed_password,
    verify_password,
)

settings = get_settings()

router = APIRouter(tags=["auth"], prefix="/auth")


@router.post(
    "/signup",
    response_model=UserSchema,
    status_code=201,
    description="<h3>Creates new user with given credentials<br><br>"
                "Returns 400 if user with given username is already exist</h3>",
    responses={400: {"model": HTTPExceptionSchema}}
)
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
    session.add(user)
    session.add(UserPreferences(user=user))
    await session.commit()
    await session.refresh(user)
    return user


@router.post(
    "/login",
    response_model=Token,
    description="<h3>Authenticates user with given credentials and returns access and refresh tokens<br><br>"
                f"Access token lasts for {settings.ACCESS_TOKEN_EXPIRE_MINUTES // 60} hours<br>"
                f"Refresh token lasts for {settings.REFRESH_TOKEN_EXPIRE_MINUTES // 60 // 24} days<br><br>"
                f"Returns 400 if user credentials is incorrect (either username or password is incorrect)</h3>",
    responses={400: {"model": HTTPExceptionSchema}}
)
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
