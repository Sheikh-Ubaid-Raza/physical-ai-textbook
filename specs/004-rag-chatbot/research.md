# Research Summary: RAG Chatbot Integration

## Decision: Backend Technology Stack
**Rationale**: FastAPI is chosen as the backend framework due to its excellent support for async operations, automatic API documentation, and strong integration with the Python data science ecosystem. It's ideal for AI/ML applications and API services.

**Alternatives considered**:
- Flask (simpler but less feature-rich)
- Django (too heavy for this use case)
- Node.js/Express (would create technology fragmentation)

## Decision: Vector Database Configuration
**Rationale**: Qdrant is configured with embedding size of 768 to match Google's text-embedding-004 model output. This ensures compatibility with the specified AI stack.

**Alternatives considered**:
- Pinecone (managed but more expensive)
- Weaviate (alternative vector DB)
- FAISS (Facebook's library, but requires more infrastructure management)

## Decision: Frontend Integration Approach
**Rationale**: Using React component injection into Docusaurus layout with position:fixed styling as specified. This provides the best user experience while maintaining compatibility with the existing documentation site.

**Alternatives considered**:
- Static footer component (rejected due to requirement for fixed positioning)
- Separate chat application (would break seamless integration)

## Decision: AI Model Integration
**Rationale**: Using OpenRouter to access Qwen 2.5-7B-Instruct model with custom base_url configuration. This provides access to the specified model while maintaining flexibility.

**Alternatives considered**:
- Direct OpenAI API (doesn't support Qwen model)
- Anthropic API (doesn't support Qwen model)
- Hugging Face Inference API (possible but OpenRouter is more established for this use case)

## Decision: Content Processing Pipeline
**Rationale**: Using Google's text-embedding-004 model for vectorization as specified in requirements. Processing all .md files from /docs directory to ensure complete textbook content is indexed.

**Alternatives considered**:
- Other embedding models (OpenAI, Cohere - but Gemini is specified)
- Processing different file types (keeping .md only as per requirement)