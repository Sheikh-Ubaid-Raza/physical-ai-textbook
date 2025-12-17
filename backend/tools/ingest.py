import os
import glob
from typing import List, Dict, Any
from services.embedding_service import embedding_service
from services.vector_service import vector_service
from config.settings import settings
import logging
import hashlib
from pathlib import Path

logger = logging.getLogger(__name__)

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> List[str]:
    """
    Split text into overlapping chunks
    """
    if len(text) <= chunk_size:
        return [text]

    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size

        # If this isn't the last chunk, try to break at sentence boundary
        if end < len(text):
            # Look for sentence endings near the end
            search_start = end - overlap if start > 0 else end
            sentence_end = -1
            for punct in ['.', '!', '?', '\n']:
                idx = text.rfind(punct, search_start, end)
                if idx > sentence_end:
                    sentence_end = idx

            if sentence_end != -1 and sentence_end > start:
                end = sentence_end + 1

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        # Move start position
        start = end if end > start else start + chunk_size

        # If we're near the end, ensure we don't loop infinitely
        if start >= len(text):
            break

    return chunks

def calculate_checksum(content: str) -> str:
    """
    Calculate SHA256 checksum of content
    """
    return hashlib.sha256(content.encode()).hexdigest()

def extract_title_from_markdown(content: str) -> str:
    """
    Extract title from markdown content (first H1 or filename)
    """
    lines = content.split('\n')
    for line in lines[:10]:  # Look at first 10 lines
        if line.startswith('# '):
            return line[2:].strip()  # Remove '# ' prefix
    return "Untitled Document"

def run_ingestion(force: bool = False) -> Dict[str, Any]:
    """
    Run the ingestion process to vectorize textbook content
    """
    try:
        logger.info(f"Starting ingestion process with force={force}")

        # Get all markdown files from docs directory
        docs_path = os.path.join(os.path.dirname(__file__), "..", "..", "docs")
        if not os.path.exists(docs_path):
            # Try alternative path (in case we're running from project root)
            docs_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "docs")

        if not os.path.exists(docs_path):
            raise FileNotFoundError(f"Docs directory not found at {docs_path}")

        markdown_files = glob.glob(os.path.join(docs_path, "**", "*.md"), recursive=True)
        logger.info(f"Found {len(markdown_files)} markdown files to process")

        processed_files = 0
        processed_chunks = 0

        for file_path in markdown_files:
            logger.info(f"Processing file: {file_path}")

            # Read the file content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Calculate checksum to check if content has changed
            checksum = calculate_checksum(content)

            # Extract title from the content
            title = extract_title_from_markdown(content)

            # Create relative path from docs directory
            relative_path = os.path.relpath(file_path, start=os.path.dirname(docs_path))

            # Split content into chunks
            chunks = chunk_text(content)
            logger.info(f"Split {file_path} into {len(chunks)} chunks")

            # Prepare metadata for each chunk
            metadatas = []
            for i, chunk in enumerate(chunks):
                metadata = {
                    "source_path": relative_path,
                    "title": title,
                    "chunk_index": i,
                    "checksum": checksum,
                    "file_path": file_path
                }
                metadatas.append(metadata)

            # Generate embeddings for all chunks and store in vector database
            texts = [chunk for chunk in chunks]
            try:
                # The vector_service.upsert_vectors method will generate embeddings using embedding_service
                # and store them in Qdrant with proper metadata
                ids = vector_service.upsert_vectors(texts, metadatas)

                processed_chunks += len(chunks)
                logger.info(f"Successfully processed {len(chunks)} chunks from {file_path}")
            except Exception as e:
                logger.error(f"Error processing chunks from {file_path}: {str(e)}")
                continue  # Continue with other files even if one fails

            processed_files += 1

        result = {
            "status": "completed",
            "processedFiles": processed_files,
            "processedChunks": processed_chunks,
            "timestamp": __import__('datetime').datetime.now().isoformat(),
            "collection": settings.qdrant_collection_name
        }

        logger.info(f"Ingestion completed: {result}")
        return result

    except Exception as e:
        logger.error(f"Error during ingestion: {str(e)}")
        raise

if __name__ == "__main__":
    # Allow running the script directly
    import sys
    force_flag = "--force" in sys.argv
    result = run_ingestion(force=force_flag)
    print(result)