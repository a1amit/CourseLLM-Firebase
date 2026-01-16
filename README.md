# CourseLLM Monorepo

CourseLLM is a Firebase + Next.js application with a Python FastAPI ingestion service for chunking/embeddings/topics.

New here? Start with [GETTING_STARTED.md](GETTING_STARTED.md).

## Architecture

CourseLLM uses a **monorepo**: the Next.js frontend and Python micro-services live side-by-side in the same Git repository. This fits our Firebase-centric workflow where infrastructure, frontend, and backend need to evolve together.

### Monorepo vs multi-repo (why we chose monorepo)

In a multi-repo setup, the web app and each micro-service live in separate repositories. That can work, but it tends to introduce friction for our stack:

- **Atomic changes**: a single PR can update a Python endpoint and the React code that calls it.
- **Less version drift**: frontend and backend changes land together instead of “web expects v1.2, service runs v1.3”.
- **Unified local environment**: one repo + one Firebase config to run emulators and connect both the web app and services consistently.
- **Simpler integration contracts**: shared definitions (Firebase Data Connect schema, OpenAPI docs) can live in-repo and be reviewed alongside code.

Trade-off: monorepos require discipline around ownership and build performance. As the project grows, we can introduce a task-graph tool (e.g., Nx/Turborepo) to avoid rebuilding/retesting unrelated parts of the repo.

### How the pieces fit

- **Frontend**: Next.js (React) app in `apps/web/`.
- **Backend services**: containerized Python services in `services/*/` (today: `services/ingestion/`).
- **Firebase context**: root-level `firebase.json`, rules, and Data Connect config provide a single source of truth for emulators and deployment.

### Workflow & synchronization

- Run Firebase emulators from the repo root so the web app and services share the same local Firebase context.
- Use **Data Connect** for rich, schema-driven data services, and **OpenAPI** for other HTTP services (like ingestion).
- Treat schema/API changes as “contracts”: update the backend and the frontend usage in the same PR whenever possible.

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

> [!IMPORTANT]
> Each env file must have the exact name shown (`apps/web/.env.local` is `.env.local` and `services/ingestion/.env` is `.env`).

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
- Optional LLM preprocessing (OpenRouter Gemma 3 27b)
- Optional embeddings (OpenRouter qwen3-embedding-8b)
- Optional topic extraction (deterministic heuristic)
- Semantic search (dev-only, searches the most recent chunking run using cosine similarity)

## Deployment (high level)

- Web: Firebase Hosting
- Ingestion: container-based (Dockerfile in [services/ingestion/Dockerfile](services/ingestion/Dockerfile)), deployable to Cloud Run

For ingestion details (endpoints, env vars, troubleshooting), see [services/ingestion/README.md](services/ingestion/README.md).
