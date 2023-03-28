import datetime

from pydantic import BaseModel, SecretStr

from schemas_mixins import PydanticTimestampMixin
from utils import SiteTheme


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

    theme: SiteTheme

    class Config:
        orm_mode = True
        use_enum_values = True
