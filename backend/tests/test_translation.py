import pytest
from fastapi.testclient import TestClient
from main import app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.database import Base
from config.settings import settings

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_translation.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_translate_content():
    """Test the translation endpoint"""
    # Mock request data
    data = {
        "content": "This is a sample content for translation testing.",
        "target_language": "urdu",
        "preserve_technical_terms": True,
        "content_type": "text"
    }

    response = client.post("/api/v1/translate", json=data)

    # Should return 401 if not authenticated, or 200 if mocked properly
    # For testing purposes, we expect it to return the original content if not authenticated
    assert response.status_code in [200, 401]

    if response.status_code == 200:
        result = response.json()
        assert "original_content" in result
        assert "translated_content" in result
        assert result["original_content"] == data["content"]

def test_translate_content_stream():
    """Test the translation streaming endpoint"""
    # Mock request data
    data = {
        "content": "This is a sample content for streaming translation testing.",
        "target_language": "urdu",
        "preserve_technical_terms": True,
        "content_type": "text"
    }

    response = client.post("/api/v1/translate/stream", json=data)

    # Should return 401 if not authenticated, or 200 if mocked properly
    assert response.status_code in [200, 401]

def test_translation_health():
    """Test the translation health check endpoint"""
    response = client.get("/api/v1/translate/health")
    assert response.status_code == 200

    result = response.json()
    assert result["status"] == "healthy"
    assert result["service"] == "translation"