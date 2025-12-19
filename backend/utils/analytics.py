import logging
from datetime import datetime
from typing import Dict, Any
import json
import os

# Set up analytics logger
analytics_logger = logging.getLogger("analytics")
analytics_logger.setLevel(logging.INFO)

# Create file handler for analytics
log_dir = "logs"
if not os.path.exists(log_dir):
    os.makedirs(log_dir)

file_handler = logging.FileHandler("logs/analytics.log")
file_handler.setLevel(logging.INFO)

# Create formatter
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)

# Add handler to logger
analytics_logger.addHandler(file_handler)

class AnalyticsTracker:
    """Simple analytics tracker for feature usage and user engagement"""

    @staticmethod
    def track_personalization(user_id: str, content_length: int, user_background: Dict[str, Any] = None):
        """Track personalization feature usage"""
        event_data = {
            "event": "personalization_used",
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "content_length": content_length,
            "user_background": user_background or {}
        }

        analytics_logger.info(json.dumps(event_data))

    @staticmethod
    def track_translation(user_id: str, content_length: int, target_language: str, preserve_terms: bool):
        """Track translation feature usage"""
        event_data = {
            "event": "translation_used",
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "content_length": content_length,
            "target_language": target_language,
            "preserve_technical_terms": preserve_terms
        }

        analytics_logger.info(json.dumps(event_data))

    @staticmethod
    def track_user_login(user_id: str, user_agent: str = None):
        """Track user login"""
        event_data = {
            "event": "user_login",
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "user_agent": user_agent
        }

        analytics_logger.info(json.dumps(event_data))

    @staticmethod
    def track_user_registration(user_id: str, user_background: Dict[str, Any]):
        """Track user registration"""
        event_data = {
            "event": "user_registration",
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "user_background": user_background
        }

        analytics_logger.info(json.dumps(event_data))