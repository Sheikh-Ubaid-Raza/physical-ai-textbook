from .ai_service import AIService
from sqlalchemy.orm import Session
from ..models.user import User
from ..models.translated_content import TranslatedContent
from ..utils.analytics import AnalyticsTracker
import json
from typing import Optional, List, AsyncGenerator
import asyncio

class TranslationService:
    def __init__(self):
        self.ai_service = AIService()

    async def translate_to_urdu(
        self,
        content: str,
        preserve_technical_terms: bool = True,
        content_type: str = "text",
        user_id: str = "unknown"
    ) -> str:
        """
        Translate content to Urdu while preserving technical terms
        """
        # Load the translation prompt template
        try:
            with open("backend/templates/urdu_translation_prompt.txt", "r", encoding="utf-8") as f:
                prompt_template = f.read()
        except FileNotFoundError:
            # Fallback prompt if template file is not found
            prompt_template = """
You are an AI assistant that translates educational content from English to Urdu.
Content to translate: {content}
Translate the content to Urdu while preserving technical terms in English.
"""

        # Format the prompt with content
        formatted_prompt = prompt_template.format(content=content)

        # Call AI service to translate content
        translated_content = await self.ai_service.generate_response(formatted_prompt)

        # Track analytics
        AnalyticsTracker.track_translation(
            user_id=user_id,
            content_length=len(content),
            target_language="urdu",
            preserve_terms=preserve_technical_terms
        )

        return translated_content

    def get_translated_content_by_cache_key(
        self,
        db: Session,
        cache_key: str
    ) -> Optional[str]:
        """
        Retrieve translated content by cache key if it exists
        """
        record = db.query(TranslatedContent).filter(
            TranslatedContent.cache_key == cache_key
        ).first()

        if record:
            return record.translated_content
        return None

    async def translate_to_urdu_stream(
        self,
        content: str,
        preserve_technical_terms: bool = True,
        content_type: str = "text",
        user_id: str = "unknown"
    ) -> AsyncGenerator[str, None]:
        """
        Stream translation to Urdu while preserving technical terms
        """
        # Load the translation prompt template
        try:
            with open("backend/templates/urdu_translation_prompt.txt", "r", encoding="utf-8") as f:
                prompt_template = f.read()
        except FileNotFoundError:
            # Fallback prompt if template file is not found
            prompt_template = """
You are an AI assistant that translates educational content from English to Urdu.
Content to translate: {content}
Translate the content to Urdu while preserving technical terms in English.
"""

        # Format the prompt with content
        formatted_prompt = prompt_template.format(content=content)

        # Track analytics for streaming translation
        AnalyticsTracker.track_translation(
            user_id=user_id,
            content_length=len(content),
            target_language="urdu",
            preserve_terms=preserve_technical_terms
        )

        # Call AI service to stream translation
        async for chunk in self.ai_service.generate_response_stream(formatted_prompt):
            yield chunk