from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from constants import get_settings
from dependencies import get_current_user, get_user_preferences
from schemas import UserSchema, PreferencesSchema
from db.models import User, Preferences
from routers import auth_router, video_router

settings = get_settings()


def create_app():
    app = FastAPI()

    @app.get("/me")
    async def get_me(user: User = Depends(get_current_user)):
        return await UserSchema.from_tortoise_orm(user)

    @app.get("/preferences")
    async def get_preferences(preferences: Preferences = Depends(get_user_preferences)):
        return await PreferencesSchema.from_tortoise_orm(preferences)

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
    register_tortoise(
        app,
        db_url=settings.TORTOISE_DB_URI,
        modules={"models": ["db.models"]},
        generate_schemas=True,
        add_exception_handlers=True,
    )
    return app
