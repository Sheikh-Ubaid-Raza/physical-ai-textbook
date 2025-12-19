# API Endpoints Documentation

## Physical AI Textbook API

This document describes the API endpoints for the Physical AI Textbook project, including authentication, content personalization, and Urdu translation features.

## Authentication Service (Node.js)

The authentication service is hosted separately at `/api/auth` and provides the following endpoints:

### POST `/api/auth/register`
Register a new user with background information.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securePassword123",
  "software_background": "Beginner",
  "hardware_background": "None",
  "learning_goal": "Learning robotics fundamentals"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "software_background": "Beginner",
    "hardware_background": "None",
    "learning_goal": "Learning robotics fundamentals"
  },
  "session": {
    "token": "jwt-token-string",
    "expires_at": "2023-12-31T23:59:59Z"
  }
}
```

### POST `/api/auth/login`
Login an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": { ... },
  "session": { ... }
}
```

## Python Backend API (FastAPI)

The Python backend is hosted at `http://localhost:8000` and provides the following endpoints:

### Personalization Endpoints

#### POST `/api/v1/personalize`
Personalize content based on user's background information.

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "content": "Original content to personalize",
  "content_type": "text",
  "context": {
    "topic": "AI fundamentals"
  }
}
```

**Response:**
```json
{
  "original_content": "Original content to personalize",
  "personalized_content": "Personalized version of the content",
  "user_background": {
    "software_background": "Beginner",
    "hardware_background": "None",
    "learning_goal": "Learning robotics fundamentals"
  },
  "cache_hit": false
}
```

#### POST `/api/v1/personalize/stream`
Stream personalized content with Server-Sent Events (SSE).

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request Body:**
Same as the regular personalization endpoint.

**Response:**
SSE stream with events of type `chunk`, `complete`, or `error`.

#### DELETE `/api/v1/personalize/cache/{user_id}`
Clear cached personalized content for a specific user.

### Translation Endpoints

#### POST `/api/v1/translate`
Translate content to Urdu while preserving technical terms.

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "content": "Content to translate",
  "target_language": "urdu",
  "preserve_technical_terms": true,
  "content_type": "text"
}
```

**Response:**
```json
{
  "original_content": "Content to translate",
  "translated_content": "مترجمہ مواد یہاں ہوگا",
  "user_background": { ... },
  "cache_hit": false
}
```

#### POST `/api/v1/translate/stream`
Stream translated content with Server-Sent Events (SSE).

**Headers:**
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request Body:**
Same as the regular translation endpoint.

**Response:**
SSE stream with events of type `chunk`, `complete`, or `error`.

#### DELETE `/api/v1/translate/cache/{user_id}`
Clear cached translated content for a specific user.

### Health Check Endpoints

#### GET `/api/v1/personalize/health`
Check the health of the personalization service.

#### GET `/api/v1/translate/health`
Check the health of the translation service.

#### GET `/health`
Check the overall health of the backend service.

## Frontend Services

The frontend provides TypeScript services for interacting with these APIs:

- `AuthService`: For authentication operations
- `PersonalizationService`: For content personalization
- `TranslationService`: For Urdu translation
- `AuthContext`: For managing authentication state
- `PersonalizationContext`: For managing personalization and translation state

## Rate Limiting

All API endpoints are protected by rate limiting. The default rate limits are:
- 100 requests per minute per IP address for general endpoints
- 50 requests per minute per IP address for AI-intensive endpoints

## Security Headers

The API includes security headers such as:
- Trusted Host middleware
- CORS headers
- GZip compression