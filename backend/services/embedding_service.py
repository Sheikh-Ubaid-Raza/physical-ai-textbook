import google.generativeai as genai
from backend.config.settings import settings
from typing import List
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        # Initialize Google Generative AI with API key
        genai.configure(api_key=settings.gemini_api_key)
        # Use the text-embedding-004 model
        self.model_name = "models/text-embedding-004"

    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a single text using Google's text-embedding-004 model
        """
        try:
            # Generate embedding using the specified model
            result = genai.embed_content(
                model=self.model_name,
                content=text,
                task_type="retrieval_document",  # Appropriate task type for document content
            )

            # Extract embedding from the response
            embedding = result['embedding']
            logger.info(f"Generated embedding of size {len(embedding)} for text of length {len(text)}")
            return embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            raise

    def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a batch of texts
        """
        embeddings = []
        for text in texts:
            embedding = self.generate_embedding(text)
            embeddings.append(embedding)
        return embeddings

# Create a global instance of the embedding service
embedding_service = EmbeddingService()