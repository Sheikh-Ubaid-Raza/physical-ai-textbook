from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from backend.config.database import Base


class VectorDocument(Base):
    __tablename__ = "vector_documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # Primary key for DB reference
    doc_id = Column(String, nullable=False)  # Qdrant document ID
    source_path = Column(String, nullable=False)  # Path to original .md file
    chunk_index = Column(Integer, nullable=False)  # Position in original document
    content = Column(Text, nullable=False)  # The actual content chunk
    embedding = Column(JSON, nullable=True)  # Store embedding as JSON (will be handled by Qdrant)
    metadata_ = Column("metadata", JSON, default=dict)  # Source document info, headings, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships would be handled by Qdrant for vector operations


class TextbookContent(Base):
    __tablename__ = "textbook_content"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    file_path = Column(String, nullable=False)  # Path in /docs directory
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)  # Full document content
    metadata_ = Column("metadata", JSON, default=dict)  # Author, date, tags, etc.
    checksum = Column(String, nullable=True)  # For change detection
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship with Vector Documents (after chunking)
    # Note: This relationship would be conceptual since vector docs are in Qdrant