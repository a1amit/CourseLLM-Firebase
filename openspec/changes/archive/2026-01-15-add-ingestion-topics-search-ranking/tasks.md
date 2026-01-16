## 1. Topic extraction
- [ ] Add topic fields to chunk models (`topics`, `topic_source`)
- [ ] Add request flags for `/chunk` to enable topic extraction and ranking
- [ ] Implement `topic_extraction.py` with Gemini-backed extraction (model default `gemini-2.5-flash-lite`)
- [ ] Implement safe fallback and/or clear error when Gemini is not configured

## 2. Ranking
- [ ] Implement `ranking.py` (deterministic scoring for topic relevance)
- [ ] Add `rank` to chunk output and populate it when enabled

## 3. Topic search
- [ ] Add `POST /search/topics` endpoint (topic filter + ranking + limit)
- [ ] Add dev in-memory store of last chunking result to back the search endpoint

## 4. Validation
- [ ] Add minimal unit-level tests (if test harness exists) OR add a small manual test script
- [ ] Update docs/env template to document required env vars (`GOOGLE_API_KEY`/Gemini, etc.)
