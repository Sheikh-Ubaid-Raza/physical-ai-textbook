---
id: 0001
title: Create Phase 3 Specification
stage: spec
date: 2025-01-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: 005-auth-personalization-translation
branch: 005-auth-personalization-translation
user: claude
command: /sp.specify
labels: ["spec", "authentication", "personalization", "translation", "user-experience"]
links:
  spec: specs/005-auth-personalization-translation/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/005-auth-personalization-translation/spec.md
  - specs/005-auth-personalization-translation/checklists/requirements.md
tests:
  - specs/005-auth-personalization-translation/test-cases.md
---

## Prompt

/spec
**OBJECTIVE:**
Define the architecture for **Phase 3: User Authentication, Content Personalization, and Urdu Translation**.

**CURRENT STATUS (DO NOT MODIFY):**
* **Phase 1 (Frontend):** Docusaurus Textbook is successfully deployed and content is written.
* **Phase 2 (Backend):** RAG Chatbot (FastAPI + Vector DB) is fully functional and tested.
* **CONSTRAINT:** Do NOT refactor, touch, or modify the existing Docusaurus content structure or the RAG Chatbot logic. Focus ONLY on adding the *new* layer for Auth, Personalization, and Translation.

**CONTEXT:**
We are adding a "Hybrid Microservice" layer to our existing project:
1.  **Auth Service (NEW):** A lightweight Node.js/Hono service using `better-auth`.
2.  **AI Service (EXISTING):** The Python FastAPI backend (will be extended).
3.  **Database:** Shared Neon Postgres.

**REQUIREMENT 1: Authentication & Data Collection (Node.js)**
* **Tool:** Use `better-auth` (TypeScript).
* **Schema Extension:** The `user` table MUST store:
    * `software_background` (Enum: "Beginner", "Intermediate", "Advanced")
    * `hardware_background` (Enum: "None", "Arduino", "RaspberryPi")
    * `learning_goal` (Text)
* **UX:** On "Sign Up", prompt the user to fill these fields.
* **Integration:** Ensure the Auth Token is accessible to the Docusaurus frontend.

**REQUIREMENT 2: Personalization Engine (Python)**
* **Trigger:** A "✨ Personalize Chapter" button on the Docusaurus Frontend.
* **Flow:**
    1.  Frontend sends `chapter_content` + `user_id` to Python Backend.
    2.  Python Backend fetches user's `software_background` from the Shared DB.
    3.  **AI Processing:**
        * **Provider:** OpenRouter.
        * **Model:** `meta-llama/llama-3.1-70b-instruct` or `qwen/qwen-2.5-72b-instruct`.
        * **Prompt:** "Rewrite this content for a user who is a [Level] in software..."

**REQUIREMENT 3: Urdu Translation Engine (Bonus Feature)**
* **Objective:** Allow logged-in users to read the chapter in Urdu.
* **Trigger:** A "🌐 Translate to Urdu" button at the start of each chapter (next to Personalize).
* **Constraint:** **Strictly for Logged-in Users only.** If not logged in, show Auth Modal.
* **AI Processing:**
    * **Endpoint:** `POST /api/translate`
    * **Model:** Use `qwen/qwen-2.5-72b-instruct` (Excellent for Urdu/English mix).
    * **Prompting Strategy:** Do not just translate word-for-word. Maintain technical terms (like 'ROS 2', 'Node', 'Latency') in English but explain the concept in natural Urdu (Roman Urdu or Script depending on configuration, default to Urdu Script).
    * **Performance:** Stream the response to handle long chapters gracefully.

**OUTPUT:**
* Define the Shared Database Schema (SQL).
* Define the API Contract for the new Node Auth Service.
* Define the API Contracts for BOTH Python Endpoints (Personalization & Translation).

## Response snapshot

Created comprehensive specification for Phase 3: User Authentication, Content Personalization, and Urdu Translation. The specification includes:

1. User Scenarios & Testing with 3 prioritized user stories:
   - User Registration with Background Information (P1)
   - Content Personalization Based on User Profile (P2)
   - Urdu Translation for Logged-in Users (P3)

2. Functional Requirements (FR-001 to FR-013) covering:
   - User registration with background fields
   - Authentication and session management
   - Personalization and translation features
   - AI integration with OpenRouter
   - Security and data persistence

3. Key Entities: User, UserSession, PersonalizedContent, TranslatedContent

4. Success Criteria (SC-001 to SC-008) with measurable outcomes

5. Edge cases for error handling and system resilience

The specification is complete and ready for the planning phase.

## Outcome

- ✅ Impact: Successfully defined comprehensive specification for Phase 3 features
- 🧪 Tests: Test cases planned for validation
- 📁 Files: Created spec.md and requirements checklist
- 🔁 Next prompts: Ready for /sp.plan to create implementation plan
- 🧠 Reflection: Specification addresses all requirements with clear acceptance criteria

## Evaluation notes (flywheel)

- Failure modes observed: None - specification is complete and well-structured
- Graders run and results (PASS/FAIL): PASS - all requirements addressed
- Prompt variant (if applicable): Original specification prompt
- Next experiment (smallest change to try): Create implementation plan with /sp.plan
