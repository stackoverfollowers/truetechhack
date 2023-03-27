from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator

from db.models import User, Preferences, UploadedVideo

UserInSchema = pydantic_model_creator(User, name="UserIn", exclude_readonly=True)
UserSchema = pydantic_model_creator(User, name="User", exclude=("password",))

PreferencesSchema = pydantic_model_creator(Preferences, name="Preferences")
PreferencesInSchema = pydantic_model_creator(Preferences, name="PreferencesIn", exclude_readonly=True)

UploadedVideoSchema = pydantic_model_creator(UploadedVideo, name="UploadedVideo")
UploadedVideoInfoSchema = pydantic_model_creator(
    UploadedVideo, name="UploadedVideoInfo", exclude=("path",)
)


class Token(BaseModel):
    access_token: str
    refresh_token: str


class TokenPayload(BaseModel):
    username: str
    exp: float
