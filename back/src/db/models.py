from tortoise import Model, fields


class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=255, unique=True)
    password = fields.CharField(max_length=255)
    created_at = fields.DatetimeField(auto_now_add=True)
    last_modified_at = fields.DatetimeField(auto_now=True)


class Preferences(Model):
    id = fields.IntField(pk=True)
    user = fields.ForeignKeyField("models.User")
    brightness = fields.IntField(default=100)
    contrast = fields.IntField(default=100)
    saturation = fields.IntField(default=100)
    sharpness = fields.IntField(default=100)


class UploadedVideo(Model):
    id = fields.IntField(pk=True)
    filename = fields.CharField(max_length=255)
    path = fields.CharField(max_length=255, unique=True)
    created_at = fields.DatetimeField(auto_now_add=True)
    last_modified_at = fields.DatetimeField(auto_now=True)
