---
id: 0002
title: plan-rag-chatbot
stage: plan
date: 2025-12-16
surface: agent
model: claude-sonnet-4-5-20250929
feature: 004-rag-chatbot
branch: 004-rag-chatbot
user: claude
command: /sp.plan
labels: ["architecture", "planning", "rag", "chatbot"]
links:
  spec: /mnt/c/physical-ai-textbook/specs/004-rag-chatbot/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - /mnt/c/physical-ai-textbook/specs/004-rag-chatbot/plan.md
  - /mnt/c/physical-ai-textbook/specs/004-rag-chatbot/research.md
  - /mnt/c/physical-ai-textbook/specs/004-rag-chatbot/spec.md
  - /mnt/c/physical-ai-textbook/.specify/memory/constitution.md
tests:
  - null
---

## Prompt

/plan
**OBJECTIVE:**
**Define** the Technical Implementation Roadmap for **Phase 2 (Hybrid RAG Chatbot)**.

**Sub-Phase 2.1: SCAFFOLD Backend Infrastructure**
1.  **Initialize** `/backend` directory and **Compile** `requirements.txt` (fastapi, uvicorn, qdrant-client, sqlalchemy, openai, google-generativeai).
2.  **Configure** environment variables for `GEMINI_API_KEY` and `OPENROUTER_API_KEY`.
3.  **Establish** database connections:
    * **Connect** Neon Postgres via SQLAlchemy.
    * **Connect** Qdrant Cloud and **Provision** a collection named `textbook_chunks` (Size: 768).

**Sub-Phase 2.2: BUILD Ingestion Pipeline**
4.  **Develop** `ingest.py` script to **Scrape** all `.md` files from `/docs`.
5.  **Vectorize** content:
    * **Invoke** `google.generativeai` to generate embeddings using `text-embedding-004`.
    * **Context Constraint:** **Fetch** latest Google GenAI python docs before coding this step to ensure API compatibility.
6.  **Index** vectors and metadata into Qdrant.

**Sub-Phase 2.3: ORCHESTRATE AI Logic**
7.  **Program** the Agent (`bot.py`):
    * **Route** OpenAI SDK to **OpenRouter** (`qwen/Qwen2.5-7B-Instruct`).
    * **Context Constraint:** **Verify** OpenRouter `base_url` configuration first.
8.  **Implement** RAG Tool: **Query** Qdrant using Gemini embeddings.
9.  **Enforce** Context Logic:
    * **Detect** `selected_text`.
    * **Instruct** model: "Answer ONLY based on this text" if present.
10. **Expose** API Endpoint: **Create** `POST /api/chat`.

**Sub-Phase 2.4: INJECT Frontend UI**
11. **Construct** Custom `ChatWidget` Component (using standard React state/hooks):
    * **Apply Critical CSS:** `position: fixed; bottom: 20px; right: 20px; z-index: 9999`.
12. **Capture** User Intent: **Add** `useEffect` listener for `window.getSelection()`.
13. **Integrate** Globally: **Swizzle** Docusaurus `<Layout>` and **Mount** the widget.

## Response snapshot

Created the implementation plan for the RAG Chatbot Integration (Hybrid Edition) feature. The plan includes:

1. **Summary**: Describes the AI-powered assistance system combining Google's text-embedding-004 model with Qwen 2.5-7B-Instruct via OpenRouter, integrated into a Docusaurus-based documentation site.

2. **Technical Context**: Details the technology stack (Python 3.11, TypeScript 5.0+, FastAPI, etc.), storage (Neon Postgres, Qdrant Cloud), testing approaches, and performance goals.

3. **Research Requirements**: Identified key research areas including Google GenAI API, OpenRouter configuration, Qdrant setup, Docusaurus swizzling, and window selection API.

4. **Constitution Check**: Verified compliance with all project principles including AI-Native Workflow, Educational Clarity, Modularity, Type Safety, Secrets Management, Component Reuse, and Technology Standards.

5. **Project Structure**: Defined the web application structure with separate backend (FastAPI) and frontend (Docusaurus integration) components.

## Outcome

- ✅ Impact: Completed the technical implementation roadmap for the RAG Chatbot feature
- 🧪 Tests: N/A - This was a planning phase
- 📁 Files: Updated plan.md with complete implementation plan, referenced research.md
- 🔁 Next prompts: Ready to proceed with task generation using /sp.tasks
- 🧠 Reflection: The plan provides a comprehensive roadmap with all required research areas addressed

## Evaluation notes (flywheel)

- Failure modes observed: None - All constitution checks passed
- Graders run and results (PASS/FAIL): PASS - Plan aligns with feature spec and constitution
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Generate tasks using /sp.tasks to begin implementation
