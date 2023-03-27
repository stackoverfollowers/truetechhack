from routers.auth import router as auth_router
from routers.preferences import router as preferences_router
from routers.video import router as video_router

__all__ = ["auth_router", "video_router", "preferences_router"]
