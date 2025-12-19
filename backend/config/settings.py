from pydantic_settings import BaseSettings
from typing import Optional
from pydantic import Field
import os


class Settings(BaseSettings):
    # API Keys
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    openrouter_api_key: str = os.getenv("OPENROUTER_API_KEY", "")

    # Additional API Keys
    github_token: Optional[str] = os.getenv("GITHUB_TOKEN")
    context7_api_key: Optional[str] = os.getenv("CONTEXT7_API_KEY")

    # Database URLs
    neon_database_url: str = os.getenv("DATABASE_URL", "postgresql://localhost/defaultdb")
    database_url: str = os.getenv("DATABASE_URL", "postgresql://localhost/defaultdb")  # From .env file
    qdrant_url: Optional[str] = os.getenv("QDRANT_URL")
    qdrant_api_key: Optional[str] = os.getenv("QDRANT_API_KEY")

    # Application Settings
    app_env: str = os.getenv("APP_ENV", "development")
    log_level: str = os.getenv("LOG_LEVEL", "info")

    # Model Settings
    model_name: Optional[str] = os.getenv("MODEL_NAME")
    embedding_model: Optional[str] = os.getenv("EMBEDDING_MODEL")

    # Security
    jwt_secret_key: Optional[str] = os.getenv("JWT_SECRET_KEY")
    auth_secret: str = os.getenv("AUTH_SECRET", "your_auth_secret_key")  # From .env file

    # Port Settings
    node_auth_port: int = int(os.getenv("NODE_AUTH_PORT", "3001"))  # From .env file
    python_backend_port: int = int(os.getenv("PYTHON_BACKEND_PORT", "8000"))  # From .env file

    # Qdrant Configuration
    qdrant_collection_name: str = "textbook_chunks"
    embedding_size: int = 768  # For Google's text-embedding-004 model

    # OpenRouter Configuration
    openrouter_model: str = "qwen/qwen-2.5-7b-instruct"

    model_config = {"env_file": ".env", "protected_namespaces": ("settings_",)}


# Create settings instance
settings = Settings()