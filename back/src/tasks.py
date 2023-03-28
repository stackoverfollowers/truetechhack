import logging

from preprocess_model import calculate_gray_timings

from celery_conf import celery as celery_app
from db.engine import get_session
from db.models import EpilepticTiming, Video

logger = logging.getLogger(__name__)


@celery_app.task(
    bind=True,
    name="preprocess_video",
    track_started=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 7, "countdown": 5},
)
def preprocess_video_task(self, video_id: int) -> None:
    with get_session() as session:
        video = session.query(Video).get(video_id)
        timings = calculate_gray_timings(video_filename=video.path)
        for start, end in timings:
            video.epileptic_timings.append(
                EpilepticTiming(start_time=start, end_time=end)
            )
        video.preprocessed = True
        session.commit()


@celery_app.task(
    bind=True,
    name="create_ml_model",
    track_started=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 7, "countdown": 5},
)
def create_ml_model_task(self):
    pass