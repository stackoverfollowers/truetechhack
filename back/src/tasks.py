import logging

from celery_conf import celery as celery_app

logger = logging.getLogger(__name__)


@celery_app.task(
    bind=True,
    name="preprocess_video",
    track_started=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 7, "countdown": 5},
)
def preprocess_video(self, video_id: int) -> None:
    logger.info("passed!")
