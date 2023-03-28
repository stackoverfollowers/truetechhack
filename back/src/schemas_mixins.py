import datetime


class PydanticTimestampMixin:
    created_at: datetime.datetime
    updated_at: datetime.datetime
