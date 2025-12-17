# Personalization Service API Contract

## Base URL
`http://localhost:8000/api/v1` (Python AI Service)

## Content Personalization
**Endpoint**: `POST /personalize`
**Description**: Personalize chapter content based on user's background information

### Request
```json
{
  "chapter_content": "Original chapter content here...",
  "user_id": "uuid-string",
  "chapter_id": "chapter-identifier",
  "personalization_level": "detailed"
}
```

### Response (Success)
```json
{
  "personalized_content": "Personalized chapter content based on user's background...",
  "user_profile_used": {
    "software_background": "Intermediate",
    "hardware_background": "Arduino"
  },
  "processing_time": 2.5,
  "timestamp": "2025-01-15T12:30:00Z"
}
```

### Response (Error)
```json
{
  "error": "Error message",
  "details": "Specific error details"
}
```

## Health Check
**Endpoint**: `GET /personalize/health`
**Description**: Check health status of personalization service

### Response (Success)
```json
{
  "status": "healthy",
  "service": "personalization"
}
```