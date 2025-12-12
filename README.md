# CourseLLM Monorepo

CourseLLM is a Firebase + Next.js application with a Python FastAPI ingestion service for chunking/embeddings/topics.

New here? Start with [GETTING_STARTED.md](GETTING_STARTED.md).

## Repo layout

```
apps/web/                 Next.js app (port 9002)
services/ingestion/       FastAPI ingestion service (port 8000)
openspec/                 Specs + change proposals
firebase.json             Firebase config (hosting/emulators)
```

## Prerequisites

- Node.js 18+
- pnpm 8+
- Firebase CLI (`npm i -g firebase-tools`)
- Docker Desktop (recommended for ingestion) or Python 3.11+

## Local development

### 1) Install deps

```bash
pnpm install
```

### 2) Configure env

- Web app env: copy [apps/web/.env.example](apps/web/.env.example) → `apps/web/.env.local`
- Ingestion env (server-only secrets): copy [services/ingestion/.env.example](services/ingestion/.env.example) → `services/ingestion/.env`

Notes:
- The web app reads the ingestion base URL from `NEXT_PUBLIC_INGESTION_URL` (preferred) or `NEXT_PUBLIC_API_URL` (legacy).
- Do not put server secrets behind `NEXT_PUBLIC_*`.

### 3) Run services

Terminal 1 (Firebase emulators):

```bash
pnpm emulators
# or: firebase emulators:start
```

Terminal 2 (Ingestion):

```bash
pnpm docker:ingestion
# or: cd services/ingestion && docker compose up --build
```

Terminal 3 (Web):

```bash
pnpm dev:web
# or: cd apps/web && pnpm dev
```

### URLs

- Web app: http://localhost:9002
- Ingestion API: http://localhost:8000 (Swagger: http://localhost:8000/docs)
- Chunking Lab: http://localhost:9002/debug/chunking (requires login)

## What’s in the Chunking Lab

- Markdown chunking with section path metadata
- Optional embeddings (local sentence-transformers or remote OpenAI/OpenRouter)
- Optional topic extraction (Gemini when configured; deterministic heuristic fallback)
- Topic search + ranking (dev-only, searches the most recent chunking run in-memory)

## Deployment (high level)

- Web: Firebase Hosting
- Ingestion: container-based (Dockerfile in [services/ingestion/Dockerfile](services/ingestion/Dockerfile)), deployable to Cloud Run

For ingestion details (endpoints, env vars, troubleshooting), see [services/ingestion/README.md](services/ingestion/README.md).
