from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.engine import get_async_session
from db.models import User, UserPreferences
from dependencies import get_current_user, get_user_preferences
from schemas import UserPreferencesSchema, UserSchema

router = APIRouter(tags=["user"], prefix="/users")


@router.get("/preferences", response_model=UserPreferencesSchema)
async def get_preferences(preferences: UserPreferences = Depends(get_user_preferences)):
    return UserPreferencesSchema.from_orm(preferences)


@router.put("/preferences")
async def post_preferences(
    form_data: UserPreferencesSchema,
    preferences: UserPreferences = Depends(get_user_preferences),
    session: AsyncSession = Depends(get_async_session),
):
    preferences.update_from_dict(**form_data.dict())
    session.add(preferences)
    await session.commit()
    return {"status": "ok"}


@router.get("/me")
async def get_me(user: User = Depends(get_current_user)):
    return UserSchema.from_orm(user)
