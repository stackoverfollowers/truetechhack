from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import SMALLINT
from sqlalchemy.orm import relationship
from sqlalchemy_utils import ChoiceType

from db.base import Base
from db.mixins import TimestampMixin


class User(Base, TimestampMixin):
    username = Column(String(length=255), unique=True, index=True, nullable=False)
    password = Column(String(length=255), nullable=False)

    uploaded_videos = relationship("Video")
    video_preferences = relationship("VideoPreferences")
    user_preference = relationship("UserPreferences")
    epileptic_timings = relationship("EpilepticTiming")

    def __str__(self):
        return f"User ({self.username})"


class Video(Base, TimestampMixin):
    DEFAULT = 0
    EPILEPTIC = 1
    NOT_EPILEPTIC = 2
    TYPE_VALUES = [DEFAULT, EPILEPTIC, NOT_EPILEPTIC]
    TYPE_CHOICES = [
        (DEFAULT, DEFAULT),
        (EPILEPTIC, EPILEPTIC),
        (NOT_EPILEPTIC, NOT_EPILEPTIC),
    ]

    author_id = Column(ForeignKey("user.id"), index=True, nullable=False)
    filename = Column(String(length=255), nullable=False)
    path = Column(String(length=255), nullable=False)
    preprocessed = Column(Boolean, default=False, nullable=False)
    type = Column(ChoiceType(TYPE_CHOICES, impl=Integer()), default=DEFAULT)

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

    def update_from_dict(self, **kwargs):
        for field, value in kwargs.items():
            if hasattr(self, field):
                setattr(self, field, value)


class UserPreferences(Base, TimestampMixin):
    DEFAULT = "default"
    PROT = "prot"
    DEUT = "deut"
    TRIT = "trit"

    THEME_VALUES = (DEFAULT, PROT, DEUT, TRIT)

    THEME_CHOICES = [
        (DEFAULT, DEFAULT),
        (PROT, PROT),
        (DEUT, DEUT),
        (TRIT, TRIT),
    ]

    user_id = Column(
        ForeignKey("user.id", ondelete="CASCADE"), index=True, nullable=False
    )
    theme = Column(ChoiceType(THEME_CHOICES, impl=String()), default="default")

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

    author_id = Column(ForeignKey("user.id"), default=None, nullable=True)

    video = relationship("Video", back_populates="epileptic_timings")
    author = relationship("User", back_populates="epileptic_timings")

    def __str__(self) -> str:
        return f"({self.start_time}, {self.end_time})"
