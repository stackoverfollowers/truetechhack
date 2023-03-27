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
from starlette import status

from constants import get_settings
from db.models import UploadedVideo
from dependencies import ensure_admin, get_video
from schemas import UploadedVideoSchema
from tasks import preprocess_video

settings = get_settings()

router = APIRouter()


@router.get("/video/{video_id}", response_model=UploadedVideoSchema)
async def get_video_info(video: UploadedVideo = Depends(get_video)):
    return await UploadedVideoSchema.from_orm(video)


@router.post(
    "/video",
    response_model=UploadedVideoSchema,
    dependencies=(Depends(ensure_admin),),
)
async def upload_video(file: UploadFile = File(...)):
    filename = file.filename
    content_type = file.content_type
    if not content_type.startswith("video/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Files with content-type {content_type} is not supported",
        )
    path = f"{settings.STATIC_PATH}{uuid.uuid4()}-{filename}"
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    video = await UploadedVideo.create(filename=filename, path=path)
    preprocess_video.delay(video_id=video.id)
    return await UploadedVideoSchema.from_orm(video)


@router.get("/stream/{video_id}", status_code=206)
async def get_stream(
    video: UploadedVideo = Depends(get_video), video_range=Header(alias="range")
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
    "/video/{video_id}",
    dependencies=(Depends(ensure_admin),),
)
async def delete_video(video: UploadedVideo = Depends(get_video)):
    await video.delete()
    return {"status": "ok"}
