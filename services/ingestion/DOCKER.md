# Running Ingestion Service with Docker

This guide shows how to run the ingestion service using Docker instead of installing Python dependencies locally.

## Prerequisites

- Docker Desktop installed
- Docker Compose installed (included with Docker Desktop)

## Quick Start

### Option 1: Using npm/pnpm scripts (Recommended)

```bash
# Start the ingestion service in Docker
pnpm docker:ingestion

# Stop the service
pnpm docker:ingestion:down
```

### Option 2: Using docker-compose directly

```bash
# From the ingestion service directory
cd services/ingestion

# Build and start
docker-compose up --build

# Stop (Ctrl+C, then)
docker-compose down
```

## What This Does

The Docker container:
- ✅ Installs all Python dependencies automatically
- ✅ Downloads embedding models on first run (~80-1500MB)
- ✅ Hot-reloads when you edit code (volume mounted)
- ✅ Connects to Firebase Emulators on host machine
- ✅ Runs on http://localhost:8000

## Benefits of Docker

1. **No Local Python Setup**: Don't need to install Python, pip, or dependencies locally
2. **Consistent Environment**: Same Python version and packages for everyone
3. **Isolated**: Won't conflict with other Python projects
4. **Easy Cleanup**: Remove container to free up space

## Environment Variables

The container uses these environment variables (set in docker-compose.yml):

```bash
# Firebase Emulators (connects to host machine)
FIRESTORE_EMULATOR_HOST=host.docker.internal:8080
FIREBASE_STORAGE_EMULATOR_HOST=host.docker.internal:9199

# Vertex AI (optional, for production embeddings)
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=global
GOOGLE_GENAI_USE_VERTEXAI=True
```

## Development Workflow

### With Docker

```bash
# Terminal 1: Firebase Emulators
firebase emulators:start

# Terminal 2: Ingestion Service (Docker)
pnpm docker:ingestion

# Terminal 3: Next.js Frontend
pnpm dev:web
```

### Without Docker (Local Python)

```bash
# Terminal 1: Firebase Emulators
firebase emulators:start

# Terminal 2: Ingestion Service (Local)
pnpm dev:ingestion

# Terminal 3: Next.js Frontend
pnpm dev:web
```

## Troubleshooting

### Container can't connect to emulators

Make sure Firebase emulators are running and accessible. The container uses `host.docker.internal` to connect to services on your host machine.

### Slow first startup

The first time you run the container, it will:
1. Download the Python base image (~200MB)
2. Install all pip packages (~500MB)
3. Download embedding models on first use (~80-1500MB)

Subsequent startups are much faster!

### Port 8000 already in use

Stop any local Python processes running on port 8000:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### Clear all Docker data

```bash
cd services/ingestion
docker-compose down -v  # Removes volumes
docker system prune -af  # Clean up everything
```

## Production Deployment

For Google Cloud Run deployment, use the same Dockerfile:

```bash
# From services/ingestion
gcloud run deploy ingestion-service \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

The Dockerfile is production-ready and will be used automatically by Cloud Run!
