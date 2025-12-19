# Physical AI Textbook Backend

This backend service provides authentication, content personalization, and Urdu translation features for the Physical AI Textbook project.

## Features

- **User Authentication**: Complete registration and login system with background information collection
- **Content Personalization**: AI-driven adaptation of content based on user's skill level
- **Urdu Translation**: Translation of content to Urdu while preserving technical terms
- **Caching**: Intelligent caching to reduce API calls and improve performance
- **Rate Limiting**: Protection against abuse with configurable limits
- **Security**: Multiple security layers including CORS, trusted hosts, and input validation

## Architecture

The backend follows a hybrid microservice architecture:

- **Node.js Auth Service**: Handles user authentication and profile management
- **Python AI Service**: Processes personalization and translation requests using OpenRouter API

## API Endpoints

### Personalization
- `POST /api/v1/personalize` - Personalize content based on user profile
- `POST /api/v1/personalize/stream` - Stream personalized content (SSE)
- `GET /api/v1/personalize/health` - Health check
- `DELETE /api/v1/personalize/cache/{user_id}` - Clear user cache

### Translation
- `POST /api/v1/translate` - Translate content to Urdu
- `POST /api/v1/translate/stream` - Stream translated content (SSE)
- `GET /api/v1/translate/health` - Health check
- `DELETE /api/v1/translate/cache/{user_id}` - Clear user cache

### General
- `GET /health` - Overall service health
- `GET /` - Root endpoint

## Environment Variables

Create a `.env` file with the following variables:

```bash
# Database
DATABASE_URL="your_neon_postgres_connection_string"

# OpenRouter API
OPENROUTER_API_KEY="your_openrouter_api_key"

# Node.js Auth Service
AUTH_SECRET="your_auth_secret_key"
NODE_AUTH_PORT=3001

# Python Backend
PYTHON_BACKEND_PORT=8000
LOG_LEVEL=INFO
```

## Running the Service

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables (see above)

3. Run the service:
```bash
uvicorn main:app --reload --port 8000
```

## Testing

Run the tests:
```bash
pytest
```

## Models

- `User`: User account with background information
- `UserSession`: Session management
- `PersonalizedContent`: Cached personalized content
- `TranslatedContent`: Cached translated content

## Services

- `AIService`: Interface with OpenRouter API
- `PersonalizationService`: Content personalization logic
- `TranslationService`: Content translation logic
- `AuthService`: Authentication logic

## Security

- Rate limiting with slowapi
- CORS middleware
- Trusted host middleware
- Input validation with Pydantic
- Secure password hashing
- JWT-based authentication
- SQL injection protection through ORM

## Performance

- Content caching to reduce AI API calls
- Streaming responses for large content
- Asynchronous processing
- GZip compression
- Optimized database queries with SQLAlchemy

## Frontend Integration

The backend works with the frontend to provide:
- Smart Toolbar with personalization and translation buttons
- Auth Modal for registration/login
- Real-time content updates
- User profile management