# Add Topic Model Selection for Chunking


## Context

The ingestion service currently chunks text into smaller pieces based on character count and overlap. While this is useful for feeding LLMs, the resulting chunks are opaque blocks of text. Users (and downstream systems) have no easy way to identify the *subject matter* of a chunk without reading/processing it entirely.

## Problem

1. **Lack of Metadata:** Chunks lack semantic labels.
2. **Hard to Debug:** In the Chunking Preview UI, it's difficult to verify if a chunk contains the expected content boundaries (e.g., did "Linked List" concepts stay together?).
3. **Future Search Needs:** We plan to implement search and filtering. We need keywords/tags for this.

## Solution

We will implement an **automatic topic extraction** feature in the ingestion service.

1.  **Backend Support:**
    *   Add a `topic_extraction` module.
    *   Implement a baseline "heuristic" model (regex/keyword-based) that doesn't require an LLM, ensuring it works fast and offline for dev.
    *   Update the `/chunk` endpoint to accept `include_topics`, `topic_model`, and `max_topics` parameters.
    *   Return a list of topics for each chunk.

2.  **Frontend Update:**
    *   Update `ChunkingPreview` to allow users to toggle topic extraction.
    *   Visualize topics as badges on each chunk card.

## Impact

*   **Ingestion Service:** New dependency on regex patterns; slightly higher latency per request if topics are enabled.
*   **Web App:** UI changes in the debug/preview tools.
*   **Data Model:** Chunks now have a `topics` array [string].

## Alternatives Considered

*   **LLM-based extraction only:** Rejected for now. We want a cheap, fast, deterministic method for basic tagging before adding costly LLM calls.
*   **Static predefined categories:** Rejected. Content is dynamic; we need open-ended extraction.
