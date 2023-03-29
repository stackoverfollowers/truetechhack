import logging
import pickle
from math import ceil
from types import MethodType

import cv2
import numpy as np
import redis
import skvideo.io
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sqlalchemy.orm import Session

from constants import get_settings
from db.models import Video

logger = logging.getLogger("celery")

SVC_MODEL_KEY = "BEST_SVC_MODEL_EVER"

settings = get_settings()


def calculate_gray_timings(video: Video, session: Session) -> list[tuple[int, int]]:
    gray_frames = get_gray_frames_from_videos([video])

    X = np.array(gray_frames).reshape(len(gray_frames), -1)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    pca = PCA(n_components=100)
    X_pca = pca.fit_transform(X_scaled)

    svm = get_svc_model(session)
    y_pred = svm.predict(X_pca)

    frame_rate = eval(skvideo.io.ffprobe(video.path)["video"]["@r_frame_rate"])
    frame_interval = 1.0 / float(frame_rate)

    timings = []
    start, end = None, None
    for i in range(len(X_pca)):
        if y_pred[i] == 1:
            ts = i * frame_interval
            if start is None:
                start = ceil(ts)
                end = start
            else:
                end = ceil(ts)
                if ts - end >= 2:
                    timings.append((start, end))
                    start = None
                    end = None

    if start is not None:
        end = end or start
        timings.append((start, end))
    return timings


def get_svc_model(session: Session) -> SVC:
    r = redis.Redis.from_url(settings.REDIS_URI)
    model = r.get(SVC_MODEL_KEY)
    if model is None:
        logger.info("Model not found!")
        model = create_svc_model(session=session)
        r.set(SVC_MODEL_KEY, pickle.dumps(model, protocol=pickle.HIGHEST_PROTOCOL))
    else:
        model = pickle.loads(model)
    return model


def nextFrame(self):
    try:
        for i in range(self.inputframenum - 1):
            yield self._readFrame()
    except:
        pass


def get_gray_frames_from_videos(videos: list[Video]) -> list:
    gray_frames = []
    for v in videos:
        logger.info("Start preprocessed file: %s", v.path)
        reader = skvideo.io.FFmpegReader(v.path)
        reader.nextFrame = MethodType(nextFrame, reader)
        for frame in reader.nextFrame():
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            resized_frame = cv2.resize(gray_frame, (64, 64))
            gray_frames.append(resized_frame)
    return gray_frames


def create_svc_model(session: Session) -> SVC:
    logger.info("Start fit model...")
    epileptic_videos = (
        session.query(Video)
        .with_entities(Video.path)
        .filter_by(type=Video.EPILEPTIC)
        .all()
    )
    gray_frames = get_gray_frames_from_videos(epileptic_videos)
    not_epileptic_videos = (
        session.query(Video)
        .with_entities(Video.path)
        .filter_by(type=Video.NOT_EPILEPTIC)
        .all()
    )
    total_epileptic_frames = len(gray_frames)
    gray_frames += get_gray_frames_from_videos(not_epileptic_videos)
    logger.info("Preprocessed gray frames!")
    X = np.array(gray_frames).reshape(len(gray_frames), -1)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    pca = PCA(n_components=100)
    X_pca = pca.fit_transform(X_scaled)
    y = np.zeros(len(gray_frames))
    seizure_start = 0
    seizure_end = total_epileptic_frames
    y[seizure_start:seizure_end] = 1
    X_train, _, y_train, _ = train_test_split(X_pca, y, test_size=0.2, random_state=42)
    svm = SVC(kernel="linear", random_state=42)
    svm.fit(X_train, y_train)
    logger.info("Model fitted!")
    return svm
