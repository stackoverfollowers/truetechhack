from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import SMALLINT
from sqlalchemy.orm import relationship
from sqlalchemy_utils import ChoiceType

from db.base import Base
from db.mixins import TimestampMixin
from utils import SiteTheme


class User(Base, TimestampMixin):
    username = Column(String(length=255), unique=True, index=True, nullable=False)
    password = Column(String(length=255), nullable=False)

    uploaded_videos = relationship("Video")
    video_preferences = relationship("VideoPreferences")
    user_preference = relationship("UserPreferences")

    def __str__(self):
        return f"User ({self.username})"


class Video(Base, TimestampMixin):
    author_id = Column(ForeignKey("user.id"), index=True, nullable=False)
    filename = Column(String(length=255), nullable=False)
    path = Column(String(length=255), nullable=False)
    preprocessed = Column(Boolean, default=False, nullable=False)

    author = relationship("User", back_populates="uploaded_videos")

    epileptic_timings = relationship("EpilepticTiming")

    video_preferences = relationship("VideoPreferences")

    def __str__(self) -> str:
        return (
            f"Video (name: {self.name}, path: {self.path}"
            f" preprocessed: {self.preprocessed})"
        )


class VideoPreferences(Base, TimestampMixin):
    user_id = Column(ForeignKey("user.id"), index=True, nullable=False)
    video_id = Column(ForeignKey("video.id"), index=True, nullable=False)

    brightness = Column(SMALLINT, default=100, nullable=False)
    contrast = Column(SMALLINT, default=100, nullable=False)
    saturation = Column(SMALLINT, default=100, nullable=False)

    user = relationship("User", back_populates="video_preferences")
    video = relationship("Video", back_populates="video_preferences")

    def __str__(self) -> str:
        return f"Preferences (b: {self.brightness} c: {self.contrast} s: {self.saturation})"


class UserPreferences(Base, TimestampMixin):
    user_id = Column(
        ForeignKey("user.id", ondelete="CASCADE"), index=True, nullable=False
    )
    theme = Column(ChoiceType(SiteTheme, impl=String()), default="default")

    user = relationship("User", back_populates="user_preference", uselist=False)

    def __str__(self) -> str:
        return f"UserPreferences (theme: {self.theme})"

    def update_from_dict(self, **kwargs):
        for field, value in kwargs.items():
            if hasattr(self, field):
                setattr(self, field, value)


class EpilepticTiming(Base):
    video_id = Column(ForeignKey("video.id"), index=True, nullable=False)

    start_time = Column(Integer, nullable=False)
    end_time = Column(Integer, nullable=False)

    def __str__(self) -> str:
        return f"({self.start_time}, {self.end_time})"
