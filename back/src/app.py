from fastapi import Depends, FastAPI
from starlette.middleware.cors import CORSMiddleware

from constants import get_settings
from db.models import User, UserPreferences
from dependencies import get_current_user, get_user_preferences
from routers import auth_router, video_router
from schemas import UserPreferencesSchema, UserSchema

settings = get_settings()


def create_app():
    app = FastAPI()

    @app.get("/me")
    async def get_me(user: User = Depends(get_current_user)):
        return UserSchema.from_orm(user)

    @app.get("/preferences")
    async def get_preferences(
        preferences: UserPreferences = Depends(get_user_preferences),
    ):
        return UserPreferencesSchema.from_orm(preferences)

    app.include_router(auth_router)
    app.include_router(video_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
    return app
