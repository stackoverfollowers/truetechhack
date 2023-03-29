import logging

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse

from schemas import SimpleResponseSchema

logger = logging.getLogger(__name__)


def http_exception_handler(request: Request, exc: HTTPException):
    """Хэндлер для HTTPException"""
    logger.warning(f"Exception with status code: {exc.status_code}")
    return JSONResponse(
        status_code=exc.status_code,
        content=SimpleResponseSchema(status="failed", message=exc.detail).dict(),
    )
