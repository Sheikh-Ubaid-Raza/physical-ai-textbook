#!/usr/bin/env python3
"""
Script to initialize the database tables for the RAG Chatbot
"""

from config.database import engine, Base
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """Initialize the database tables"""
    try:
        logger.info("Creating database tables...")

        # Import all models to ensure they're registered with SQLAlchemy
        # This ensures all tables are created
        from models.chat import ChatSession, Message
        from models.document import VectorDocument, TextbookContent

        # Create all tables
        Base.metadata.create_all(bind=engine)

        logger.info("Database tables created successfully!")

    except Exception as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise

if __name__ == "__main__":
    init_db()