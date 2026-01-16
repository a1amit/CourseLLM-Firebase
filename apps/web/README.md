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
- `pnpm test:e2e` — Playwright end-to-end tests (requires emulators)
- `pnpm test:env` — Environment variable unit tests

## Dependencies

### Core

| Package | Version | Description |
|---------|---------|-------------|
| `next` | ^15.5.7 | React framework with App Router |
| `react` | ^18.3.1 | UI library |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `typescript` | ^5 | TypeScript compiler |

### Firebase

| Package | Version | Description |
|---------|---------|-------------|
| `firebase` | ^11.9.1 | Firebase JS SDK |
| `firebase-admin` | ^11.11.0 | Firebase Admin SDK (server-side) |

### AI / Genkit

| Package | Version | Description |
|---------|---------|-------------|
| `genkit` | ^1.20.0 | Google AI toolkit |
| `@genkit-ai/google-genai` | ^1.20.0 | Google GenAI plugin for Genkit |
| `@genkit-ai/next` | ^1.20.0 | Next.js integration for Genkit |

### UI Components

| Package | Version | Description |
|---------|---------|-------------|
| `@radix-ui/*` | Various | Headless UI primitives |
| `lucide-react` | ^0.475.0 | Icon library |
| `tailwindcss` | ^3.4.1 | CSS framework |
| `class-variance-authority` | ^0.7.1 | Variant styling utilities |
| `tailwind-merge` | ^3.0.1 | Tailwind class merging |
| `recharts` | ^2.15.1 | Charting library |

### Forms & Validation

| Package | Version | Description |
|---------|---------|-------------|
| `react-hook-form` | ^7.54.2 | Form state management |
| `@hookform/resolvers` | ^4.1.3 | Form validation resolvers |
| `zod` | ^3.24.2 | Schema validation |

### Dev Dependencies

| Package | Version | Description |
|---------|---------|-------------|
| `@playwright/test` | ^1.40.0 | E2E testing framework |
| `tsx` | ^4.19.2 | TypeScript execution |
| `eslint` | ^8.57.1 | Linting |
| `genkit-cli` | ^1.20.0 | Genkit CLI tools |
