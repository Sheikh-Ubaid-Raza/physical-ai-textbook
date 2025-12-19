from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Dict, Any, Optional, AsyncGenerator
import json
import logging
from ...services.translation_service import TranslationService
from ...config.database import get_db
from ...models.user import User
from ...models.translated_content import TranslatedContent
from ...utils.analytics import AnalyticsTracker


router = APIRouter(prefix="/translate", tags=["translate"])

logger = logging.getLogger(__name__)


class TranslateRequest(BaseModel):
    content: str
    target_language: str = "urdu"  # Default to Urdu
    preserve_technical_terms: bool = True
    content_type: str = "text"  # "text", "markdown", "html"


class TranslateResponse(BaseModel):
    original_content: str
    translated_content: str
    user_background: Dict[str, Any]
    cache_hit: bool


@router.post("/")
async def translate_content(
    request: Request,
    translate_request: TranslateRequest,
    db: Session = Depends(get_db)
) -> TranslateResponse:
    """
    Translate content to Urdu while preserving technical terms.

    This endpoint takes content and translates it to Urdu, preserving
    technical terms in English to maintain accuracy.
    """
    try:
        # Get user from request (assuming auth middleware adds user to request)
        user = getattr(request.state, 'user', None)
        if not user:
            # If no user is authenticated, return original content
            return TranslateResponse(
                original_content=translate_request.content,
                translated_content=translate_request.content,
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

        # Check for cached translated content
        cache_key = f"{user_db.id}:{hash(translate_request.content)}:{translate_request.target_language}"
        cached_content = db.query(TranslatedContent).filter(
            TranslatedContent.cache_key == cache_key
        ).first()

        if cached_content:
            logger.info(f"Cache hit for user {user_db.id}")
            return TranslateResponse(
                original_content=translate_request.content,
                translated_content=cached_content.translated_content,
                user_background=user_background,
                cache_hit=True
            )

        # Call translation service
        translation_service = TranslationService()
        translated_content = await translation_service.translate_to_urdu(
            content=translate_request.content,
            preserve_technical_terms=translate_request.preserve_technical_terms,
            content_type=translate_request.content_type,
            user_id=user_db.id
        )

        # Save to cache
        new_cache_entry = TranslatedContent(
            user_id=user_db.id,
            original_content=translate_request.content,
            translated_content=translated_content,
            cache_key=cache_key,
            content_type=translate_request.content_type,
            target_language=translate_request.target_language
        )
        db.add(new_cache_entry)
        db.commit()

        return TranslateResponse(
            original_content=translate_request.content,
            translated_content=translated_content,
            user_background=user_background,
            cache_hit=False
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in translate_content: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during translation")


@router.post("/stream")
async def translate_content_stream(
    request: Request,
    translate_request: TranslateRequest,
    db: Session = Depends(get_db)
) -> StreamingResponse:
    """
    Translate content to Urdu with Server-Sent Events (SSE) streaming.

    This endpoint streams the translation response in real-time as it's generated,
    providing a better user experience for longer content.
    """
    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            # Get user from request (assuming auth middleware adds user to request)
            user = getattr(request.state, 'user', None)
            if not user:
                # If no user is authenticated, return original content
                yield f"data: {json.dumps({'type': 'complete', 'content': translate_request.content})}\n\n"
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

            # Check for cached translated content
            cache_key = f"{user_db.id}:{hash(translate_request.content)}:{translate_request.target_language}"
            cached_content = db.query(TranslatedContent).filter(
                TranslatedContent.cache_key == cache_key
            ).first()

            if cached_content:
                logger.info(f"Cache hit for user {user_db.id}")
                yield f"data: {json.dumps({'type': 'cache_hit', 'content': cached_content.translated_content})}\n\n"
                yield f"data: {json.dumps({'type': 'complete', 'original_content': translate_request.content, 'translated_content': cached_content.translated_content, 'user_background': user_background, 'cache_hit': True})}\n\n"
                return

            # Track analytics for translation
            AnalyticsTracker.track_translation(
                user_id=user_db.id,
                content_length=len(translate_request.content),
                target_language=translate_request.target_language,
                preserve_terms=translate_request.preserve_technical_terms
            )

            # Call translation service with streaming
            translation_service = TranslationService()

            # Initialize cache entry for this translation
            new_cache_entry = TranslatedContent(
                user_id=user_db.id,
                original_content=translate_request.content,
                translated_content="",
                cache_key=cache_key,
                content_type=translate_request.content_type,
                target_language=translate_request.target_language
            )
            db.add(new_cache_entry)
            db.flush()  # Get the ID without committing

            # Stream the translation
            full_translated_content = ""
            async for chunk in translation_service.translate_to_urdu_stream(
                content=translate_request.content,
                preserve_technical_terms=translate_request.preserve_technical_terms,
                content_type=translate_request.content_type,
                user_id=user_db.id
            ):
                full_translated_content += chunk
                yield f"data: {json.dumps({'type': 'chunk', 'content': chunk})}\n\n"

            # Update the cache entry with the full content
            new_cache_entry.translated_content = full_translated_content
            db.commit()

            yield f"data: {json.dumps({'type': 'complete', 'original_content': translate_request.content, 'translated_content': full_translated_content, 'user_background': user_background, 'cache_hit': False})}\n\n"

        except Exception as e:
            logger.error(f"Error in translate_content_stream: {str(e)}")
            yield f"data: {json.dumps({'type': 'error', 'message': 'Translation failed'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/health")
async def health_check():
    """Health check endpoint for the translation service."""
    return {"status": "healthy", "service": "translation"}


# Additional endpoints for cache management
@router.delete("/cache/{user_id}")
async def clear_user_translation_cache(
    user_id: str,
    db: Session = Depends(get_db)
):
    """Clear cached translated content for a specific user."""
    try:
        deleted_count = db.query(TranslatedContent).filter(
            TranslatedContent.user_id == user_id
        ).delete()
        db.commit()
        return {"message": f"Cleared {deleted_count} cached entries for user {user_id}"}
    except Exception as e:
        logger.error(f"Error clearing translation cache for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error clearing cache")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(router, host="0.0.0.0", port=8000)