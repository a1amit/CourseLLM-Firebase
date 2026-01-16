# Implementation Tasks

- [x] Create `services/ingestion/app/topic_extraction.py` standardizing topic extraction logic <!-- id: 0 -->
- [x] Implement `heuristic_extract_topics` using regex and stopword lists <!-- id: 1 -->
- [x] Update `ChunkRequest` model to include `include_topics`, `topic_model`, `max_topics` <!-- id: 2 -->
- [x] Update `ChunkResponse` model (specifically `ChunkOut`) to include `topics` and `topic_source` <!-- id: 3 -->
- [x] Modify `/chunk` endpoint in `main.py` to call topic extraction when requested <!-- id: 4 -->
- [x] Update `ChunkingPreview.tsx` with topic configuration controls (toggle, model select) <!-- id: 5 -->
- [x] Update `ChunkingPreview.tsx` to display topic badges on chunk results <!-- id: 6 -->
