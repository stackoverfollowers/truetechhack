from pydantic import BaseModel
from tortoise.contrib.pydantic import pydantic_model_creator

from db.models import User, Preferences, UploadedVideo

UserIn_Pydantic = pydantic_model_creator(User, name="UserIn", exclude_readonly=True)
User_Pydantic = pydantic_model_creator(User, name="User", exclude=("password",))

Preferences_Pydantic = pydantic_model_creator(Preferences, name="Preferences")

UploadedVideo_Pydantic = pydantic_model_creator(UploadedVideo, name="UploadedVideo")
UploadedVideoInfo_Pydantic = pydantic_model_creator(
    UploadedVideo, name="UploadedVideoInfo", exclude=("path",)
)


class Token(BaseModel):
    access_token: str
    refresh_token: str


class TokenPayload(BaseModel):
    username: str
    exp: float
