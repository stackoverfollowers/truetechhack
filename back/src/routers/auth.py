from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from starlette import status

from db.models import Preferences, User
from schemas import Token, UserInSchema, UserSchema
from utils import (
    create_access_token,
    create_refresh_token,
    get_hashed_password,
    verify_password,
)

router = APIRouter()


@router.post("/signup", response_model=UserSchema)
async def create_user(data: UserInSchema):
    user = await User.get_or_none(username=data.username)
    if user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this username is already exist",
        )
    user = await User.create(
        username=data.username, password=get_hashed_password(data.password)
    )
    await Preferences.create(user=user)
    return await UserSchema.from_tortoise_orm(user)


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await User.get_or_none(username=form_data.username)
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
    )
