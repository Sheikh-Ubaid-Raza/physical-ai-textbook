# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The RAG Chatbot Integration (Hybrid Edition) feature implements an AI-powered assistance system for the Physical AI Textbook. The solution combines Google's text-embedding-004 model for content vectorization with Qwen 2.5-7B-Instruct (via OpenRouter) for question answering, integrated into a Docusaurus-based documentation site through a fixed-position React chat widget.

The implementation follows a four-phase approach:
1. Scaffolding backend infrastructure with FastAPI, Neon Postgres, and Qdrant Cloud
2. Building an ingestion pipeline to vectorize textbook content
3. Orchestrating AI logic with RAG capabilities and context-aware responses
4. Injecting a frontend UI component with fixed positioning for seamless user interaction

Key technical decisions include using FastAPI for the backend service, Qdrant with 768-dimensional embeddings for vector storage, and React component injection into the Docusaurus layout for the frontend integration.

## Technical Context

**Language/Version**: Python 3.11, TypeScript 5.0+, Node.js 18+
**Primary Dependencies**: FastAPI, uvicorn, qdrant-client, sqlalchemy, openai, google-generativeai, React 18, Docusaurus v3
**Storage**: Neon Serverless Postgres (Relational), Qdrant Cloud (Vector)
**Testing**: pytest for backend, Jest/React Testing Library for frontend
**Target Platform**: Linux server (backend), Web browser (frontend)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Real-time responses to user queries with <5s latency for 95th percentile
**Constraints**: API rate limits, vector database query performance, secure handling of API keys
**Scale/Scope**: Support multiple concurrent users, handle entire textbook content for RAG

### Research Requirements from Original Spec

The following items require research to ensure proper implementation:

1. **Google GenAI API**: Need to research latest Google GenAI Python docs to ensure API compatibility for `text-embedding-004` (as specified in original request: "Context Constraint: Fetch latest Google GenAI python docs before coding this step to ensure API compatibility")

2. **OpenRouter Configuration**: Need to verify OpenRouter `base_url` configuration for routing OpenAI SDK to OpenRouter with `qwen/Qwen2.5-7B-Instruct` (as specified in original request: "Context Constraint: Verify OpenRouter base_url configuration first")

3. **Qdrant Collection Setup**: Need to research proper provisioning of Qdrant collection named `textbook_chunks` with size 768

4. **Docusaurus Swizzling**: Need to research how to properly swizzle Docusaurus `<Layout>` to mount the chat widget component

5. **Window Selection API**: Need to research implementation details for `window.getSelection()` to capture user intent

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### AI-Native Workflow
- ✅ Spec-Kit Plus specifications: Already created spec.md, now creating plan.md
- ✅ Formal specification before implementation: Following the required workflow

### Educational Clarity
- ✅ Pedagogical code structure: Implementation will prioritize educational value
- ✅ Content accessibility: Chatbot will enhance learning experience for textbook

### Modularity
- ✅ Layer separation: Clear separation between Content Layer (Docusaurus), Intelligence Layer (RAG/Agents)
- ✅ Well-defined interfaces: API endpoints will have clear contracts
- ✅ Minimized cross-layer dependencies: Following architectural patterns

### Type Safety
- ✅ TypeScript for frontend: Using TypeScript 5.0+ as specified
- ✅ Type hints for Python backend: Using Python 3.11 with proper type hints
- ✅ No `any` types: Will maintain strict typing standards

### Secrets Management
- ✅ No hardcoded API keys: Will use .env files exclusively for GEMINI_API_KEY and OPENROUTER_API_KEY
- ✅ No secrets in repository: Following security best practices

### Component Reuse
- ✅ Reusable UI components: ChatWidget will be a reusable React component
- ✅ Common functionality abstraction: Will create reusable hooks and components

### Technology Standards
- ✅ Frontend: Docusaurus v3 (React/TypeScript) as specified
- ✅ Backend: Python (FastAPI) integrated with AI services
- ✅ Databases: Neon Serverless Postgres and Qdrant Cloud as specified

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# Web application (frontend + backend)
backend/
├── main.py              # FastAPI application entry point
├── requirements.txt     # Python dependencies
├── config/
│   ├── database.py      # Database connection setup
│   └── settings.py      # Configuration settings
├── models/
│   ├── chat.py          # Chat session models
│   └── document.py      # Document/vector models
├── services/
│   ├── chat_service.py  # Chat logic and RAG implementation
│   ├── embedding_service.py # Google GenAI embedding service
│   └── vector_service.py # Qdrant vector database operations
├── api/
│   └── v1/
│       └── chat.py      # Chat API endpoints
├── tools/
│   └── ingest.py        # Content ingestion pipeline
└── tests/
    ├── unit/
    └── integration/

frontend/ (integrated with existing Docusaurus structure)
├── src/
│   └── components/
│       └── ChatWidget/   # React chat widget component
│           ├── ChatWidget.tsx
│           ├── ChatWidget.css
│           └── types.ts
└── docusaurus.config.js # Updated to include chat widget

# Environment and secrets
.env.example             # Example environment variables
```

**Structure Decision**: Selected the web application structure to separate the backend AI services from the frontend Docusaurus documentation site. The backend uses FastAPI with proper separation of concerns (models, services, API), while the frontend integrates a React chat widget component into the existing Docusaurus structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
