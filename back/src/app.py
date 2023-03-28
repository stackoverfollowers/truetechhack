from fastapi import Depends, FastAPI
from fastapi_pagination import add_pagination
from starlette.middleware.cors import CORSMiddleware

from constants import get_settings
from db.models import User
from dependencies import get_current_user
from routers import auth_router, preferences_router, video_router
from schemas import UserSchema

settings = get_settings()


def create_app():
    app = FastAPI()

    @app.get("/me", tags=["user"])
    async def get_me(user: User = Depends(get_current_user)):
        return UserSchema.from_orm(user)

    app.include_router(auth_router)
    app.include_router(video_router)
    app.include_router(preferences_router)
    add_pagination(app)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
    return app
