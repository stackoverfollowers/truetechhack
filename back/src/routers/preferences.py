from fastapi import APIRouter, Depends

from db.models import Preferences, User
from dependencies import get_user_preferences, get_current_user
from schemas import PreferencesSchema, PreferencesInSchema

router = APIRouter()


@router.get("/preferences", response_model=PreferencesSchema)
async def get_preferences(preferences: Preferences = Depends(get_user_preferences)):
    return await PreferencesSchema.from_tortoise_orm(preferences)


@router.patch("preferences")
async def post_preferences(form_data: PreferencesInSchema,
                           preferences: Preferences = Depends(get_user_preferences)
                           ):
    await preferences.update_from_dict(form_data.dict())
    return {"status": "ok"}
