<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.0.0 (initial constitution)
- Modified principles: None (new project constitution)
- Added sections: All principles and sections for Physical AI textbook project
- Removed sections: Template placeholders
- Templates requiring updates: N/A (this is the initial constitution)
- Follow-up TODOs:
  - RATIFICATION_DATE: Set to actual adoption date
-->

# Physical AI & Humanoid Robotics Textbook Constitution

## Core Principles

### AI-Native Workflow
All major features must be architected using Spec-Kit Plus specifications before implementation. Every component and feature must begin with a formal specification document that defines interfaces, behaviors, and acceptance criteria before any code is written.

### Educational Clarity
Code structure must be pedagogical; content must be accessible to students using the defined "Physical AI" curriculum. All implementations must prioritize educational value and clarity over optimization when there is a conflict. Documentation and examples must follow educational best practices.

### Modularity
Strict separation between the Content Layer (Docusaurus), Intelligence Layer (RAG/Agents), and Auth Layer. Components must be designed to function independently and have clear, well-defined interfaces between layers. Cross-layer dependencies must be minimized and clearly documented.

### Type Safety
Strict TypeScript for frontend; Type hints for Python backend. All code must be fully typed with no `any` types allowed except in exceptional circumstances with proper justification. Type checking must pass before merging.

### Secrets Management
API Keys (OpenAI, Qdrant, Database) must NEVER be hardcoded. Use `.env` files exclusively. No secrets may be committed to the repository. Secret management must follow industry best practices and be audited regularly.

### Component Reuse
UI components (e.g., "Translate Button", "Personalize Button") must be reusable across chapters. Common functionality must be abstracted into reusable components or hooks. Duplication of UI elements is prohibited without explicit justification.

## Technology & Architecture Standards

### Frontend/Content Standards
Docusaurus v3 (React/TypeScript) for all frontend development. Content written in Markdown/MDX with Mermaid diagrams. All content must be responsive and accessible following WCAG guidelines.

### Backend/RAG Standards
Python (FastAPI) integrated with OpenAI Agents SDK for all backend services. RAG implementation must follow established patterns for retrieval-augmented generation with proper chunking and indexing strategies.

### Database Standards
Neon Serverless Postgres (Relational) for structured data and user management. Qdrant Cloud (Vector) for embeddings and similarity search. All database interactions must be properly typed and validated.

### Authentication Standards
Better-Auth implementation with mandatory user profiling (Hardware/Software background). Authentication must be secure, scalable, and provide proper user segmentation based on background information.

## Development Workflow

### Coding Standards
All code must follow consistent formatting using prettier/eslint for TypeScript and black/isort for Python. Code reviews are mandatory for all changes. Automated testing coverage must exceed 80% for all modules.

### Quality Assurance
All features must pass automated testing before merging. Performance benchmarks must be maintained with Lighthouse scores > 90. Security audits must pass with zero critical vulnerabilities.

### Directory Structure Enforcement
- `/docs`: Textbook chapters (Markdown/MDX).
- `/src`: React components and custom Docusaurus pages.
- `/backend`: FastAPI, RAG logic, and Agent definitions.
- `/specs`: Spec-Kit Plus documentation and architectural blueprints.

## Governance

This constitution governs all development activities for the Physical AI & Humanoid Robotics Textbook project. All team members must adhere to these principles. Changes to this constitution require explicit approval from project leadership and must be documented with clear rationale. Compliance with these principles will be verified during code reviews and automated audits.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Set to actual adoption date | **Last Amended**: 2025-12-14
