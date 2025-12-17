from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid
import json

Base = declarative_base()

class TranslatedContent(Base):
    __tablename__ = 'translated_content'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    chapter_id = Column(String, nullable=False)
    original_content = Column(Text, nullable=False)
    translated_content = Column(Text, nullable=False)
    translation_mode = Column(String, default='script')
    technical_terms_preserved = Column(String, nullable=True)  # JSON string
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    expires_at = Column(DateTime, nullable=True)