from typing import Literal

from pydantic import BaseModel, SecretStr, validator
from schemas_mixins import PydanticTimestampMixin

from db.models import UserPreferences


class UserInSchema(BaseModel):
    username: str
    password: SecretStr


class UserSchema(UserInSchema, PydanticTimestampMixin):
    id: int

    class Config:
        orm_mode = True


class UploadedVideoSchema(BaseModel):
    id: int
    filename: str
    author_id: int

    class Config:
        orm_mode = True


class TimingSchema(BaseModel):
    start_time: int
    end_time: int

    class Config:
        orm_mode = True


class VideoTimingsSchema(BaseModel):
    id: int
    epileptic_timings: list[TimingSchema]

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    user: UserSchema


class TokenPayload(BaseModel):
    username: str
    exp: float


class VideoPreferencesInSchema(BaseModel):
    brightness: int
    contrast: int
    saturation: int


class VideoPreferencesSchema(VideoPreferencesInSchema):
    user_id: int
    video_id: int

    class Config:
        orm_mode = True


class UserPreferencesSchema(BaseModel):
    user_id: int

    theme: Literal[UserPreferences.THEME_VALUES]
    _extract_theme = validator("theme", pre=True, allow_reuse=True)(
        lambda x: str(x.code) if not isinstance(x, str) else x
    )
    is_accessible_fontsize: bool

    class Config:
        orm_mode = True


class SimpleResponseSchema(BaseModel):
    status: str
    message: str
