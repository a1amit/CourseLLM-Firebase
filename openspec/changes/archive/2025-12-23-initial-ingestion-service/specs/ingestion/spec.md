# Ingestion Service (Architecture)

The Ingestion Service is a lightweight, API-first Python service responsible for preparing course materials for RAG.

## Architecture Principles

1.  **Lightweight:** The Docker image must be small and build fast. No heavy ML frameworks (Torch, TensorFlow) should be installed.
2.  **Stateless:** The service does not persist data (except for ephemeral dev-mode caches).
3.  **API-Driven:** Heavy computational tasks (Embeddings, Ranking, Preprocessing) are offloaded to external APIs (OpenRouter, OpenAI, Vertex).

## Capabilities

### Embedding Generation

The service generates vector embeddings for text chunks.

| Provider | Description | Env Var Required |
| :--- | :--- | :--- |
| `openrouter` | **(Default Prod)** Uses OpenRouter API. | `OPENROUTER_API_KEY` |
| `openai` | Uses OpenAI API. | `OPENAI_API_KEY` |
| `mock` | **(Default Dev)** Deterministic text hashing. Zero cost/latency. Not semantically useful. | None |

### Configuration

**Environment Variables**

*   `EMBEDDING_PROVIDER`: `openrouter`, `openai`, or `mock`.
*   `OPENROUTER_EMBED_MODEL`: Model ID (default: `qwen/qwen3-embedding-8b`).
*   `EMBEDDING_DIM`: Dimension for mock embeddings (default: 64).

## Dependencies

*   **Runtime:** Python 3.11+
*   **Key Libs:** `fastapi`, `uvicorn`, `requests`, `chonkie`.
