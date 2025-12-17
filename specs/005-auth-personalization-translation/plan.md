# Implementation Plan: User Authentication, Content Personalization, and Urdu Translation

**Branch**: `005-auth-personalization-translation` | **Date**: 2025-01-15 | **Spec**: [link](spec.md)
**Input**: Feature specification from `/specs/005-auth-personalization-translation/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a hybrid microservice architecture for user authentication, content personalization, and Urdu translation. The solution includes a Node.js Auth Service using better-auth for user management with extended background fields (software/hardware level, learning goals), and extends the existing Python FastAPI backend with AI-powered personalization and translation endpoints using OpenRouter API integration. The frontend Docusaurus integration includes a modal-based authentication system and smart toolbar with personalization/translation features.

## Technical Context

**Language/Version**: Node.js 18+, Python 3.11, TypeScript 5.0+, React 18
**Primary Dependencies**: better-auth, hono, FastAPI, OpenAI Agents SDK, OpenRouter API, pg, @better-auth/react
**Storage**: Neon Serverless Postgres (Relational), Qdrant Cloud (Vector)
**Testing**: pytest (Python), Jest/Vitest (Node/React), cypress (E2E)
**Target Platform**: Linux server (Node/Python), Web browser (React/Docusaurus)
**Project Type**: Web (frontend + backend + auth service)
**Performance Goals**: <10 seconds for personalization up to 2000 words, <15 seconds for Urdu translation up to 2000 words
**Constraints**: <200ms p95 for auth operations, secure handling of API keys, maintain technical terms in English during Urdu translation
**Scale/Scope**: Support 10k registered users, handle concurrent AI processing requests, maintain 99% uptime for auth services

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### AI-Native Workflow Compliance
✅ SPECIFICATION: Feature specification created before implementation (specs/005-auth-personalization-translation/spec.md)
✅ ARCHITECTURE: Hybrid microservice architecture clearly defined with interfaces between services

### Educational Clarity Compliance
✅ CODE STRUCTURE: Clear separation between auth, personalization, and translation components
✅ DOCUMENTATION: Comprehensive API contracts and data models planned

### Modularity Compliance
✅ LAYER SEPARATION: Clear separation between Content Layer (Docusaurus), Intelligence Layer (RAG/Agents), and Auth Layer
✅ INTERFACES: Well-defined API contracts between services
✅ DEPENDENCIES: Minimized cross-layer dependencies with clear documentation

### Type Safety Compliance
✅ TYPING: TypeScript for frontend/auth service, Python type hints for backend
✅ VALIDATION: API request/response validation planned

### Secrets Management Compliance
✅ ENVIRONMENT: API keys will be stored in .env files, not hardcoded
✅ SECURITY: Secure handling of authentication tokens

### Component Reuse Compliance
✅ REUSABILITY: AuthModal and Smart Toolbar components designed for reuse across chapters
✅ ABSTRACTION: Common functionality abstracted into reusable components

## Project Structure

### Documentation (this feature)

```text
specs/005-auth-personalization-translation/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Hybrid Architecture: Web application with separate auth service
auth-service/                    # Node.js auth service (Hono + better-auth)
├── src/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   └── config/
├── package.json
├── tsconfig.json
└── .env.example

backend/                       # Existing Python backend (FastAPI)
├── api/v1/
│   ├── auth.py               # Auth integration endpoints
│   ├── personalize.py        # Personalization endpoints
│   └── translate.py          # Urdu translation endpoints
├── services/
│   ├── auth_service.py
│   ├── personalization_service.py
│   └── translation_service.py
└── models/
    ├── user.py
    └── session.py

src/
├── components/
│   ├── AuthModal/            # Reusable authentication modal
│   │   ├── AuthModal.tsx
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── SmartToolbar/         # Smart toolbar with personalization/translation
│   │   ├── SmartToolbar.tsx
│   │   ├── PersonalizeButton.tsx
│   │   └── TranslateButton.tsx
│   └── common/
│       └── types.ts
└── contexts/
    ├── AuthContext.tsx
    └── PersonalizationContext.tsx

# Existing directories remain unchanged
docs/                         # Textbook chapters
├── ...
├── ...

# Existing config files
.env                          # Environment variables
docusaurus.config.ts          # Docusaurus configuration
```

**Structure Decision**: Hybrid architecture with separate Node.js auth service and extended Python backend. The auth-service handles user authentication and profile management, while the existing backend is extended with personalization and translation endpoints. Frontend components are added to the existing Docusaurus structure to maintain modularity while following the project's architectural standards.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
