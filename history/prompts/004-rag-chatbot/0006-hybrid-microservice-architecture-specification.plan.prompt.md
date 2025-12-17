---
id: 0006
title: Hybrid Microservice Architecture Specification
stage: plan
date: 2025-01-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: 004-rag-chatbot
branch: 004-rag-chatbot
user: claude
command: /sp.adr Hybrid-Microservice-Architecture
labels: ["architecture", "microservice", "auth", "personalization", "translation", "design"]
links:
  spec: null
  ticket: null
  adr: history/adr/0002-hybrid-microservice-architecture-with-node-js-auth-and-python-ai-services.md
  pr: null
files:
  - history/adr/0002-hybrid-microservice-architecture-with-node-js-auth-and-python-ai-services.md
  - src/components/ChatWidget/ChatWidget.tsx
  - src/components/ChatWidget/ChatWidget.css
  - backend/main.py
  - backend/services/chat_service.py
  - backend/api/v1/chat.py
tests:
  - backend/test_auth_service.py
  - backend/test_personalization_service.py
  - backend/test_translation_service.py
---

## Prompt

Define the architecture for Phase 3: User Authentication, Content Personalization, and Urdu Translation. The architecture should include:
1. A Node.js Auth Service using better-auth with extended user schema for background information
2. Python Personalization and Translation services extending the existing FastAPI backend
3. Shared Neon Postgres database
4. API contracts for all services
5. Frontend integration with Docusaurus

## Response snapshot

Defined comprehensive architecture for Phase 3 including:
1. Shared database schema with extended user fields (software_background, hardware_background, learning_goal)
2. Node.js Auth Service API contracts with registration, login, profile management
3. Python Personalization Service API contract for content personalization
4. Python Urdu Translation Service API contract with streaming support
5. Docusaurus frontend integration with AuthContext, PersonalizationContext, TranslationContext
6. Created ADR-0002 documenting the Hybrid Microservice Architecture decision

The architecture separates concerns between authentication (Node.js) and AI processing (Python), uses shared Neon Postgres database, and defines clear API contracts between services.

## Outcome

- ✅ Impact: Successfully defined hybrid microservice architecture with clear service boundaries
- 🧪 Tests: Tests planned for auth, personalization, and translation services
- 📁 Files: Created ADR and updated service contracts; frontend components ready for implementation
- 🔁 Next prompts: Implementation of auth service, followed by personalization and translation services
- 🧠 Reflection: Hybrid approach balances complexity with maintainability; Node.js for auth, Python for AI services leverages existing expertise

## Evaluation notes (flywheel)

- Failure modes observed: None - architecture properly separates concerns
- Graders run and results (PASS/FAIL): PASS - all architectural requirements met
- Prompt variant (if applicable): Original architecture specification prompt
- Next experiment (smallest change to try): Implement Node.js auth service with better-auth
