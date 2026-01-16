# Implementation Tasks

- [x] Create `services/ingestion/app/ranking.py` with `cosine_similarity` math <!-- id: 0 -->
- [x] Create `SemanticSearchRequest` and `SemanticSearchResponse` pydantic models <!-- id: 1 -->
- [x] Modify `main.py` to store `_LAST_CHUNKS` and `_LAST_EMBEDDER_SETTINGS` in memory <!-- id: 2 -->
- [x] Implement `POST /search/semantic` endpoint <!-- id: 3 -->
    - [x] Embed users query using the locally loaded/configured embedder <!-- id: 3.1 -->
    - [x] Calculate similarity against all stored chunks <!-- id: 3.2 -->
    - [x] Sort and filter by `min_similarity` <!-- id: 3.3 -->
- [x] Update frontend `ChunkingPreview` to call search endpoint <!-- id: 4 -->
