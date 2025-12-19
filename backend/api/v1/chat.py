from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from backend.config.database import get_db
from backend.services.chat_service import chat_service
from typing import Optional
import logging
from slowapi import Limiter
from slowapi.util import get_remote_address

logger = logging.getLogger(__name__)

# Initialize limiter for this router
limiter = Limiter(key_func=get_remote_address)

router = APIRouter()

# Define request and response models
from pydantic import BaseModel
from typing import List, Dict, Any

class ChatRequest(BaseModel):
    message: str
    sessionId: Optional[str] = None
    selectedText: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class Source(BaseModel):
    title: str
    path: str
    relevance: float

class ChatResponse(BaseModel):
    response: str
    sessionId: str
    sources: List[Source]
    timestamp: str

class ErrorResponse(BaseModel):
    error: str

@router.post("/chat",
             response_model=ChatResponse,
             responses={
                 200: {"description": "Successful response"},
                 400: {"model": ErrorResponse, "description": "Bad request"},
                 500: {"model": ErrorResponse, "description": "Internal server error"}
             })
@limiter.limit("10/minute")  # Limit to 10 requests per minute per IP
async def chat_endpoint(
    request: Request,
    chat_request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    Process user query and return AI response based on textbook content
    """
    try:
        logger.info(f"Received chat request for session: {chat_request.sessionId}")

        # Process the user query using the chat service
        result = await chat_service.process_user_query(
            db=db,
            message=chat_request.message,
            session_id=chat_request.sessionId,
            selected_text=chat_request.selectedText
        )

        logger.info(f"Successfully processed chat request for session: {result['sessionId']}")

        # Format the response according to the API specification
        formatted_response = ChatResponse(
            response=result["response"],
            sessionId=result["sessionId"],
            sources=[
                Source(
                    title=source["title"],
                    path=source["path"],
                    relevance=source["relevance"]
                )
                for source in result["sources"]
            ],
            timestamp=result["timestamp"]
        )

        return formatted_response

    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing chat request: {str(e)}")


@router.post("/ingest",
             responses={
                 200: {"description": "Ingestion completed successfully"},
                 500: {"model": ErrorResponse, "description": "Internal server error"}
             })
@limiter.limit("5/hour")  # Limit to 5 ingestion requests per hour per IP
async def ingest_endpoint(
    request: Request,
    force: bool = False
):
    """
    Ingest textbook content into the vector database
    """
    try:
        logger.info(f"Received ingest request with force={force}")

        # Import the ingestion script here to avoid circular dependencies
        from tools.ingest import run_ingestion

        # Run the ingestion process
        result = run_ingestion(force=force)

        logger.info(f"Ingestion completed: {result}")

        return result

    except Exception as e:
        logger.error(f"Error during ingestion: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during ingestion: {str(e)}")


@router.get("/health")
async def health_check():
    """
    Health check endpoint for the chat API
    """
    return {"status": "chat API is healthy"}