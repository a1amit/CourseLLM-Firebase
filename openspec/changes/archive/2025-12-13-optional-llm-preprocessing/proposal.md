# Add Optional LLM Preprocessing for Chunking


## Context

The ingestion service uses a "structural chunking" strategy (`chunk_markdown` in `chunking.py`). This strategy iterates over the Markdown context tree (headers, sections) to create semantically meaningful chunks. Ideally, each chunk corresponds to a specific section or topic defined by a header.

## Problem

The structural chunking strategy works perfectly *if* the input is well-structured Markdown. However, real-world course material input varies significantly:
*   Raw lecture notes without headers.
*   Copy-pasted slides with messy formatting.
*   Poorly formatted Markdown.

When the input lacks structure (e.g., no headers), the deterministic chunker fails to separate topics effectively, leading to large, mixed-topic chunks or poor retrieval performance.

## Solution

We will introduce an optional **LLM Preprocessing** step in the ingestion pipeline.

1.  **Normalization via LLM:** Before chunking, we can pass the raw input text to an instruction-tuned LLM (via OpenRouter).
2.  **Strict System Prompt:** The LLM will be instructed to Rewrite the content into **clean, well-structured Markdown** while preserving 100% of the information. It will insert headers to reflect topic hierarchy.
3.  **Pipeline Integration:** The normalized Markdown output is then passed to the existing structural chunker, ensuring high-quality chunks.

## Impact

*   **Ingestion Service:** Adds a dependency on an external LLM provider (OpenRouter) and introduces latency/cost to the chunking process (optional).
*   **API:** `/chunk` endpoint updates.
*   **Configuration:** Requires `OPENROUTER_API_KEY`.

## Alternatives Considered

*   **Heuristic Preprocessing:** Trying to guess headers with regex. Rejected because it's brittle for unstructured notes.
*   **chunk-by-token only:** Fallback to standard token splitting. Rejected because we lose the semantic benefits of section-aware chunking.
