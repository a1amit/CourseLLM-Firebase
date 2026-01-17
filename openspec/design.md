# Ingestion Service Design

## Architecture Application fit

The Ingestion Service fits into the CourseLLM Microservices Architecture as a specialized **Compute Service**. It acts as the backend processing engine for the **Course Material Service** and plays a critical role in the RAG (Retrieval Augmented Generation) pipeline used by the **LLM Chatbot Service**.

The service interacts with several key architectural components:
*   **Course Material Service (Upstream)**: Handles file uploads (PDF, PPT, DOC) from teachers. It converts these files to Markdown (via the **Convert material / Atudaim** component) before sending the raw text to us for chunking.
*   **Search Content / LLMRnD (Downstream)**: Consumes the vectorized chunks produced by our service to index them in the Vector Database.
*   **LLM Chatbot Service (Consumer)**: While not directly calling us, the chatbot relies on the high-quality chunks we produce to answer student queries accurately.
*   **Memory / Infernobles (Parallel)**: While this service handles *static* course content, the Memory service handles *dynamic* conversation history. Both streams of data are often combined in the chat context window.

### System Context

```mermaid
graph TD
    User[Teacher] -->|Uploads Content| Web[Next.js Web App]
    
    subgraph "Core Application Services"
        Material[Course Material Service\n(Uploads & Conversion)]
        Ops[Content Management\n(LLMEXP)]
    end

    subgraph "Ingestion & Search"
        Ingest[Ingestion Service\n(Chunking & Embedding)]
        Search[Search Service\n(LLMRnD)]
    end

    subgraph "SaaS / Infrastructure"
        Firebase[Firebase Platform]
        DB[Firestore & Vector Store]
    end

    Web --> Material
    Material -->|Sends Markdown| Ingest
    Ingest -->|Returns Chunks + Vectors| Material
    Material -->|Persists| DB
    
    %% RAG Flow
    Student[Student] -->|Asks Question| Web
    Web -->|Queries| Search
    Search -->|Retrieves| DB
    
```

## Technical Design

### Microservice Specification
- **Framework**: FastAPI (Python 3.11+)
- **Deployment Target**: Google Cloud Run (Stateless container)
- **Concurrency**: Asynchronous request handling (uvloop/asyncio) where possible, though heavy compute (chunking) may be CPU bound.

### Internal Pipeline (`/chunk` Endpoint)

The `main.py` entry point orchestrates a linear pipeline for every request:

1.  **Validation**: Checks input size limits (`settings.max_input_chars`).
2.  **Preprocessing (Optional)**:
    *   If `include_preprocessing` is True, sends text to `preprocess.py`.
    *   Uses an LLM (via OpenRouter) to rewrite text into standard Markdown.
3.  **Chunking**:
    *   Invokes `chunking.py`.
    *   Uses a "Structure-Aware" strategy. It doesn't just split by character count; it parses the Markdown syntax tree (likely using libraries like `mass-edit` or custom logic) to keep headers attached to their content.
    *   Generates `chunks_raw`.
4.  **Topic Extraction (Optional)**:
    *   Iterates over chunks.
    *   Calls `topic_extraction.py` (heuristic or LLM based) to populate `topics` field.
5.  **Embedding (Optional)**:
    *   Batches chunk texts.
    *   Calls `embeddings.py` (Wrapper around `sentence_transformers` or API providers).
    *   Populates `embedding` field.
6.  **Response**: Returns the fully enriched JSON object.

### Ephemeral State (Dev Mode)
The service implements a "Dev-only in-memory store" (`_LAST_CHUNKS`) to support the `/search/semantic` endpoint.
- **Why**: Allows developers to tweak chunking parameters and immediately test search quality without deploying to vector databases or running a local Firestore emulator with vector support.
- **Design**: A global list variable serves as the database. This is acceptable because the service is stateless in production and this feature is for debugging only.

## Integration Patterns

### Monorepo Structure
The service lives in `services/ingestion` but shares configuration patterns with the root:
- **Shared Context**: `firebase.json` allows running the service alongside other Firebase emulators.
- **Synchronization**: `README.md` and `docker-compose.yml` ensure the web app can discover the service at `localhost:8000`.

### Security & Auth
- **Current State**: The service is currently Open (Internal). It relies on network isolation (only accessible by the Web App backend or recognized origins).
- **Production**: Should be deployed behind an internal VPC or require a robust Service-to-Service authentication token (e.g., Google Cloud IAM OIDC tokens) from the Next.js backend.

## Dependencies
- **Core**: `fastapi`, `uvicorn`, `pydantic`
- **AI/ML**: `pydantic-ai` (implied), `openai`, `google-cloud-aiplatform` (for Vertex)
- **Monitoring**: `psutil` (system metrics)
- **Utilities**: `python-dotenv`

## Observability

### Health & Metrics Endpoints

The service exposes two observability endpoints:

| Endpoint | Purpose |
|----------|---------|
| `GET /health` | Returns service status, name, and version |
| `GET /metrics` | Returns CPU, memory, and disk usage |

### Service Monitor Dashboard

A web-based monitoring dashboard is available at `/debug/monitoring` (requires authentication). It provides:

- Real-time service health status
- System resource usage (CPU, memory, disk)
- Auto-refresh every 10 seconds
- Response time tracking

