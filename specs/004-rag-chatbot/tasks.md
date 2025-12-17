# Implementation Tasks: RAG Chatbot Integration

**Feature**: RAG Chatbot Integration (Hybrid Edition)
**Branch**: `004-rag-chatbot`
**Spec**: `/specs/004-rag-chatbot/spec.md`
**Plan**: `/specs/004-rag-chatbot/plan.md`

## Phase 1: Setup

### Project Initialization
- [X] T001 Initialize backend directory structure per plan
- [X] T002 Create requirements.txt with FastAPI, uvicorn, qdrant-client, sqlalchemy, openai, google-generativeai
- [X] T003 Create .env.example file with GEMINI_API_KEY and OPENROUTER_API_KEY placeholders
- [X] T004 Set up basic FastAPI application structure in backend/main.py

## Phase 2: Foundational

### Backend Infrastructure
- [X] T005 [P] Set up database configuration in backend/config/database.py
- [X] T006 [P] Create settings configuration in backend/config/settings.py
- [X] T007 Create Chat model in backend/models/chat.py based on data-model.md
- [X] T008 Create Document model in backend/models/document.py based on data-model.md
- [X] T009 Create embedding service in backend/services/embedding_service.py
- [X] T010 Create vector service in backend/services/vector_service.py
- [X] T011 Create chat service in backend/services/chat_service.py
- [X] T012 Create API endpoint for chat in backend/api/v1/chat.py
- [X] T013 Create ingestion script in backend/tools/ingest.py

### Frontend Infrastructure
- [X] T014 Create ChatWidget directory structure in src/components/ChatWidget/
- [X] T015 Create TypeScript types for ChatWidget in src/components/ChatWidget/types.ts
- [X] T016 Create ChatWidget CSS with fixed positioning in src/components/ChatWidget/ChatWidget.css
- [X] T017 Create basic ChatWidget React component in src/components/ChatWidget/ChatWidget.tsx

## Phase 3: User Story 1 - Access AI-Powered Documentation Assistance [P1]

### Backend Implementation
- [X] T018 [P] [US1] Implement POST /api/chat endpoint in backend/api/v1/chat.py
- [X] T019 [P] [US1] Implement chat session management in backend/services/chat_service.py
- [X] T020 [US1] Implement RAG logic to retrieve textbook content from Qdrant
- [X] T021 [US1] Integrate OpenRouter with Qwen 2.5-7B-Instruct model
- [X] T022 [US1] Implement proper OpenRouter base_url configuration for API routing
- [X] T023 [US1] Add Google GenAI embedding generation using text-embedding-004
- [X] T024 [US1] Implement proper error handling for API calls

### Frontend Implementation
- [X] T025 [P] [US1] Implement basic chat UI in src/components/ChatWidget/ChatWidget.tsx
- [X] T026 [US1] Add API call functionality to connect to backend /api/chat
- [X] T027 [US1] Implement message history display in the chat widget
- [X] T028 [US1] Add loading states and error handling to the chat interface

### Integration and Testing
- [X] T029 [US1] Test basic chat functionality with textbook content
- [X] T030 [US1] Verify responses are based on textbook content per acceptance scenario 1

## Phase 4: User Story 2 - Interactive Chat Interface [P2]

### Frontend Implementation
- [X] T031 [P] [US2] Implement fixed positioning CSS with z-index: 9999 in ChatWidget.css
- [X] T032 [US2] Ensure chat widget remains visible during page navigation
- [X] T033 [US2] Implement session persistence across page navigation
- [X] T034 [US2] Add open/close toggle functionality to the chat widget
- [X] T035 [US2] Integrate chat widget into Docusaurus layout using swizzling

### Integration and Testing
- [X] T036 [US2] Test chat widget visibility on different textbook pages
- [X] T037 [US2] Verify chat session persists when navigating between pages

## Phase 5: User Story 3 - Context-Aware Question Answering [P3]

### Backend Implementation
- [X] T038 [P] [US3] Modify POST /api/chat to accept selectedText parameter
- [X] T039 [US3] Implement logic to prioritize responses based on selected text
- [X] T040 [US3] Add context injection to instruct model to answer based on selected text
- [X] T041 [US3] Update chat service to handle selected text context

### Frontend Implementation
- [X] T042 [P] [US3] Implement window.getSelection() listener in ChatWidget.tsx
- [X] T043 [US3] Add functionality to capture user's selected text
- [X] T044 [US3] Pass selected text context to the backend API call
- [X] T045 [US3] Update UI to indicate when selected text context is being used

### Integration and Testing
- [X] T046 [US3] Test context-aware responses when text is selected
- [X] T047 [US3] Verify responses prioritize selected text per acceptance scenario 1
- [X] T048 [US3] Test general responses when no text is selected per acceptance scenario 2

## Phase 6: Polish & Cross-Cutting Concerns

### Ingestion Pipeline
- [X] T049 Implement content ingestion pipeline in backend/tools/ingest.py
- [X] T050 Add .md file scraping from /docs directory to ingestion script
- [X] T051 Implement vectorization using Google's text-embedding-004 model
- [X] T052 Add indexing to Qdrant with proper metadata storage
- [X] T053 Create POST /api/ingest endpoint for content processing
- [X] T054 Test complete ingestion of textbook content

### Error Handling & Edge Cases
- [X] T055 Implement graceful handling for AI service unavailability
- [X] T056 Add proper handling for long queries that exceed API limits
- [X] T057 Handle cases where vector database has no relevant content
- [X] T058 Add logging and metrics per functional requirement FR-011

### Security & Deployment
- [X] T059 Ensure proper API authentication using GEMINI_API_KEY and OPENROUTER_API_KEY
- [X] T060 Prepare for Railway deployment with proper configuration
- [X] T061 Add rate limiting to prevent API abuse
- [X] T062 Perform final integration testing

## Dependencies

- User Story 1 (P1) must be completed before User Story 2 (P2) and User Story 3 (P3)
- User Story 2 (P2) and User Story 3 (P3) can be developed in parallel after User Story 1 (P1)
- Foundational tasks must be completed before any user story tasks

## Parallel Execution Examples

- T005-T012: Backend foundational tasks can be developed in parallel
- T014-T017: Frontend foundational tasks can be developed in parallel
- T025-T028: Frontend components for US1 can be developed in parallel with T018-T024 backend components
- T031-T035: Frontend components for US2 can be developed in parallel with T038-T041 backend components for US3

## Implementation Strategy

1. **MVP Scope**: Complete Phase 1, Phase 2, and Phase 3 (User Story 1) for basic functionality
2. **Incremental Delivery**: Add User Story 2 (interactive interface) and User Story 3 (context-aware responses) in subsequent iterations
3. **Final Polish**: Complete ingestion pipeline and cross-cutting concerns in final phase