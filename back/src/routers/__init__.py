from routers.auth import router as auth_router
from routers.user import router as user_router
from routers.video import router as video_router

__all__ = ["auth_router", "video_router", "user_router"]
