# Ingestion Service

## Semantic Search (Dev Endpoint)

The service provides an ephemeral semantic search capability to validate chunking and embedding quality during development.

### Behavior

1.  User calls `POST /chunk` with `include_embeddings=true`.
2.  The service stores the resulting chunks and embeddings in **process memory** (`_LAST_CHUNKS`).
3.  User calls `POST /search/semantic` with a query.
4.  The service embeds the query (using the same model as step 1) and ranks the stored chunks.

> **Note:** This state is lost if the service restarts or if a new `/chunk` request is made.

### API Reference

**POST /search/semantic**

**Request Body** (`SemanticSearchRequest`):

*   `query` (string, required): The search text.
*   `limit` (int, default=25): Max results to return.
*   `min_similarity` (float, optional): Cutoff threshold (0.0 to 1.0).

**Response Body** (`SemanticSearchResponse`):

*   `total_results`: Count of matches found.
*   `chunks`: List of `ChunkOut` objects, sorted by descending relevance.
*   Each chunk includes a `rank` field (the cosine similarity score).

### Ranking Logic

*   **Metric:** Cosine Similarity.
*   **Range:** -1.0 to 1.0 (though usually 0.0 to 1.0 for normalized embedding vectors).
*   **Process:**
    1.  Embed query $\vec{q}$.
    2.  For each chunk $\vec{c}$, calculate $S_c = \frac{\vec{q} \cdot \vec{c}}{||\vec{q}|| ||\vec{c}||}$.
    3.  Sort by $S_c$ descending.
