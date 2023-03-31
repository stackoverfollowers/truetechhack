import logging
import pickle
from types import MethodType
from math import ceil
from operator import truediv

import cv2
import numpy as np
import redis
import skvideo.io
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sqlalchemy.orm import Session
from sqlalchemy.future import select

from config import get_settings
from db.models import Video

logger = logging.getLogger("celery")

LR_MODEL_KEY = "BEST_SVC_MODEL_EVER"
LIMITER = 5

settings = get_settings()


def calculate_gray_timings(filename: str, session: Session) -> list[tuple[int, int]]:
    """Calculate timings for new video"""
    arr = np.array(get_comparing(get_gray_frames_from_videos([filename]))).reshape(
        -1, 1
    )
    lr = get_lr_model(session)
    answer = lr.predict(arr)

    fps = get_fps(filename)

    timings = []
    start = None
    for i in range(0, len(answer), fps):
        e_frames = sum(answer[i : i + fps])
        ts = i // fps
        if e_frames >= LIMITER:
            if start is None:
                start = ts
        else:
            if start is not None:
                timings.append([start, ts])
                start = None
    if start is not None:
        timings.append([start, start])
    return timings


def get_lr_model(session: Session) -> LogisticRegression:
    """Return model of logistic regression"""
    r = redis.Redis.from_url(settings.REDIS_URI)
    model = r.get(LR_MODEL_KEY)
    if model is None:
        logger.info("Model not found!")
        model = create_lr_model(session=session)
        logger.info("Model fitted!")
        r.set(LR_MODEL_KEY, pickle.dumps(model, protocol=pickle.HIGHEST_PROTOCOL))
    else:
        model = pickle.loads(model)  # nosec
    return model


def nextFrame(self):
    try:
        for _ in range(self.inputframenum - 1):
            yield self._readFrame()
    except RuntimeError:
        pass


def get_gray_frames_from_videos(filenames: list[str]) -> list:
    gray_frames = []
    for filename in filenames:
        logger.info("Start preprocessed file: %s", filename)
        reader = skvideo.io.FFmpegReader(filename)
        reader.nextFrame = MethodType(nextFrame, reader)
        for frame in reader.nextFrame():
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            resized_frame = cv2.resize(gray_frame, (64, 64))
            gray_frames.append(resized_frame)
    return gray_frames


def create_lr_model(session: Session) -> LogisticRegression:
    """Fitted new model from spec videos"""
    logger.info("Start fit model...")
    epileptic_videos = (
        session.query(Video.path)
        .with_entities(Video.path)
        .filter_by(type=Video.EPILEPTIC)
        .all()
    )
    session.scalars(select(Video.path).where(Video.type == Video.EPILEPTIC)).all()
    frames = get_comparing(get_gray_frames_from_videos(epileptic_videos))
    not_epileptic_videos = (
        session.query(Video)
        .with_entities(Video.path)
        .filter_by(type=Video.NOT_EPILEPTIC)
        .all()
    )
    e_frames_length = len(frames)
    frames += get_comparing(get_gray_frames_from_videos(not_epileptic_videos))
    logger.info("Preprocessed gray frames!")
    y = np.zeros(len(frames))
    y[:e_frames_length] = 1
    df = pd.DataFrame({"x": frames, "y": y})
    df = df[df["x"] < 0.8]
    return LogisticRegression(random_state=0).fit(
        np.array(df["x"]).reshape(-1, 1), df["y"]
    )


def get_comparing(frames: list) -> np.array:
    comparing = []
    for i in range(len(frames) - 1):
        hist1 = cv2.calcHist(frames[i], [0], None, [256], [0, 256])
        hist2 = cv2.calcHist(frames[i + 1], [0], None, [256], [0, 256])
        comparing.append(cv2.compareHist(hist1, hist2, cv2.HISTCMP_CORREL))
    return comparing


def get_fps(filename: str) -> int:
    str_fps = skvideo.io.ffprobe(filename)["video"]["@r_frame_rate"]
    return ceil(truediv(*map(int, str_fps.split("/"))))
