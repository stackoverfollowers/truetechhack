import shutil
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from starlette import status
from starlette.responses import StreamingResponse

from constants import STATIC_PATH
from dependencies import get_video, ensure_admin
from models import UploadedVideo_Pydantic, UploadedVideoInfo_Pydantic
from db.models import UploadedVideo

router = APIRouter()


@router.get("/video/{video_id}", response_model=UploadedVideoInfo_Pydantic)
async def get_video_info(video: UploadedVideo = Depends(get_video)):
    return await UploadedVideoInfo_Pydantic.from_tortoise_orm(video)


@router.post(
    "/video",
    response_model=UploadedVideo_Pydantic,
    dependencies=(Depends(ensure_admin),),
)
async def upload_video(file: UploadFile = File()):
    filename = file.filename
    content_type = file.content_type
    if content_type != "video/mp4":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Files with content-type {content_type} is not supported",
        )
    path = f"{STATIC_PATH}{uuid.uuid4()}-{filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    video = await UploadedVideo.create(filename=filename, path=path)
    return await UploadedVideo_Pydantic.from_tortoise_orm(video)


@router.get("/stream/{video_id}", status_code=206)
async def get_stream(video: UploadedVideo = Depends(get_video)):
    video_path = video.path

    def iter_file():
        with open(video_path, "rb") as video_file:
            yield from video_file

    return StreamingResponse(iter_file(), status_code=206, media_type="video/mp4")


@router.delete(
    "/video/{video_id}",
    dependencies=(Depends(ensure_admin),),
)
async def delete_video(video: UploadedVideo = Depends(get_video)):
    await video.delete()
    return {"status": "ok"}
