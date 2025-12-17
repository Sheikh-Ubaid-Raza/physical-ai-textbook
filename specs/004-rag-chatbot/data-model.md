# Data Model: RAG Chatbot Integration

## Entity: Chat Session
**Description**: Represents a user's ongoing conversation with the AI assistant
- **Fields**:
  - `id`: UUID (Primary Key)
  - `user_id`: Optional UUID (for authenticated users)
  - `created_at`: DateTime
  - `updated_at`: DateTime
  - `messages`: List of Message objects
  - `metadata`: JSON (additional session data)

**Relationships**:
- One-to-Many with Message entities
- Optional Many-to-One with User (for account-based sessions)

## Entity: Message
**Description**: Represents a single message in a conversation
- **Fields**:
  - `id`: UUID (Primary Key)
  - `session_id`: UUID (Foreign Key to Chat Session)
  - `role`: String (either "user" or "assistant")
  - `content`: Text (the actual message content)
  - `timestamp`: DateTime
  - `context_used`: Optional Text (selected text context if applicable)

**Relationships**:
- Many-to-One with Chat Session
- Optional One-to-Many with Context Reference (for selected text)

## Entity: Vector Document
**Description**: Represents a chunk of textbook content converted to vector embeddings
- **Fields**:
  - `id`: UUID (Primary Key for DB reference)
  - `doc_id`: String (Qdrant document ID)
  - `source_path`: String (path to original .md file)
  - `chunk_index`: Integer (position in original document)
  - `content`: Text (the actual content chunk)
  - `embedding`: Array of Floats (768-dimensional vector)
  - `metadata`: JSON (source document info, headings, etc.)

**Relationships**:
- Stored in Qdrant vector database with embedding vectors
- Links back to original source in /docs directory

## Entity: User Query
**Description**: Represents a question or request from the user processed by the RAG system
- **Fields**:
  - `id`: UUID (Primary Key)
  - `session_id`: UUID (Foreign Key to Chat Session)
  - `query_text`: Text (the original user query)
  - `query_embedding`: Array of Floats (768-dimensional vector)
  - `timestamp`: DateTime
  - `selected_text`: Optional Text (highlighted text provided by user)
  - `retrieved_context`: Text (retrieved content from vector DB)
  - `response_text`: Text (AI-generated response)

**Relationships**:
- Many-to-One with Chat Session
- Used as input to RAG service for content retrieval

## Entity: AI Response
**Description**: Represents the generated answer from the Qwen model based on retrieved textbook content
- **Fields**:
  - `id`: UUID (Primary Key)
  - `query_id`: UUID (Foreign Key to User Query)
  - `response_text`: Text (the AI-generated response)
  - `sources_used`: Array of String (references to source documents)
  - `confidence_score`: Float (0.0-1.0 confidence in response quality)
  - `timestamp`: DateTime

**Relationships**:
- One-to-One with User Query
- References Vector Documents used as context

## Entity: Textbook Content
**Description**: Represents the source material from the Physical AI Textbook
- **Fields**:
  - `id`: UUID (Primary Key)
  - `file_path`: String (path in /docs directory)
  - `title`: String (document title)
  - `content`: Text (full document content)
  - `metadata`: JSON (author, date, tags, etc.)
  - `chunks`: Array of Vector Document references
  - `checksum`: String (for change detection)

**Relationships**:
- One-to-Many with Vector Document entities (after chunking)
- Stored as Markdown files in /docs directory