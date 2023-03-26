from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

from constants import (
    JWT_SECRET_KEY,
    REFRESH_TOKEN_EXPIRE_MINUTES,
    JWT_REFRESH_SECRET_KEY,
    JWT_ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_context.verify(password, hashed_password)


def create_access_token(username: str) -> str:
    expires_delta = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    encode_data = {"exp": expires_delta, "username": username}
    return jwt.encode(encode_data, JWT_SECRET_KEY, JWT_ALGORITHM)


def create_refresh_token(username: str) -> str:
    expires_delta = datetime.utcnow() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    encode_data = {"exp": expires_delta, "username": username}
    return jwt.encode(encode_data, JWT_REFRESH_SECRET_KEY, JWT_ALGORITHM)
