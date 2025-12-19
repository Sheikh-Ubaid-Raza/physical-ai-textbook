from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, Optional, AsyncGenerator
import json
import logging
from ...services.personalization_service import PersonalizationService
from ...config.database import get_db
from ...models.user import User
from ...models.personalized_content import PersonalizedContent
from ...utils.analytics import AnalyticsTracker


router = APIRouter(prefix="/personalize", tags=["personalize"])

logger = logging.getLogger(__name__)


class PersonalizeRequest(BaseModel):
    content: str
    content_type: str  # "text", "markdown", "html"
    context: Optional[Dict[str, Any]] = None


class PersonalizeResponse(BaseModel):
    original_content: str
    personalized_content: str
    user_background: Dict[str, Any]
    cache_hit: bool


@router.post("/")
async def personalize_content(
    request: Request,
    personalize_request: PersonalizeRequest,
    db: Session = Depends(get_db)
) -> PersonalizeResponse:
    """
    Personalize content based on user's background information.

    This endpoint takes content and personalizes it according to the user's
    software background level, hardware experience, and learning goals.
    """
    try:
        # Get user from request (assuming auth middleware adds user to request)
        user = getattr(request.state, 'user', None)
        if not user:
            # If no user is authenticated, return original content
            return PersonalizeResponse(
                original_content=personalize_request.content,
                personalized_content=personalize_request.content,
                user_background={},
                cache_hit=False
            )

        # Get user details from database
        user_db = db.query(User).filter(User.id == user.get('id')).first()
        if not user_db:
            raise HTTPException(status_code=404, detail="User not found")

        user_background = {
            "software_background": user_db.software_background,
            "hardware_background": user_db.hardware_background,
            "learning_goal": user_db.learning_goal
        }

        # Check for cached personalized content
        cache_key = f"{user_db.id}:{hash(personalize_request.content)}"
        cached_content = db.query(PersonalizedContent).filter(
            PersonalizedContent.cache_key == cache_key
        ).first()

        if cached_content:
            logger.info(f"Cache hit for user {user_db.id}")
            return PersonalizeResponse(
                original_content=personalize_request.content,
                personalized_content=cached_content.personalized_content,
                user_background=user_background,
                cache_hit=True
            )

        # Track analytics for personalization
        AnalyticsTracker.track_personalization(
            user_id=user_db.id,
            content_length=len(personalize_request.content),
            user_background=user_background
        )

        # Call personalization service
        personalization_service = PersonalizationService()
        personalized_content = await personalization_service.personalize_content(
            content=personalize_request.content,
            user_background={**user_background, "user_id": user_db.id},  # Include user_id in background
            content_type=personalize_request.content_type,
            context=personalize_request.context
        )

        # Save to cache
        new_cache_entry = PersonalizedContent(
            user_id=user_db.id,
            original_content=personalize_request.content,
            personalized_content=personalized_content,
            cache_key=cache_key,
            content_type=personalize_request.content_type
        )
        db.add(new_cache_entry)
        db.commit()

        return PersonalizeResponse(
            original_content=personalize_request.content,
            personalized_content=personalized_content,
            user_background=user_background,
            cache_hit=False
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in personalize_content: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during personalization")


@router.post("/stream")
async def personalize_content_stream(
    request: Request,
    personalize_request: PersonalizeRequest,
    db: Session = Depends(get_db)
) -> StreamingResponse:
    """
    Personalize content based on user's background information with streaming response.

    This endpoint streams the personalization response in real-time as it's generated,
    providing a better user experience for longer content.
    """
    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            # Get user from request (assuming auth middleware adds user to request)
            user = getattr(request.state, 'user', None)
            if not user:
                # If no user is authenticated, return original content
                yield f"data: {json.dumps({'type': 'complete', 'content': personalize_request.content})}\n\n"
                return

            # Get user details from database
            user_db = db.query(User).filter(User.id == user.get('id')).first()
            if not user_db:
                raise HTTPException(status_code=404, detail="User not found")

            user_background = {
                "software_background": user_db.software_background,
                "hardware_background": user_db.hardware_background,
                "learning_goal": user_db.learning_goal
            }

            # Check for cached personalized content
            cache_key = f"{user_db.id}:{hash(personalize_request.content)}"
            cached_content = db.query(PersonalizedContent).filter(
                PersonalizedContent.cache_key == cache_key
            ).first()

            if cached_content:
                logger.info(f"Cache hit for user {user_db.id}")
                yield f"data: {json.dumps({'type': 'cache_hit', 'content': cached_content.personalized_content})}\n\n"
                yield f"data: {json.dumps({'type': 'complete', 'original_content': personalize_request.content, 'personalized_content': cached_content.personalized_content, 'user_background': user_background, 'cache_hit': True})}\n\n"
                return

            # Initialize cache entry for this personalization
            new_cache_entry = PersonalizedContent(
                user_id=user_db.id,
                original_content=personalize_request.content,
                personalized_content="",
                cache_key=cache_key,
                content_type=personalize_request.content_type
            )
            db.add(new_cache_entry)
            db.flush()  # Get the ID without committing

            # Track analytics for personalization
            AnalyticsTracker.track_personalization(
                user_id=user_db.id,
                content_length=len(personalize_request.content),
                user_background=user_background
            )

            # Call personalization service with streaming
            personalization_service = PersonalizationService()
            full_personalized_content = ""

            async for chunk in personalization_service.personalize_content_stream(
                content=personalize_request.content,
                user_background={**user_background, "user_id": user_db.id},  # Include user_id in background
                content_type=personalize_request.content_type,
                context=personalize_request.context
            ):
                full_personalized_content += chunk
                yield f"data: {json.dumps({'type': 'chunk', 'content': chunk})}\n\n"

            # Update the cache entry with the full content
            new_cache_entry.personalized_content = full_personalized_content
            db.commit()

            yield f"data: {json.dumps({'type': 'complete', 'original_content': personalize_request.content, 'personalized_content': full_personalized_content, 'user_background': user_background, 'cache_hit': False})}\n\n"

        except Exception as e:
            logger.error(f"Error in personalize_content_stream: {str(e)}")
            yield f"data: {json.dumps({'type': 'error', 'message': 'Personalization failed'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/health")
async def health_check():
    """Health check endpoint for the personalization service."""
    return {"status": "healthy", "service": "personalization"}


# Additional endpoints for cache management
@router.delete("/cache/{user_id}")
async def clear_user_cache(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Clear cached personalized content for a specific user."""
    try:
        deleted_count = db.query(PersonalizedContent).filter(
            PersonalizedContent.user_id == user_id
        ).delete()
        db.commit()
        return {"message": f"Cleared {deleted_count} cached entries for user {user_id}"}
    except Exception as e:
        logger.error(f"Error clearing cache for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error clearing cache")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(router, host="0.0.0.0", port=8000)