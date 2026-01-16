# Add Semantic Search (Dev Preview)


## Context

We have successfully implemented chunking and embedding generation. We can now break documents into chunks and represent them as vectors.

## Problem

Generating embeddings is only half the battle. To verify that our chunks and embeddings are actually useful for Retrieval-Augmented Generation (RAG), we need a way to **search** them. Currently, we can see the embeddings in the debug UI, but we cannot test if query "X" actually retrieves chunk "Y" with high quality matching.

## Solution

We will implement a **Semantic Search** endpoint in the Ingestion Service.

1.  **Ranking Logic:** Implement Cosine Similarity to compare a Query Vector against Chunk Vectors.
2.  **Dev-Only State:** Since we don't have a vector database connected yet, we will store the *last generated chunks* in-memory within the service.
3.  **Search Endpoint:** Add `POST /search/semantic`.
    *   Accepts a natural language `query`.
    *   Embeds the query using the *same model* that was used to generate the chunks.
    *   Ranks the in-memory chunks by similarity.
    *   Returns the top N matching chunks.

## Impact

*   **Ingestion Service:** Now stateful (ephemeral) for developer convenience.
*   **API:** New `/search` namespace.
*   **Testing:** We can now qualitatively evaluate embedding models (e.g., "Does `qwen` retrieve better chunks than `sentence-transformers`?").

## Alternatives Considered

*   **Connect Vector DB immediately:** Rejected. Too much infrastructure overhead just to validate the *quality* of our chunking/embedding pipeline. In-memory is sufficient for dev.
*   **Client-side cosine similarity:** We could send all vectors to the frontend and calculate there. Rejected because we want to test the *backend's* ability to embed queries and rank, mimicking the production RAG flow.
