# Ingestion Service (FastAPI)

The ingestion service turns markdown into RAG-friendly chunks and can optionally add:

- LLM preprocessing to normalize messy input into clean Markdown (OpenRouter Nova 2 Lite)
- embeddings (local sentence-transformers or OpenAI/OpenRouter)
- per-chunk topics (Gemini when configured; heuristic fallback)
- dev-only topic search + ranking over the most recent chunking run

## Architecture & pipeline

```mermaid
flowchart TB
  A["Input text or Markdown"] --> P{"include_preprocessing"}
  P -- Yes --> P1["LLM preprocessing<br/>normalize to clean Markdown"]
  P -- No --> B["Markdown-aware section splitter<br/>ignores fenced code blocks"]
  P1 --> B
  B --> C["Recursive chunking + overlap<br/>Chonkie based"]
  C --> D["Chunks: index, text, token_count, section_path optional"]

  D --> E{"include_topics"}
  E -- Yes --> F["Topic extraction"]
  F --> G{"Gemini available"}
  G -- Yes --> H["Gemini model: topic_model or TOPIC_MODEL"]
  G -- No --> I["Heuristic fallback: deterministic"]
  H --> J["Chunks + topics: topic_source gemini"]
  I --> K["Chunks + topics: topic_source heuristic"]
  J --> L["Continue"]
  K --> L
  E -- No --> L

  L --> M{"include_embeddings"}
  M -- Yes --> N["Embedding generation: sentence-transformers, OpenAI, OpenRouter"]
  M -- No --> O["Skip embeddings"]
  N --> P["Chunks + embedding vectors"]
  O --> P

  P --> Q["Store last chunks in memory<br/>dev only backing for /search/topics"]
  Q --> R["Return POST /chunk response<br/>plus optional warnings"]

  S["POST /search/topics"] --> T["Filter: matches_query"]
  T --> U["Rank: score_topic_match 0 to 100"]
  U --> V["Return ranked chunks with rank"]
  Q -.-> T
```

## Run locally

Docker (recommended):

```bash
cd services/ingestion
docker compose up --build
```

Note: the first Docker build can take ~10 minutes because it installs the local embeddings dependencies (sentence-transformers / PyTorch stack). Subsequent builds are much faster due to Docker layer caching.

Local Python (requires Python 3.11+):

```bash
cd services/ingestion
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## API

- `GET /health`
- `POST /chunk`
- `POST /search/topics` (development only; searches the most recent `/chunk` results stored in memory)

Swagger UI: http://localhost:8000/docs

### `POST /chunk`

Request fields of interest:

- `text` (markdown)
- `chunk_size`, `overlap_size` (set `overlap_size: 0` to disable overlap)
- `include_section_path`
- `include_preprocessing` (+ optional `preprocess_model`)
- `include_embeddings` (+ `embedding_provider`, `embedding_model`)
- `include_topics` (+ `topic_model`, `max_topics`)

Example (topics + embeddings):

```bash
curl -X POST http://localhost:8000/chunk \
  -H "Content-Type: application/json" \
  -d '{
    "text": "# PRD\n\nThis PRD covers objectives and success metrics.",
    "include_topics": true,
    "max_topics": 8,
    "include_embeddings": true,
    "embedding_provider": "sentence-transformers",
    "embedding_model": "sentence-transformers/all-MiniLM-L6-v2"
  }'
```

Example (preprocess messy input into clean Markdown before chunking):

```bash
curl -X POST http://localhost:8000/chunk \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Lecture 3 - intro\n\nSLIDE 1: ...",
    "include_preprocessing": true,
    "preprocess_model": "amazon/nova-2-lite-v1:free"
  }'
```

Response:

- `chunks[]` with `text`, `token_count`, optional `section_path`
- optional `topics` + `topic_source`
- optional `embedding`
- optional response-level `warnings` (e.g., when topic extraction falls back)

### `POST /search/topics`

Important: this endpoint requires that you called `POST /chunk` first (ideally with `include_topics=true`).

```bash
curl -X POST http://localhost:8000/search/topics \
  -H "Content-Type: application/json" \
  -d '{
    "topics": ["prd", "metrics"],
    "match": "any",
    "min_rank": 50,
    "limit": 25
  }'
```

## Configuration

Docker Compose reads environment variables from `services/ingestion/.env` automatically.
Create it from the template:

- copy [services/ingestion/.env.example](services/ingestion/.env.example) → `services/ingestion/.env`

### Core

- `CORS_ALLOW_ORIGINS` (default: `http://localhost:3000,http://localhost:9002`)
- `CHUNK_SIZE` (default: `450`)
- `OVERLAP_SIZE` (default: `80`)
- `TOKENIZER` (default: `word`)
- `MAX_INPUT_CHARS` (default: `400000`)

### Embeddings

- `EMBEDDING_PROVIDER` = `sentence-transformers` (docker default), `mock`, `openai`, `openrouter`
- `ST_MODEL` (default: `sentence-transformers/all-MiniLM-L6-v2`)
- `ST_NORMALIZE` (default: `true`)
- `MAX_EMBED_CHUNKS` (default: `256`)
- `OPENAI_API_KEY` (+ optional `OPENAI_BASE_URL`, `OPENAI_EMBED_MODEL`)
- `OPENROUTER_API_KEY` (+ optional `OPENROUTER_EMBED_MODEL`)

### Preprocessing (OpenRouter)

- `OPENROUTER_API_KEY` is required when `include_preprocessing=true` (or when `PREPROCESS_ENABLED=true`)
- `PREPROCESS_ENABLED` (default: `false`)
- `PREPROCESS_MODEL` (default: `amazon/nova-2-lite-v1:free`)
- `PREPROCESS_TIMEOUT_S` (default: `60`)
- `PREPROCESS_MAX_INPUT_CHARS` (default: `40000`)

Notes:

- The preprocessor requests `reasoning.effort="none"` (when supported) to keep preprocessing fast and avoid returning reasoning traces.

### Topics

- `GOOGLE_API_KEY` (or `GOOGLE_GENAI_API_KEY`) enables Gemini-backed topic extraction
- `TOPIC_MODEL` sets the default Gemini model (default: `gemini-2.5-flash-lite`)
- `TOPIC_DEBUG=true` adds a second warning line with error details (container logs always include stack traces)

## Troubleshooting

### Topic extraction falls back with `heuristic:error`

Check container logs:

```bash
cd services/ingestion
docker compose logs -f ingestion
```

Common causes:

- Gemini API quota / rate limiting (HTTP 429 RESOURCE_EXHAUSTED)
- temporary network errors
- invalid model name

When you hit quota, the service intentionally falls back to a deterministic heuristic extractor and returns a warning.
