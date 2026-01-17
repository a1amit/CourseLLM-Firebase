# Implementation Tasks

- [x] Create `services/ingestion/app/preprocess.py` with `OpenRouterPreprocessor` <!-- id: 0 -->
- [x] Define strict `_SYSTEM_PROMPT` for MD normalization (no JSON, preserve info) <!-- id: 1 -->
- [x] Update `ChunkRequest` in `models.py` with `include_preprocessing` and `preprocess_model` <!-- id: 2 -->
- [x] Update `main.py` `/chunk` endpoint to call preprocessor if enabled <!-- id: 3 -->
- [x] Implement size limits (`PREPROCESS_MAX_INPUT_CHARS`) to prevent excessive costs <!-- id: 4 -->
- [x] Add error handling (fall back to original text if LLM fails or key missing) <!-- id: 5 -->
- [x] Update `docker-compose.yml` to support new env vars <!-- id: 6 -->
