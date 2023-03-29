from fastapi import FastAPI, status
from fastapi_pagination import add_pagination
from handlers import http_exception_handler
from starlette.middleware.cors import CORSMiddleware

from constants import get_settings
from routers import auth_router, user_router, video_router

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
    app.add_exception_handler(
        exc_class_or_status_code=status.HTTP_400_BAD_REQUEST,
        handler=http_exception_handler,
    )
    app.add_exception_handler(
        exc_class_or_status_code=status.HTTP_404_NOT_FOUND,
        handler=http_exception_handler,
    )
    add_pagination(app)
    return app
