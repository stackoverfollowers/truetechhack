import os
import shutil
import uuid
from enum import IntEnum
from typing import Annotated, Literal

from fastapi import APIRouter, Body, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse
from fastapi_pagination import Page
from fastapi_pagination.ext.async_sqlalchemy import paginate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette import status

from constants import get_settings
from db.engine import get_async_session
from db.models import EpilepticTiming, User, Video, VideoPreferences
from dependencies import (
    ensure_admin,
    get_current_user,
    get_video,
    get_video_prefs,
    get_video_with_timings,
)
from schemas import (
    SimpleResponseSchema,
    UploadedVideoSchema,
    VideoPreferencesInSchema,
    VideoPreferencesSchema,
    VideoTimingsSchema,
)
from tasks import preprocess_video_task
from utils import range_requests_response

settings = get_settings()

router = APIRouter(tags=["videos"], prefix="/videos")


class VideoType(IntEnum):
    DEFAULT = Video.DEFAULT
    EPILEPTIC = Video.EPILEPTIC
    NOT_EPILEPTIC = Video.NOT_EPILEPTIC


@router.get("/", response_model=Page[UploadedVideoSchema])
async def get_videos_paginator(
    preprocessed: bool = True,
    session: AsyncSession = Depends(get_async_session),
):
    return await paginate(session, select(Video).filter_by(preprocessed=preprocessed))


@router.post(
    "/",
    response_model=UploadedVideoSchema,
)
async def upload_video(
    file: Annotated[UploadFile, File()],
    video_type: VideoType = Body(default=Video.DEFAULT),
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
    video = Video(author=user, path=str(path), filename=filename, type=video_type)
    session.add(video)
    await session.commit()
    await session.refresh(video)
    if video_type == Video.DEFAULT:
        preprocess_video_task.apply_async((video.id,), queue="preprocess_video")
    return video


@router.get("/{video_id}", response_model=UploadedVideoSchema)
async def get_video_info(video: Video = Depends(get_video)):
    return video


@router.delete(
    "/{video_id}",
    dependencies=(Depends(ensure_admin),),
    response_model=SimpleResponseSchema,
    status_code=200,
)
async def delete_video(
    video: Video = Depends(get_video),
    session: AsyncSession = Depends(get_async_session),
):
    path = video.path
    await session.delete(video)
    if os.path.exists(path):
        os.remove(path)
    return {"status": "ok", "message": "Deleted!"}


@router.get("/{video_id}/stream")
async def get_video(request: Request, video: Video = Depends(get_video)):
    return range_requests_response(
        request,
        file_path=video.path,
        content_type="video/mp4",
    )


@router.get("/{video_id}/preferences", response_model=VideoPreferencesSchema)
async def get_video_preferences(
    video_preferences: VideoPreferences = Depends(get_video_prefs),
):
    return video_preferences


@router.put(
    "/{video_id}/preferences", response_model=VideoPreferencesSchema, status_code=200
)
async def put_video_preferences(
    form_data: VideoPreferencesInSchema,
    current_prefs: VideoPreferences = Depends(get_video_prefs),
    session: AsyncSession = Depends(get_async_session),
):
    current_prefs.update_from_dict(**form_data.dict())
    session.add(current_prefs)
    await session.commit()
    return current_prefs


@router.post(
    "{video_id}/epileptic_feedback",
    response_model=SimpleResponseSchema,
    status_code=201,
    name="Send epileptic feedback",
    description="Takes user's epileptic time codes for videos.",
)
async def post_epileptic_feedback(
    start: int = Body(gt=0),
    end: int = Body(gt=0),
    video: Video = Depends(get_video),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
):
    if start > end:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Start time can't be less than end time",
        )
    q = select(EpilepticTiming).filter_by(video=video, start_time=start, end_time=end)
    timing = (await session.execute(q)).scalars().first()
    if timing:
        return
    timing = EpilepticTiming(video=video, start_time=start, end_time=end, author=user)
    session.add(timing)
    return {"status": "ok", "message": "Created!"}


@router.get("/{video_id}/timings", response_model=VideoTimingsSchema)
async def get_video_timings(video: Video = Depends(get_video_with_timings)):
    return video
