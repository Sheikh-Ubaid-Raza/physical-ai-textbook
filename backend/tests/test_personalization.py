import pytest
from fastapi.testclient import TestClient
from main import app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.database import Base
from config.settings import settings

# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_personalization.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_personalize_content():
    """Test the personalization endpoint"""
    # Mock request data
    data = {
        "content": "This is a sample content for personalization testing.",
        "content_type": "text",
        "context": {
            "topic": "AI fundamentals"
        }
    }

    response = client.post("/api/v1/personalize", json=data)

    # Should return 401 if not authenticated, or 200 if mocked properly
    # For testing purposes, we expect it to return the original content if not authenticated
    assert response.status_code in [200, 401]

    if response.status_code == 200:
        result = response.json()
        assert "original_content" in result
        assert "personalized_content" in result
        assert result["original_content"] == data["content"]

def test_personalize_content_stream():
    """Test the personalization streaming endpoint"""
    # Mock request data
    data = {
        "content": "This is a sample content for streaming personalization testing.",
        "content_type": "text",
        "context": {
            "topic": "AI fundamentals"
        }
    }

    response = client.post("/api/v1/personalize/stream", json=data)

    # Should return 401 if not authenticated, or 200 if mocked properly
    assert response.status_code in [200, 401]

def test_personalization_health():
    """Test the personalization health check endpoint"""
    response = client.get("/api/v1/personalize/health")
    assert response.status_code == 200

    result = response.json()
    assert result["status"] == "healthy"
    assert result["service"] == "personalization"