from fastapi import Depends, FastAPI
from fastapi_pagination import add_pagination
from starlette.middleware.cors import CORSMiddleware

from constants import get_settings
from db.models import User
from dependencies import get_current_user
from routers import auth_router, user_router, video_router
from schemas import UserSchema

settings = get_settings()


def create_app():
    app = FastAPI(
        title="Kion Stackoverfollowers",
        version="0.0.1",
        description="API of our solution [source code](https://github.com/stackoverfollowers/truetechhack)",
    )

    app.include_router(auth_router)
    app.include_router(video_router)
    app.include_router(user_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
    add_pagination(app)
    return app
