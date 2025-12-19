from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import logging
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from backend.config.settings import settings

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

# Initialize FastAPI app
app = FastAPI(
    title="Physical AI Textbook API",
    description="API for the Physical AI Textbook with Authentication, Personalization, and Translation",
    version="1.0.0"
)

# Add security and performance middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # In production, replace with specific hosts
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add rate limiter to app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.on_event("startup")
async def startup_event():
    logger.info("RAG Chatbot API starting up")

@app.get("/")
async def root():
    return {"message": "RAG Chatbot API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include API routes
from backend.api.v1.chat import router as chat_router
from backend.api.v1.personalize import router as personalize_router
from backend.api.v1.translate import router as translate_router

app.include_router(chat_router, prefix="/api/v1", tags=["chat"])
app.include_router(personalize_router, prefix="/api/v1", tags=["personalize"])
app.include_router(translate_router, prefix="/api/v1", tags=["translate"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)