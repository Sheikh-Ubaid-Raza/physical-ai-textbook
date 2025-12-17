# Quickstart Guide: RAG Chatbot Integration

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docusaurus project set up
- Qdrant Cloud account
- Neon Serverless Postgres account
- API keys for:
  - GEMINI_API_KEY (for embeddings)
  - OPENROUTER_API_KEY (for chat)

## Setup Instructions

### 1. Clone and Initialize the Project

```bash
git clone <repository-url>
cd physical-ai-textbook
```

### 2. Set up Backend Environment

```bash
# Navigate to backend directory
mkdir backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn qdrant-client sqlalchemy openai google-generativeai python-dotenv
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEON_DATABASE_URL=your_neon_database_url
QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
```

### 4. Initialize the Backend Project Structure

```bash
# Create the backend directory structure
mkdir -p src/{models,services,api/v1,agents,ingestion}
touch src/__init__.py
touch src/models/__init__.py
touch src/services/__init__.py
touch src/api/__init__.py
touch src/agents/__init__.py
touch src/ingestion/__init__.py
```

### 5. Set up Frontend Integration

```bash
# Create the ChatWidget component directory
mkdir -p src/components/ChatWidget
touch src/components/ChatWidget/ChatWidget.tsx
touch src/components/ChatWidget/ChatWidget.css
touch src/components/ChatWidget/types.ts
```

### 6. Run the Ingestion Pipeline

```bash
# First, make sure your backend is set up and API keys are configured
cd backend
python -m src.ingestion.ingest
```

### 7. Start the Backend Server

```bash
cd backend
uvicorn src.main:app --reload --port 8000
```

### 8. Integrate with Docusaurus

The ChatWidget component will be automatically injected into the Docusaurus layout through the theme override at `src/theme/Layout/index.js`.

## Running the Application

### Development Mode

1. Start the backend:
```bash
cd backend
uvicorn src.main:app --reload --port 8000
```

2. Start the Docusaurus frontend:
```bash
cd ..
npm run start
```

### Production Mode

1. Build the backend (if using Docker):
```bash
cd backend
# Build and deploy using your preferred method
```

2. Build the Docusaurus frontend:
```bash
npm run build
```

## API Endpoints

- `POST /api/chat` - Main chat endpoint for user queries
- `POST /api/ingest` - Ingest content into vector database (admin only)

## Configuration Notes

- The chat widget uses `position: fixed` with `z-index: 9999` as required
- Selected text functionality is enabled via `window.getSelection()`
- The system uses Qwen 2.5-7B-Instruct via OpenRouter for responses
- Content embeddings use Google's text-embedding-004 model