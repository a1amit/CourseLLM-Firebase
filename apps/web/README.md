# CourseLLM Web App (Next.js)

Next.js App Router frontend for CourseLLM.

- Dev server: http://localhost:9002
- Chunking Lab: http://localhost:9002/debug/chunking (requires login)

> [!NOTE]
> **GitHub Codespaces users:** Replace `localhost:9002` with your Codespace URL (e.g., `https://your-codespace-name-9002.app.github.dev`)

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
- Ingestion API base URL: `NEXT_PUBLIC_INGESTION_URL`

> [!IMPORTANT]
> Anything prefixed with `NEXT_PUBLIC_` is exposed to the browser. Do not put server secrets here.

## GitHub Codespaces

When running in GitHub Codespaces, you need to configure two things:

### 1. Firebase Auth Domain

Add your Codespace domain to Firebase's authorized domains list:

1. Go to **Firebase Console** → **Authentication** → **Settings** → **Authorized domains**
2. Add your Codespace domain (e.g., `your-codespace-name-9002.app.github.dev`)
3. Find your domain by navigating to `/login` in your browser

### 2. Ingestion Service URL

Update `NEXT_PUBLIC_INGESTION_URL` in your `.env.local` to use the forwarded port URL:

```bash
NEXT_PUBLIC_INGESTION_URL=https://your-codespace-name-8000.app.github.dev
```

### 3. Port Visibility

Set **port 8000 to Public** in the Codespaces Ports panel. This is required for CORS to work correctly between the web app and ingestion service.

## Run

```bash
pnpm dev
```

## Useful scripts

- `pnpm typecheck` — TypeScript type checking
- `pnpm test:e2e` — Playwright end-to-end tests
- `pnpm test:env` — Environment variable unit tests
