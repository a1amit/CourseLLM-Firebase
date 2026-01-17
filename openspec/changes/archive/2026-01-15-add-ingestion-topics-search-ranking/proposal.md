# Change: Add Topics + Topic Search + Ranking to Ingestion

## Why

We need to support course material analysis workflows where chunks are enriched with **topics**, can be **searched by topic**, and returned in a **useful relevance order**. This enables teacher-facing review tools and downstream tutoring/RAG features to operate on structured metadata rather than raw text.

## What Changes

- **Topic extraction (LLM-backed)**: Add optional topic extraction for chunks. When configured, use Gemini (suggested: `gemini-2.5-flash-lite`) to generate a small list of concise topics per chunk.
- **Topic search API**: Add an endpoint to search chunks by topic(s).
- **Ranking**: Add a deterministic ranking function that scores results so the most relevant topic matches appear first.
- **Dev storage**: For local/dev, store the most recent chunking run in memory to support topic search without requiring persistence.

## Impact

- **Affected specs**: `openspec/changes/add-ingestion-topics-search-ranking/specs/ingestion/spec.md`
- **Affected code**:
  - `services/ingestion/app/models.py` (request/response schemas for topics/search)
  - `services/ingestion/app/main.py` (new flags and new search endpoint)
  - `services/ingestion/app/topic_extraction.py` (new)
  - `services/ingestion/app/ranking.py` (new)
  - `services/ingestion/requirements.txt` (optional `google-genai` dependency)
- **Breaking changes**: None (new fields are optional; existing `/chunk` behavior remains the default).

## Notes / Constraints

- If Gemini credentials are not configured, topic extraction should either:
  - return a clear HTTP error when explicitly requested, **or**
  - fall back to a simple heuristic extractor (configurable).  
  The spec delta will define the expected behavior.
