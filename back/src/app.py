from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from constants import (
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_DB,
)
from dependencies import get_current_user, get_user_preferences
from models import User_Pydantic, Preferences_Pydantic
from db.models import User, Preferences
from routers import auth_router, video_router

def create_app():
    app = FastAPI()

    @app.get("/me")
    async def get_me(user: User = Depends(get_current_user)):
        return await User_Pydantic.from_tortoise_orm(user)


    @app.get("/preferences")
    async def get_preferences(preferences: Preferences = Depends(get_user_preferences)):
        return await Preferences_Pydantic.from_tortoise_orm(preferences)


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
        db_url=f"postgres://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:5432/{POSTGRES_DB}",
        modules={"models": ["db.models"]},
        generate_schemas=True,
        add_exception_handlers=True,
    )
    return app
