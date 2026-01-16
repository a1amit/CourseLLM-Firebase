# CourseLLM Project Report

> **Project:** CourseLLM Ingestion Service  
> **Report Date:** January 2026  
> **Team Size:** Small collaborative team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Initial Project Scope](#initial-project-scope)
3. [Evolution of the System](#evolution-of-the-system)
4. [AI-Assisted Development](#ai-assisted-development)
5. [AI Models Used](#ai-models-used)
6. [Where AI Excelled](#where-ai-excelled)
7. [Manual Work Required](#manual-work-required)
8. [Lessons Learned](#lessons-learned)
9. [Reflections & Future Considerations](#reflections--future-considerations)
10. [References](#references)

---

## Executive Summary

CourseLLM is an educational platform featuring a FastAPI-based ingestion service that transforms course materials into RAG-friendly (Retrieval-Augmented Generation) chunks. This report documents the development journey, emphasizing how AI-assisted development tools shaped the project's evolution from initial conception to a fully functional chunking and semantic search pipeline.

The project demonstrates a modern approach to software engineering where AI coding assistants are integrated into every phase of development—from architecture decisions and documentation to implementation and code cleanup.

---

## Initial Project Scope

### Starting Point

The project began with a clear objective: build a **chunking service** that takes input text (primarily educational course materials) and prepares it for retrieval in a RAG application. The initial scope encompassed:

| Component | Responsibility |
|-----------|----------------|
| **Chunking Logic** | Split markdown documents into semantically coherent chunks |
| **Embedding Generation** | Compute vector embeddings for each chunk |
| **Semantic Search** | Retrieve relevant chunks based on query similarity |
| **OpenSpec Documentation** | Spec-driven development workflow for tracking changes |
| **Firebase Emulators** | Local development environment setup |
| **Docker Containerization** | Reproducible deployment infrastructure |

### Initial Architecture Decisions

As documented in the [Initial Ingestion Service proposal](openspec/changes/archive/2025-12-23-initial-ingestion-service/proposal.md), the team faced a critical decision regarding the service's architecture:

> *"Previous prototypes used local Python libraries (`sentence-transformers`, `torch`) to generate embeddings... Including `torch` and `transformers` in the Docker image bloats the image to several GBs. Build times are exceeding **10 minutes**."*

This led to the adoption of an **"API-First / Lightweight"** architecture using FastAPI and delegating heavy ML operations to external APIs (OpenRouter).

---

## Evolution of the System

The system evolved through several distinct phases, each building upon the previous iteration.

### Phase 0: Platform Migration (Vercel → Firebase)

The project initially considered Vercel as the deployment platform but quickly pivoted to **Firebase**. This decision provided:
- Unified backend services (Authentication, Firestore, Hosting)
- Firebase Data Connect for schema-driven data services
- Comprehensive local emulator support

*Actual implementation began after this foundational platform decision.*

### Phase 1: Chunker v1 — Initial Implementation

**Reference:** [Initial Ingestion Service Tasks](openspec/changes/archive/2025-12-23-initial-ingestion-service/tasks.md)

The first version included:

```
- [x] Implement `Embedder` protocol in `app/embeddings.py`
- [x] Implement `MockEmbedder` using `hashlib` for offline dev
- [x] Implement `OpenAICompatibleEmbedder` for OpenRouter/OpenAI integration
- [x] Implement `/chunk` endpoint wiring up the lightweight pipeline
```

**Key Components:**
- Multiple Chonkie library options (recursive, semantic chunking strategies)
- LLM-based topic extraction for semantic labeling
- Local embedding models (later replaced with API-based solutions)
- Debug page for visualizing chunking results

### Phase 2: Chunker v2 — Refinement & Optimization

After evaluating performance across different chunking strategies, the team converged on a single approach:

> *The recursive chunking strategy consistently outperformed all other options.*

**Changes:**
- Removed all Chonkie options except `recursive` with `recipe="markdown"`
- Implemented **heuristic-based topic extraction** (non-LLM) as documented in [Topic Model Selection proposal](openspec/changes/archive/2025-12-12-topic-model-selection/proposal.md)

The heuristic approach was chosen because:
> *"We want a cheap, fast, deterministic method for basic tagging instead of using costly LLM calls."*

**Implementation:** [topic_extraction.py](services/ingestion/app/topic_extraction.py)

### Phase 3: LLM Preprocessing (Normalization Layer)

**Reference:** [Optional LLM Preprocessing proposal](openspec/changes/archive/2025-12-13-optional-llm-preprocessing/proposal.md)

A breakthrough improvement came with adding an optional **LLM preprocessing step**:

> *"The structural chunking strategy works perfectly if the input is well-structured Markdown. However, real-world course material input varies significantly: raw lecture notes without headers, copy-pasted slides with messy formatting, poorly formatted Markdown."*

**Solution:** An AI-designed normalization prompt that instructs the LLM to:
1. Preserve 100% of original informational content
2. Improve semantic structure with proper Markdown headers
3. Normalize formatting (lists, tables, emphasis)
4. Prepare for downstream chunking without introducing artificial boundaries

**AI Contribution:** The system prompt in [preprocess.py](services/ingestion/app/preprocess.py) was crafted with AI assistance to achieve optimal preprocessing results:

```python
_SYSTEM_PROMPT = """### SYSTEM / INSTRUCTION PROMPT

You are a preprocessing component in a Retrieval-Augmented Generation (RAG) pipeline.

Your task is to take an input text... and convert it into a **clean, well-structured 
Markdown (MD) document** that preserves **all original information** while improving 
**semantic clarity and structural coherence**.
"""
```

### Phase 4: Semantic Search Implementation

**Reference:** [Semantic Search proposal](openspec/changes/archive/2025-12-19-semantic-search/proposal.md)

With chunking and embeddings working, the team needed to validate the pipeline's effectiveness:

> *"To verify that our chunks and embeddings are actually useful for RAG, we need a way to search them."*

**Implementation:**
- [ranking.py](services/ingestion/app/ranking.py) — Cosine similarity calculation
- In-memory chunk storage for development (no vector database required initially)
- `POST /search/semantic` endpoint


**Infrastructure Optimization:** Switched to OpenRouter-hosted embeddings, significantly reducing Docker environment load times.

### Phase 5: Cleanup & Legacy Code Removal

The final phase focused on:
- Removing deprecated chunking strategies
- Cleaning up unused dependencies
- Code consistency improvements (AI-assisted refactoring)
- Documentation synchronization

---

## AI-Assisted Development

AI assistance was integrated into virtually every aspect of the development process.

### Development Workflow Integration

| Aspect | AI Application |
|--------|----------------|
| **Coding** | Direct code generation and pair programming via IDE integration |
| **Architecture** | Design discussions and technology recommendations |
| **Documentation** | Generating and maintaining specs, proposals, and architecture docs |
| **Troubleshooting** | Debugging assistance and error analysis |
| **Environment Setup** | Docker configuration, Firebase emulator setup |
| **Prompt Engineering** | Designing the normalization prompt for LLM preprocessing |
| **Testing UI** | Rapid prototyping of debug interfaces for functionality testing |
| **Code Cleanup** | Maintaining consistency and removing legacy code |

### Context Management Strategy

The team developed effective strategies for loading AI context:

1. **OpenSpec Framework:** The [AGENTS.md](openspec/AGENTS.md) file provides structured instructions for AI assistants:
   ```markdown
   Always open `@/openspec/AGENTS.md` when the request:
   - Mentions planning or proposals
   - Introduces new capabilities, breaking changes, architecture shifts
   - Sounds ambiguous and you need the authoritative spec before coding
   ```

2. **Proposal-Driven Development:** Each feature was documented via proposals (`proposal.md`) and task lists (`tasks.md`), enabling AI to understand the current focus without lengthy prompts.

3. **Architecture Documentation:** [ARCHITECTURE.md](ARCHITECTURE.md) serves as a comprehensive reference for the system's components and data flow.

---

## AI Models Used

The team utilized multiple AI models through the GitHub Copilot Pro package:

| Model | Primary Use Cases |
|-------|-------------------|
| **Gemini 3 Pro** | General coding assistance |
| **Claude Opus 4.5** | Complex reasoning, architecture decisions |
| **Claude Haiku** | Quick code completions |
| **GPT** | General-purpose assistance |
| **GPT-Codex 5.2** | Code-specific tasks |

### Development Environments
- **VS Code** — Primary IDE for most team members
- **Anti Gravity Environment** — Used by one team member for alternative workflow

### Runtime AI Services
- **OpenRouter API** — LLM preprocessing (default: `google/gemma-3-27b-it:free`)
- **OpenRouter Embeddings** — Vector generation (default: `qwen/qwen3-embedding-8b`)

---

## Where AI Excelled

### Verbal and Documentation Tasks

AI demonstrated exceptional capability in all tasks requiring verbal/written output:
- Comprehensive documentation generation ([ARCHITECTURE.md](ARCHITECTURE.md), README files)
- Proposal writing and spec creation
- Code comments and inline documentation

### Code Generation

- Rapid implementation of boilerplate code
- Algorithm implementation (e.g., cosine similarity, topic extraction heuristics)
- API endpoint scaffolding

### Infrastructure Configuration

AI significantly assisted with:
- Docker and docker-compose configuration
- Firebase configuration files
- Environment variable management

However, these tasks required human oversight:
> *"We used it a lot to make up the setup (Docker and so on) but this one wasn't completely automated—we needed to read, understand, and do some work."*

### Testing UI Development

AI enabled rapid prototyping of testing interfaces, allowing the team to validate functionality quickly through the Chunking Lab debug page.

---

## Manual Work Required

While AI assistance was pervasive, certain tasks required significant human involvement:

### Environment Setup

- Initial Firebase project configuration
- Docker Desktop installation and configuration
- API key management and secret configuration
- Firebase emulator troubleshooting

### Design Decisions

- Choosing Firebase over Vercel
- Selecting the recursive chunking strategy after empirical testing
- Architecture trade-offs (lightweight API-first vs. local ML models)

### Quality Validation

- Evaluating chunking quality empirically
- Comparing embedding model performance
- Testing RAG retrieval effectiveness

> *"Almost every part was somewhat automated using AI, no particular thing we needed to do completely alone."*

---

## Lessons Learned

### Effective AI Usage

1. **Context is King:** Loading appropriate context (specs, proposals, architecture docs) dramatically improves AI assistance quality.

2. **Structured Development Workflow:** The OpenSpec framework provided a spec-driven approach that worked exceptionally well with AI tools.

3. **Iterative Refinement:** AI suggestions often needed refinement, but the iteration cycle was fast and productive.

4. **Creative Applications:** AI proved valuable in unexpected ways—from designing LLM prompts to maintaining code presentation consistency.

### Integration Patterns

- **IDE Integration:** Direct AI assistance in VS Code streamlined the development workflow
- **Platform Diversity:** Different AI models excelled at different tasks
- **Documentation-First:** Well-documented projects enable better AI assistance

### RAG Application Design

The project provided hands-on experience with:
- Chunking strategies and their trade-offs
- Embedding model selection and evaluation
- Semantic search implementation

---

## Reflections & Future Considerations

### Challenges Encountered

1. **Labor Division:** The team's labor division was not optimal, and excessive AI reliance sometimes led to gaps in understanding.

2. **Black Box Components:** Some parts of the system became "black boxes" that team members used without fully understanding internal mechanisms.

> *"The excessive use of AI made us somewhat unaware of certain things which the project contains and made us not understand the entirety of the code."*

### Philosophical Consideration

The team reflected on whether treating components as black boxes represents a problem or an evolution in software engineering:

> *"Maybe the same abstraction a good SE needs to employ is also present here. Maybe it's okay to treat software components as black boxes without necessarily understanding them all—as long as there is enough 'GPU' to go around so we can manipulate the code and understand it as needed."*

This mirrors traditional software engineering principles where abstraction enables scalability, but raises questions about:
- Knowledge distribution within teams
- Debugging capabilities when abstractions fail
- Long-term maintainability

### Recommendations for Future Projects

1. **Balance AI Usage:** Intentionally allocate time to understand AI-generated code
2. **Document Decisions:** Capture *why* decisions were made, not just *what* was implemented
3. **Regular Knowledge Sharing:** Team sync-ups to distribute understanding across components
4. **Selective Deep Dives:** Periodically examine "black box" components to build understanding

---

## References

### Project Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Comprehensive ingestion service architecture |
| [README.md](README.md) | Project overview and setup instructions |
| [openspec/AGENTS.md](openspec/AGENTS.md) | AI assistant instructions for OpenSpec |
| [services/ingestion/README.md](services/ingestion/README.md) | Ingestion service documentation |

### Change Proposals (Archived)

| Proposal | Feature |
|----------|---------|
| [2025-12-23-initial-ingestion-service](openspec/changes/archive/2025-12-23-initial-ingestion-service/proposal.md) | Initial lightweight architecture |
| [2025-12-12-topic-model-selection](openspec/changes/archive/2025-12-12-topic-model-selection/proposal.md) | Heuristic topic extraction |
| [2025-12-13-optional-llm-preprocessing](openspec/changes/archive/2025-12-13-optional-llm-preprocessing/proposal.md) | LLM-based normalization |
| [2025-12-19-semantic-search](openspec/changes/archive/2025-12-19-semantic-search/proposal.md) | Semantic search implementation |

### Key Implementation Files

| File | Purpose |
|------|---------|
| [chunking.py](services/ingestion/app/chunking.py) | Markdown chunking logic |
| [embeddings.py](services/ingestion/app/embeddings.py) | Embedding protocol and implementations |
| [preprocess.py](services/ingestion/app/preprocess.py) | LLM preprocessing with normalization prompt |
| [topic_extraction.py](services/ingestion/app/topic_extraction.py) | Heuristic topic extraction |
| [ranking.py](services/ingestion/app/ranking.py) | Cosine similarity for semantic search |

---

*Report generated with AI assistance — a fitting conclusion to an AI-assisted project.*
