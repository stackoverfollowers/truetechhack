import datetime

from pydantic import BaseModel


class UserInSchema(BaseModel):
    username: str
    password: str
    
class UserSchema(UserInSchema):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
    
    class Config:
        orm_mode = True

class UploadedVideoSchema(BaseModel):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime
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


class VideoPreferencesSchema(BaseModel):
    user_id: int
    video_id: int
    
    brightness: int
    contrast: int
    saturation: int
    
    class Config:
        orm_mode = True