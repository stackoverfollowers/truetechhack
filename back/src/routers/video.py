import os
import shutil
import uuid
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    Header,
    HTTPException,
    Response,
    UploadFile,
)
from fastapi_pagination import Page
from fastapi_pagination.ext.async_sqlalchemy import paginate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette import status

from constants import get_settings
from db.engine import get_async_session
from db.models import User, Video, VideoPreferences
from dependencies import ensure_admin, get_current_user, get_video, get_video_with_timings, get_video_prefs
from schemas import UploadedVideoSchema, VideoTimingsSchema, VideoPreferencesSchema, VideoPreferencesInSchema
from tasks import preprocess_video_task

settings = get_settings()

router = APIRouter(tags=["videos"], prefix="/videos")


@router.get("/{video_id}", response_model=UploadedVideoSchema)
async def get_video_info(video: Video = Depends(get_video)):
    return UploadedVideoSchema.from_orm(video)


@router.post(
    "/",
    response_model=UploadedVideoSchema,
    dependencies=(Depends(ensure_admin),),
)
async def upload_video(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    filename = file.filename
    content_type = file.content_type
    if not content_type.startswith("video/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Files with content-type {content_type} is not supported",
        )
    path = settings.STATIC_PATH / f"{uuid.uuid4()}-{filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    video = Video(author=user, path=str(path), filename=filename)
    session.add(video)
    await session.commit()
    await session.refresh(video)
    preprocess_video_task.delay(video_id=video.id)
    return UploadedVideoSchema.from_orm(video)


@router.get("/{video_id}/stream", status_code=206)
async def get_stream(
    video: Video = Depends(get_video), video_range=Header(alias="range")
):
    video_path = video.path
    start, end = video_range.replace("bytes=", "").split("-")
    start = int(start)
    end = int(end) if end else start + settings.CHUNK_SIZE
    with open(video_path, "rb") as video:
        video.seek(start)
        data = video.read(end - start)
        filesize = str(Path(video_path).stat().st_size)
        headers = {
            "Content-Range": f"bytes {start}-{end}/{filesize}",
            "Accept-Ranges": "bytes",
        }
        return Response(data, status_code=206, headers=headers, media_type="video/mp4")


@router.delete(
    "/{video_id}",
    dependencies=(Depends(ensure_admin),),
)
async def delete_video(
    video: Video = Depends(get_video),
    session: AsyncSession = Depends(get_async_session),
):
    path = video.path
    await session.delete(video)
    if os.path.exists(path):
        os.remove(path)
    return {"status": "ok"}


@router.get("/g{video_id}/timings")
async def get_video_timings(video: Video = Depends(get_video_with_timings)):
    return VideoTimingsSchema.from_orm(video)


@router.get("/", response_model=Page[UploadedVideoSchema])
async def get_videos_paginator(
    preprocessed: bool = True,
    session: AsyncSession = Depends(get_async_session),
):
    return await paginate(session, select(Video).filter_by(preprocessed=preprocessed))


@router.get("/{video_id}/preferences")
async def get_video_preferences(video_preferences: VideoPreferences = Depends(get_video_prefs)):
    return VideoPreferencesSchema.from_orm(video_preferences)


@router.put("/{video_id}/preferences")
async def put_video_preferences(
        form_data: VideoPreferencesInSchema,
        current_prefs: VideoPreferences = Depends(get_video_prefs),
        session: AsyncSession = Depends(get_async_session)):
    current_prefs.update_from_dict(**form_data.dict())
    session.add(current_prefs)
    await session.commit()
    return VideoPreferencesSchema.from_orm(current_prefs)
