---
id: 0002
title: Phase 3 Implementation Plan
stage: plan
date: 2025-01-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: 005-auth-personalization-translation
branch: 005-auth-personalization-translation
user: claude
command: /sp.plan
labels: ["plan", "authentication", "personalization", "translation", "microservice"]
links:
  spec: specs/005-auth-personalization-translation/spec.md
  ticket: null
  adr: history/adr/0002-hybrid-microservice-architecture-with-node-js-auth-and-python-ai-services.md
  pr: null
files:
  - specs/005-auth-personalization-translation/plan.md
  - specs/005-auth-personalization-translation/research.md
  - specs/005-auth-personalization-translation/data-model.md
  - specs/005-auth-personalization-translation/quickstart.md
  - specs/005-auth-personalization-translation/contracts/auth-api-contract.md
  - specs/005-auth-personalization-translation/contracts/personalization-api-contract.md
  - specs/005-auth-personalization-translation/contracts/translation-api-contract.md
tests:
  - specs/005-auth-personalization-translation/test-cases.md
---

## Prompt

/plan
**ACTION REQUIRED:**
Generate the Implementation Roadmap for **Phase 3 (Auth + Personalization + Translation)**.

**STRATEGY:**
Execute strictly in order: **Data Collection (Auth)** first, then **AI Features (Personalization & Translation)**.

**Sub-Phase 3.1: SCAFFOLD Auth Service (Node.js)**
1.  **Create** `/auth-service` directory (outside `/backend`).
2.  **Initialize** Node.js project with `hono`, `better-auth`, `pg`, `dotenv`.
3.  **Database:** Connect to the **existing Neon Postgres** (Share `DATABASE_URL` from Phase 2).
4.  **Schema Migration:** Apply schema updates (User table + Background fields).

**Sub-Phase 3.2: INTEGRATE Frontend Auth**
5.  **Install** `@better-auth/react` in Docusaurus.
6.  **Build** `AuthModal.tsx`:
    * **Sign In:** Standard Email/Pass.
    * **Sign Up:** Email/Pass + **Select Inputs** for Software/Hardware background.
7.  **Verification:** Test User Signup and verify data in Neon DB.

**Sub-Phase 3.3: BUILD AI Backend Endpoints (Python)**
8.  **Update** Python Requirements: Ensure async DB drivers (`asyncpg`) are ready.
9.  **Implement** `POST /api/personalize`:
    * Fetch `software_background` -> Call OpenRouter (Personalization Prompt).
10. **Implement** `POST /api/translate` (Urdu Feature):
    * **Input:** Chapter Text + User Token (to verify login).
    * **Logic:** Call OpenRouter (Qwen-2.5-72B) with system prompt: *"You are an expert technical translator. Translate the following technical documentation into professional Urdu. Keep key technical terms (e.g., Docker, API, Latency) in English."*
    * **Streaming:** Implement Server-Sent Events (SSE) or chunked streaming for fast UI feedback.

**Sub-Phase 3.4: FRONTEND "Smart Toolbar"**
11. **Swizzle** Docusaurus `DocItem` layout to inject a **Toolbar Component** at the top.
12. **UI Implementation:**
    * Add two buttons: "✨ Personalize" and "🌐 Urdu Translation".
    * **Logic:** Clicking either button checks `session`.
        * If `!session` -> Open `AuthModal`.
        * If `session` -> Call respective API (`/personalize` or `/translate`).
13. **Display Logic:**
    * Show a loading skeleton while streaming.
    * Replace the original English text with the received AI response dynamically.
    * Add a "Revert to Original" button to switch back.

## Response snapshot

Completed comprehensive implementation plan for Phase 3: User Authentication, Content Personalization, and Urdu Translation. The plan includes:

1. Technical Context: Defined technology stack (Node.js, Python 3.11, TypeScript 5.0+, React 18) with dependencies (better-auth, hono, FastAPI, OpenAI Agents SDK, OpenRouter API)

2. Constitution Check: Verified compliance with all project principles including AI-Native Workflow, Educational Clarity, Modularity, Type Safety, Secrets Management, and Component Reuse

3. Project Structure: Designed hybrid architecture with separate Node.js auth service and extended Python backend

4. Research: Made key decisions on architecture, auth solution, AI services, and streaming approach

5. Data Model: Defined entities for User, UserSession, PersonalizedContent, and TranslatedContent with validation rules

6. API Contracts: Created detailed contracts for auth, personalization, and translation services

7. Quickstart Guide: Provided step-by-step setup instructions

8. Agent Context: Updated with new technology stack

## Outcome

- ✅ Impact: Comprehensive implementation plan ready for development
- 🧪 Tests: Test cases planned for validation
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and API contracts
- 🔁 Next prompts: Ready for /sp.tasks to generate implementation tasks
- 🧠 Reflection: Plan addresses all requirements with clear architecture and interfaces

## Evaluation notes (flywheel)

- Failure modes observed: None - plan is complete and well-structured
- Graders run and results (PASS/FAIL): PASS - all requirements addressed
- Prompt variant (if applicable): Original planning prompt
- Next experiment (smallest change to try): Generate implementation tasks with /sp.tasks
