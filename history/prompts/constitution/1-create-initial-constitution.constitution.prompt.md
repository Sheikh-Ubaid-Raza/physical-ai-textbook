---
id: 1
title: Create Initial Constitution
stage: constitution
date: 2025-12-14
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: claude
command: /sp.constitution
labels: [constitution,setup,initial]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

```
**Project:** Physical AI & Humanoid Robotics Textbook (Hackathon I)

**Core Principles:**
1. **AI-Native Workflow:** All major features must be architected using Spec-Kit Plus specifications before implementation.
2. **Educational Clarity:** Code structure must be pedagogical; content must be accessible to students using the defined "Physical AI" curriculum.
3. **Modularity:** Strict separation between the Content Layer (Docusaurus), Intelligence Layer (RAG/Agents), and Auth Layer.

**Technology & Architecture Standards:**
* **Frontend/Content:** Docusaurus v3 (React/TypeScript). Content written in Markdown/MDX with Mermaid diagrams.
* **Backend/RAG:** Python (FastAPI) integrated with OpenAI Agents SDK.
* **Database:** Neon Serverless Postgres (Relational) & Qdrant Cloud (Vector).
* **Authentication:** Better-Auth implementation with mandatory user profiling (Hardware/Software background).

**Coding & Quality Rules:**
* **Type Safety:** Strict TypeScript for frontend; Type hints for Python backend.
* **Secrets Management:** API Keys (OpenAI, Qdrant, Database) must NEVER be hardcoded. Use `.env` files exclusively.
* **Component Reuse:** UI components (e.g., "Translate Button", "Personalize Button") must be reusable across chapters.
* **Reusable Intelligence:** Logic must be encapsulated into reusable Claude Code Subagents and Agent Skills where possible.

**Directory Structure Enforcement:**
* `/docs`: Textbook chapters (Markdown/MDX).
* `/src`: React components and custom Docusaurus pages.
* `/backend`: FastAPI, RAG logic, and Agent definitions.
* `/specs`: Spec-Kit Plus documentation and architectural blueprints.

**Success Criteria:**
1. Successful build and deployment to GitHub Pages.
2. Functional RAG Chatbot capable of answering from selected text.
3. Zero critical security vulnerabilities (verified via audit).
4. Lighthouse Performance score > 90.
```

## Response snapshot

Created the initial constitution file for the Physical AI & Humanoid Robotics Textbook project, incorporating all specified principles, technology standards, and development workflow requirements. The constitution establishes core principles including AI-Native Workflow, Educational Clarity, Modularity, Type Safety, Secrets Management, and Component Reuse. It also defines standards for frontend/content, backend/RAG, databases, authentication, coding standards, quality assurance, and directory structure enforcement.

## Outcome

- ✅ Impact: Created initial project constitution file at .specify/memory/constitution.md with comprehensive governance principles
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with project-specific constitution
- 🔁 Next prompts: Continue with spec development, plan creation, and task generation
- 🧠 Reflection: The constitution successfully captures all core principles and standards specified by the user, providing a solid foundation for the project's governance.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS - Constitution properly created with all required principles
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin specification development based on constitution