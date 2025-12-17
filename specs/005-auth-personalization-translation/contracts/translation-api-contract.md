# Translation Service API Contract

## Base URL
`http://localhost:8000/api/v1` (Python AI Service)

## Urdu Translation
**Endpoint**: `POST /translate`
**Description**: Translate chapter content to Urdu with technical terms preserved in English
**Headers Required**: `Authorization: Bearer {token}` (for user authentication)

### Request
```json
{
  "chapter_content": "Original English chapter content here...",
  "chapter_id": "chapter-identifier",
  "translation_mode": "script",
  "preserve_technical_terms": true
}
```

### Response (Success)
```json
{
  "translated_content": "میں اس باب کا عنوان ہے۔ ہم ROS 2 کے بارے میں جاننے کے لیے ROS (Robot Operating System) ایک میٹا-آپریٹنگ سسٹم ہے جو روبوٹکس ایپلی کیشنز کی ترقی کے لیے استعمال ہوتا ہے۔",
  "translation_stats": {
    "original_word_count": 1500,
    "translated_word_count": 1200,
    "technical_terms_preserved": ["ROS 2", "Node", "Publisher", "Subscriber"]
  },
  "processing_time": 3.2,
  "timestamp": "2025-01-15T13:45:00Z"
}
```

### Streaming Response (SSE)
For long chapters, the endpoint supports Server-Sent Events:

```
event: translation_chunk
data: {"chunk": "میں اس باب کا عنوان ہے۔", "progress": 5.2, "chunk_id": 1}

event: translation_chunk
data: {"chunk": "ہم ROS 2 کے بارے میں جاننے کے لیے...", "progress": 10.4, "chunk_id": 2}

event: complete
data: {"final_content": "full translated content", "processing_time": 3.2}
```

### Response (Error)
```json
{
  "error": "Error message",
  "details": "Specific error details"
}
```

## Health Check
**Endpoint**: `GET /translate/health`
**Description**: Check health status of translation service

### Response (Success)
```json
{
  "status": "healthy",
  "service": "translation"
}
```