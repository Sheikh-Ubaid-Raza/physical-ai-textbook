# ADR-0002: Hybrid Microservice Architecture with Node.js Auth and Python AI Services

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2025-01-15
- **Feature:** Phase 3 - User Authentication, Content Personalization, and Urdu Translation
- **Context:** Need to add authentication, personalization, and translation features to the existing Physical AI Textbook platform without modifying the existing Docusaurus frontend or RAG chatbot backend. The solution must support user registration with background information, content personalization based on user profiles, and Urdu translation of textbook content.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

Implement a hybrid microservice architecture with two specialized services:

- **Auth Service**: Node.js with Hono framework using `better-auth` library for user authentication and profile management
- **AI Service**: Extended Python FastAPI backend for personalization and translation services
- **Shared Database**: Neon Postgres database accessible by both services
- **API Contracts**: Well-defined REST APIs between services and Docusaurus frontend
- **User Profile Schema**: Extended users table with software_background (Enum: Beginner/Intermediate/Advanced), hardware_background (Enum: None/Arduino/RaspberryPi), and learning_goal fields

## Consequences

### Positive

- Clear separation of concerns between authentication and AI processing services
- Leverage existing Python AI infrastructure for personalization and translation
- Node.js auth service optimized for authentication operations with `better-auth`
- Shared Neon Postgres database ensures data consistency across services
- Supports both logged-in and anonymous users for different features
- Scalable architecture that can grow with additional features
- TypeScript support in both services for improved developer experience

### Negative

- Increased operational complexity with multiple services to manage
- Additional network latency between services
- More complex deployment and monitoring requirements
- Potential for distributed system issues (network partitions, consistency)
- Need for careful coordination between services
- Increased resource consumption compared to monolithic approach

## Alternatives Considered

**Monolithic Architecture**: Extend existing Python FastAPI backend with all functionality
- Why rejected: Would tightly couple authentication concerns with AI processing, making future changes more complex and potentially impacting existing RAG functionality

**Full Microservice Architecture**: Separate services for auth, personalization, translation, and user management
- Why rejected: Over-engineering for current requirements; would introduce unnecessary complexity for a textbook platform

**Serverless Architecture**: Use cloud functions for each service component
- Why rejected: Would create vendor lock-in and potentially higher costs for consistent AI processing workloads; less control over stateful operations

## References

- Feature Spec: specs/004-rag-chatbot/spec.md
- Implementation Plan: specs/004-rag-chatbot/plan.md
- Related ADRs: ADR-0001 (Multi-Service RAG Architecture with Hybrid AI Models)
- Evaluator Evidence: PHR records for Phase 3 architecture planning
