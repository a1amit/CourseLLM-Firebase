# Commit Helper

This document lists recent feature-related commits to assist with OpenSpec documentation.

## [1bb1e1f] Add initial ingestion service
**Hash:** `1bb1e1f62488321f6098fc950d58d95f5b17a3f6`
**Author:** Amit Abramovich
**Date:** Tue Dec 23 22:14:28 2025 +0200
**Message:**
> feat: Add initial ingestion service with text preprocessing, topic extraction, embedding generation, and a web chunking preview component using openrouter api key only. reduced the container building from ~10 minutes to 27 seconds!

**Files:**
- services/ingestion/README.md
- services/ingestion/app/embeddings.py
- services/ingestion/app/main.py
- services/ingestion/app/models.py
- services/ingestion/app/preprocess.py
- services/ingestion/app/topic_extraction.py
- services/ingestion/docker-compose.yml

## [0cc3d62] Added semantic search
**Hash:** `0cc3d625085ad973095912d8288fc05e3c051343`
**Author:** Amit Abramovich
**Date:** Fri Dec 19 20:10:03 2025 +0200
**Message:**
> added sematic search using cosine similarity on the embeddings

**Files:**
- services/ingestion/app/main.py
- services/ingestion/app/models.py
- services/ingestion/app/ranking.py

## [950e740] Add optional LLM preprocessing
**Hash:** `950e740c52f6771cceaccf1599f0dc0e551c5c1e`
**Author:** Amit Abramovich
**Date:** Sat Dec 13 17:45:04 2025 +0200
**Message:**
> feat: add optional LLM preprocessing for chunking to normalize input into clean Markdown

**Files:**
- services/ingestion/app/chunking.py
- services/ingestion/app/main.py
- services/ingestion/app/models.py
- services/ingestion/app/preprocess.py
- services/ingestion/app/ranking.py
- services/ingestion/docker-compose.yml

## [aacc68d] Add topic model selection
**Hash:** `aacc68ddaea72789ffb0633ece39cd119706101c`
**Author:** Amit Abramovich
**Date:** Fri Dec 12 23:33:18 2025 +0200
**Message:**
> feat: add topic model selection and enhance topic extraction logic

**Files:**
- apps/web/src/components/ChunkingPreview.tsx
- services/ingestion/app/main.py
- services/ingestion/app/topic_extraction.py
