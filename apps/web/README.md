# CourseLLM Web App (Next.js)

Next.js App Router frontend for CourseLLM.

- Dev server: http://localhost:9002
- Chunking Lab: http://localhost:9002/debug/chunking (requires login)

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
