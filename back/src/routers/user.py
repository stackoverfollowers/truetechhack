from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from db.engine import get_async_session
from db.models import User, UserPreferences
from dependencies import get_current_user, get_user_preferences
from schemas import SimpleResponseSchema, UserPreferencesSchema, UserSchema, HTTPExceptionSchema

router = APIRouter(tags=["user"], prefix="/users")


@router.get(
    "/preferences",
    response_model=UserPreferencesSchema,
    description="<h3>Returns user's site settings.<br><br>"
                "Returns 404 if user was not found</h3>",
    responses={404: {"model": HTTPExceptionSchema}}
)
async def get_preferences(preferences: UserPreferences = Depends(get_user_preferences)):
    return preferences


@router.put(
    "/preferences",
    response_model=SimpleResponseSchema,
    status_code=200,
    description="<h3>Edits user's site settings.<br><br>"
                "Returns 404 if user was not found</h3>",
    responses={404: {"model": HTTPExceptionSchema}}
)
async def put_preferences(
    form_data: UserPreferencesSchema,
    preferences: UserPreferences = Depends(get_user_preferences),
    session: AsyncSession = Depends(get_async_session),
):
    preferences.update_from_dict(**form_data.dict())
    session.add(preferences)
    await session.commit()
    return {"status": "ok", "message": "Created!"}


@router.get(
    "/me",
    response_model=UserSchema,
    status_code=200,
    description="<h3>Returns user's information.<br><br>"
                "Returns 404 if user was not found</h3>",
    responses={404: {"model": HTTPExceptionSchema}}
)
async def get_me(user: User = Depends(get_current_user)):
    return user
