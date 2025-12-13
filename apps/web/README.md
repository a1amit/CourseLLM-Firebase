# CourseLLM Web App (Next.js)

Next.js App Router frontend for CourseLLM.

- Dev server: http://localhost:9002
- Chunking Lab: http://localhost:9002/debug/chunking (requires login)

## Chunking Lab

The Chunking Lab is a developer UI for iterating on ingestion behavior:

- Chunk Markdown into RAG-friendly chunks (with optional `section_path` context)
- Optional LLM preprocessing (OpenRouter) to normalize messy input into clean Markdown before chunking
- Optional embeddings (local sentence-transformers, or remote OpenAI/OpenRouter)
- Optional topic extraction (Gemini when configured; deterministic heuristic fallback)
- Topic search (dev-only) over the most recent chunking run, with deterministic ranking

Notes:

- Ranks are computed for **topic search results**; the `/chunk` response does not include ranks by default.
- After you run a topic search, the UI also shows `rank …` badges on matching chunks in the main chunk list.

## Setup

```bash
pnpm install
```

Create your local env file:

```bash
cd apps/web
cp .env.example .env.local
```

Key settings:

- Firebase web config: `NEXT_PUBLIC_FIREBASE_*` (required)
- Ingestion API base URL:
  - `NEXT_PUBLIC_INGESTION_URL` (preferred)
  - `NEXT_PUBLIC_API_URL` (legacy fallback)

Important: anything prefixed with `NEXT_PUBLIC_` is exposed to the browser. Do not put server secrets here.

## Run

```bash
pnpm dev
```

## Useful scripts

- `pnpm typecheck`
- `pnpm lint`
- `pnpm test:e2e`
- `pnpm test:env`
