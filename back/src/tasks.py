from celery_conf import celery as celery_app


@celery_app.task(bind=True, name='preprocess_video', track_started=True)
def preprocess_video(self, video_id: int) -> None:
    pass