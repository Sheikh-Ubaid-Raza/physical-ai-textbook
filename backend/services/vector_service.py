from qdrant_client import QdrantClient
from qdrant_client.http import models
from typing import List, Dict, Any, Optional
from config.settings import settings
import logging
import uuid

logger = logging.getLogger(__name__)

class VectorService:
    def __init__(self):
        # Initialize Qdrant client
        if settings.qdrant_url:
            # Use remote Qdrant instance with API key
            # Disable gRPC to avoid connection issues
            self.client = QdrantClient(
                url=settings.qdrant_url,
                api_key=settings.qdrant_api_key,
                prefer_grpc=False
            )
        else:
            # Use local Qdrant instance for development
            self.client = QdrantClient(":memory:")  # In-memory for testing

        self.collection_name = settings.qdrant_collection_name
        self.embedding_size = settings.embedding_size
        self._ensure_collection_exists()

    def _ensure_collection_exists(self):
        """
        Ensure the collection exists with the correct configuration
        """
        try:
            # Check if collection exists
            collections = self.client.get_collections()
            collection_exists = any(col.name == self.collection_name for col in collections.collections)

            if not collection_exists:
                # Create collection with 768-dimensional vectors for Google's text-embedding-004
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=self.embedding_size,
                        distance=models.Distance.COSINE
                    )
                )
                logger.info(f"Created Qdrant collection: {self.collection_name}")
            else:
                logger.info(f"Qdrant collection {self.collection_name} already exists")
        except Exception as e:
            logger.error(f"Error ensuring collection exists: {str(e)}")
            raise

    def upsert_vectors(self, texts: List[str], metadatas: List[Dict[str, Any]], ids: Optional[List[str]] = None) -> List[str]:
        """
        Upsert vectors to Qdrant collection
        """
        try:
            if ids is None:
                ids = [str(uuid.uuid4()) for _ in texts]

            # Import the embedding service to generate actual embeddings
            from services.embedding_service import embedding_service

            # Generate embeddings for the texts using the embedding service
            points = []
            for i, (text, metadata) in enumerate(zip(texts, metadatas)):
                # Generate embedding using the embedding service
                embedding = embedding_service.generate_embedding(text)
                points.append(
                    models.PointStruct(
                        id=ids[i],
                        vector=embedding,  # Use the actual embedding
                        payload={
                            "text": text,
                            "metadata": metadata
                        }
                    )
                )

            # Actually upsert the vectors
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )

            logger.info(f"Upserted {len(points)} vectors to collection {self.collection_name}")
            return ids
        except Exception as e:
            logger.error(f"Error upserting vectors: {str(e)}")
            raise

    def search_vectors(self, query_embedding: List[float], top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search for similar vectors in the collection
        """
        try:
            # Perform similarity search
            search_results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=top_k,
                with_payload=True
            )

            results = []
            for result in search_results:
                results.append({
                    "id": result.id,
                    "score": result.score,
                    "text": result.payload.get("text", ""),
                    "metadata": result.payload.get("metadata", {})
                })

            logger.info(f"Found {len(results)} similar vectors for query")
            return results
        except Exception as e:
            logger.error(f"Error searching vectors: {str(e)}")
            raise

    def delete_vectors(self, ids: List[str]):
        """
        Delete vectors by IDs
        """
        try:
            self.client.delete(
                collection_name=self.collection_name,
                points_selector=models.PointIdsList(
                    points=ids
                )
            )
            logger.info(f"Deleted {len(ids)} vectors from collection {self.collection_name}")
        except Exception as e:
            logger.error(f"Error deleting vectors: {str(e)}")
            raise

# Create a global instance of the vector service
vector_service = VectorService()