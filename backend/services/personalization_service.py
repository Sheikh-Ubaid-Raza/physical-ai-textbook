from .ai_service import AIService
from sqlalchemy.orm import Session
from ..models.user import User
from ..models.personalized_content import PersonalizedContent
from ..utils.analytics import AnalyticsTracker
import json
from typing import Optional, Dict, Any, AsyncGenerator
import asyncio

class PersonalizationService:
    def __init__(self):
        self.ai_service = AIService()

    async def personalize_content(
        self,
        content: str,
        user_background: Dict[str, Any],
        content_type: str = "text",
        context: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Personalize content based on user's background information
        """
        # Load the personalization prompt template
        try:
            with open("backend/templates/personalization_prompt.txt", "r", encoding="utf-8") as f:
                prompt_template = f.read()
        except FileNotFoundError:
            # Fallback prompt if template file is not found
            prompt_template = """
You are an AI assistant that adapts educational content to match the user's background.
User Background: {software_background}, {hardware_background}, {learning_goals}
Content to personalize: {content}
Personalize the content based on the user's background.
"""

        # Format the prompt with user background and content
        formatted_prompt = prompt_template.format(
            software_background=user_background.get("software_background", ""),
            hardware_background=user_background.get("hardware_background", ""),
            learning_goals=user_background.get("learning_goal", ""),
            content=content
        )

        # Call AI service to personalize content
        personalized_content = await self.ai_service.generate_response(formatted_prompt)

        # Track analytics
        AnalyticsTracker.track_personalization(
            user_id=user_background.get("user_id", "unknown"),
            content_length=len(content),
            user_background=user_background
        )

        return personalized_content

    def get_personalized_content_by_cache_key(
        self,
        db: Session,
        cache_key: str
    ) -> Optional[str]:
        """
        Retrieve personalized content by cache key if it exists
        """
        record = db.query(PersonalizedContent).filter(
            PersonalizedContent.cache_key == cache_key
        ).first()

        if record:
            return record.personalized_content
        return None

    async def personalize_content_stream(
        self,
        content: str,
        user_background: Dict[str, Any],
        content_type: str = "text",
        context: Optional[Dict[str, Any]] = None
    ) -> AsyncGenerator[str, None]:
        """
        Stream personalized content based on user's background information
        """
        # Load the personalization prompt template
        try:
            with open("backend/templates/personalization_prompt.txt", "r", encoding="utf-8") as f:
                prompt_template = f.read()
        except FileNotFoundError:
            # Fallback prompt if template file is not found
            prompt_template = """
You are an AI assistant that adapts educational content to match the user's background.
User Background: {software_background}, {hardware_background}, {learning_goals}
Content to personalize: {content}
Personalize the content based on the user's background.
"""

        # Format the prompt with user background and content
        formatted_prompt = prompt_template.format(
            software_background=user_background.get("software_background", ""),
            hardware_background=user_background.get("hardware_background", ""),
            learning_goals=user_background.get("learning_goal", ""),
            content=content
        )

        # Call AI service to stream personalized content
        async for chunk in self.ai_service.generate_response_stream(formatted_prompt):
            yield chunk