from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.engine import get_async_session
from db.models import UserPreferences
from dependencies import get_user_preferences
from schemas import UserPreferencesSchema

router = APIRouter()


@router.get("/preferences", response_model=UserPreferencesSchema)
async def get_preferences(preferences: UserPreferences = Depends(get_user_preferences)):
    return UserPreferencesSchema.from_orm(preferences)


@router.put("/preferences")
async def post_preferences(
    form_data: UserPreferencesSchema,
    preferences: UserPreferences = Depends(get_user_preferences),
    session: AsyncSession = Depends(get_async_session),
):
    preferences.update_from_dict(form_data.dict())
    session.add(preferences)
    await session.commit()
    return {"status": "ok"}
