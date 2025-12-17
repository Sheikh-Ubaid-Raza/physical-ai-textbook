# ADR-0001: Multi-Service RAG Architecture with Hybrid AI Models

> **Scope**: Document decision clusters, not individual technology choices. Group related decisions that work together (e.g., "Frontend Stack" not separate ADRs for framework, styling, deployment).

- **Status:** Accepted
- **Date:** 2025-12-16
- **Feature:** 004-rag-chatbot
- **Context:** Need to implement a RAG (Retrieval Augmented Generation) system for the Physical AI Textbook that can answer user questions based on textbook content. The system requires both embedding generation for document indexing and language model generation for response creation. Multiple AI service providers offer different strengths and capabilities that need to be leveraged.

<!-- Significance checklist (ALL must be true to justify this ADR)
     1) Impact: Long-term consequence for architecture/platform/security?
     2) Alternatives: Multiple viable options considered with tradeoffs?
     3) Scope: Cross-cutting concern (not an isolated detail)?
     If any are false, prefer capturing as a PHR note instead of an ADR. -->

## Decision

Implement a multi-service RAG architecture that leverages multiple AI providers for different components:

- **Embedding Service**: Google Generative AI with text-embedding-004 model for content vectorization
- **Generation Service**: OpenRouter with Qwen 2.5-7B-Instruct model for question answering
- **Backend Framework**: FastAPI to orchestrate the hybrid AI services
- **Vector Database**: Qdrant Cloud with 768-dimensional embeddings to match Google's embedding model
- **Relational Database**: Neon Serverless Postgres for metadata and session management

<!-- For technology stacks, list all components:
     - Framework: Next.js 14 (App Router)
     - Styling: Tailwind CSS v3
     - Deployment: Vercel
     - State Management: React Context (start simple)
-->

## Consequences

### Positive

- Leverage best-in-class models for each task (Google's embeddings are state-of-the-art, Qwen offers strong reasoning for textbook content)
- Reduced vendor lock-in risk by diversifying AI service providers
- Flexibility to optimize costs by choosing the most economical provider for each component
- Ability to experiment with different models for each function independently
- Potential for better performance by selecting specialized models for embeddings vs generation

### Negative

- Increased architectural complexity with multiple API integrations and service coordination
- Additional operational overhead managing multiple API keys and rate limits
- Higher latency due to multiple service calls in the request chain
- Potential inconsistency in model behavior between different providers
- More complex error handling and monitoring across multiple services
- Dependency on multiple external services increases failure points

## Alternatives Considered

Alternative Stack A: Single provider approach (e.g., OpenAI GPT-4 + embeddings)
- Use OpenAI's text-embedding-3-large and GPT-4 for both embedding and generation
- Why rejected: Would limit flexibility to optimize costs and leverage specialized models

Alternative Stack B: Anthropic approach (Claude + Cohere embeddings)
- Use Anthropic's Claude 3 for generation and Cohere's embedding models
- Why rejected: Would require different integration patterns and potentially higher costs

Alternative Stack C: Single provider with fine-tuned models
- Use one provider (e.g., OpenAI) with fine-tuned models for domain-specific tasks
- Why rejected: Would require more training data and time to achieve domain expertise

## References

- Feature Spec: /mnt/c/physical-ai-textbook/specs/004-rag-chatbot/spec.md
- Implementation Plan: /mnt/c/physical-ai-textbook/specs/004-rag-chatbot/plan.md
- Related ADRs: None
- Evaluator Evidence: /mnt/c/physical-ai-textbook/history/prompts/004-rag-chatbot/0002-plan-rag-chatbot.plan.prompt.md
