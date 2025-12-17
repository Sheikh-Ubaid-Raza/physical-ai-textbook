from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class PersonalizedContent(Base):
    __tablename__ = 'personalized_content'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    chapter_id = Column(String, nullable=False)
    original_content = Column(Text, nullable=False)
    personalized_content = Column(Text, nullable=False)
    personalization_level = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    expires_at = Column(DateTime, nullable=True)