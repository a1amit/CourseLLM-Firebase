# Initial Ingestion Service (Lightweight Architecture)


## Context

We need a service to ingest course materials (text/markdown), chunk them, and generate embeddings for RAG.
Previous prototypes used local Python libraries (`sentence-transformers`, `torch`) to generate embeddings.

## Problem

1.  **Slow CI/CD:** Including `torch` and `transformers` in the Docker image bloats the image to several GBs. Build times are exceeding **10 minutes**.
2.  **Resource Heavy:** Running these models locally requires significant RAM/CPU, making it harder to run the full stack on standard dev laptops alongside other services.

## Solution

We will implement the **Initial Ingestion Service** with a strict **"API-First / Lightweight"** architecture.

1.  **Architecture:**
    *   **Framework:** FastAPI (lightweight, async).
    *   **Chunking:** `chonkie` (pure Python, fast).
    *   **Embeddings:** Delegate to **OpenRouter** (or OpenAI) via HTTP APIs. Remove all local ML model dependencies.
    *   **Dev Mode:** Implement a zero-dependency `MockEmbedder` (deterministic hashing) for offline development.

2.  **Key Changes:**
    *   **Remove:** `torch`, `sentence-transformers` from `requirements.txt`.
    *   **Add:** `OpenAICompatibleEmbedder` class manually using `requests`.
    *   **Docker:** Clean Python-slim base image.

## Impact

*   **Build Time:** Expected efficient reduction (target < 1 min).
*   **Infrastructure:** Service becomes I/O bound rather than CPU bound.
*   **Cost:** Incurs small API costs for embeddings (approx $0.01 per course), which is acceptable compared to cloud GPU/CPU costs.

## Alternatives Considered

*   **ONNX Runtime:** Using quantized models locally. Still requires significant dependencies (~200MB+) and complexity. Rejected for initial simplicity.
*   **Lambda/Cloud Functions:** Deploying vectorization as a serverless function. Rejected to keep the architecture contained in a single service for now.
