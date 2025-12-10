# CourseLLM Monorepo

This project uses a monorepo structure with a Next.js frontend and Python backend services.

> **Quick Start**: New to the project? See **[GETTING_STARTED.md](GETTING_STARTED.md)** for a 5-minute setup guide!

## Project Structure

```
/
├── apps/
│   └── web/              # Next.js Application
│       ├── .env.local    # Next.js environment variables
│       └── src/...
├── services/
│   └── ingestion/        # Python Ingestion Service (FastAPI)
│       ├── Dockerfile    # Container configuration
│       ├── docker-compose.yml
│       ├── app/
│       │   ├── main.py
│       │   ├── chunker.py       # Chonkie integration
│       │   ├── embeddings.py    # Dual-provider embeddings
│       │   └── schemas.py
│       └── requirements.txt
├── packages/             # Shared libraries (future use)
├── .env.local            # Root-level environment (Firebase emulators)
├── pnpm-workspace.yaml   # Workspace configuration
└── firebase.json         # Firebase configuration
```

## Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0  
- **Firebase CLI**
- **Docker Desktop** (recommended) OR **Python** >= 3.11 (if not using Docker)
- **Google Gemini API Key** (free) - Get one at https://aistudio.google.com/app/apikey

## Setup

### 1. Install JavaScript Dependencies

```bash
pnpm install
```

### 2. Choose Your Backend Setup

**Option A: Docker (Recommended - No Python Install Needed)**
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Skip to Step 3

**Option B: Local Python**
```bash
cd services/ingestion
pip install -r requirements.txt
```

### 3. Environment Configuration

#### Understanding `.env.local` Files in Monorepo

This monorepo has **two separate** `.env.local` files:

1. **Root `.env.local`** - For Firebase emulators and global config
2. **`apps/web/.env.local`** - For Next.js app (API keys, etc.)

Each app reads its own `.env.local` file, not the root one!

#### Setup Steps

**1. Root Environment (Firebase Emulators)**
```bash
cp .env.local.example .env.local
# Configure Firebase settings
```

**2. Next.js Environment (API Keys & Config)**
```bash
cd apps/web
cp ../../.env.local.example .env.local
```

Edit `apps/web/.env.local` and add:
```bash
# Required for chat and assessment features
GOOGLE_API_KEY=your_gemini_api_key_here

# Optional: For Vertex AI embeddings
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=global
GOOGLE_GENAI_USE_VERTEXAI=True
```

**Get a Gemini API key**: https://aistudio.google.com/app/apikey

#### Python Service (Ingestion)
No manual `.env` needed - connects to emulators automatically.
For Vertex AI embeddings, see **[VERTEX_AI_SETUP.md](services/ingestion/VERTEX_AI_SETUP.md)**.

## Running the Application

### Option 1: With Docker (Recommended)

**Benefits**: No Python installation needed, consistent environment, easy cleanup.

```bash
# Terminal 1: Firebase Emulators
firebase emulators:start

# Terminal 2: Ingestion Service (Docker)
pnpm docker:ingestion

# Terminal 3: Next.js Frontend  
pnpm dev:web
```

📖 **Full Docker guide**: See **[DOCKER.md](services/ingestion/DOCKER.md)** for detailed documentation.

### Option 2: Local Python (Without Docker)

```bash
# Terminal 1: Firebase Emulators
firebase emulators:start

# Terminal 2: Ingestion Service (Local)
pnpm dev:ingestion

# Terminal 3: Next.js Frontend
pnpm dev:web
```

### Option 3: Run Services Individually

**Frontend only:**
```bash
cd apps/web
pnpm dev
```

**Backend only (Docker):**
```bash
pnpm docker:ingestion
```

**Backend only (Local Python):**
```bash
cd services/ingestion
uvicorn app.main:app --reload --port 8000
```

**Firebase Emulators:**
```bash
firebase emulators:start
```

## Features

### Chunking Visualizer

Access the chunking debug tool at `http://localhost:9002/debug/chunking` (requires login).

**Features:**
- Test different chunking strategies (Recursive, Semantic, Token)
- Adjust chunk size and  tokenizer (GPT-2, GPT-4, GPT-4o)
- Generate embeddings with dual providers:
  - **Sentence Transformers** (Local): 6 top MTEB models
  - **Vertex AI** (Cloud): Production-grade embeddings
- Load sample documents (ML intro, App architecture)
- Visualize chunks with token counts and embedding vectors

### Embedding Models Available  

**Local (Sentence Transformers):**
1. all-MiniLM-L6-v2 (384D) - ⚡ Fastest
2. all-mpnet-base-v2 (768D) - 🎯 Balanced
3. bge-large-en-v1.5 (1024D) - 🏆 Top Quality
4. stella_en_1.5B_v5 (1024D) - 🚀 Best Overall
5. multi-qa-mpnet (768D) - 💬 Q&A Optimized
6. multilingual-MiniLM (384D) - 🌍 50+ Languages

**Cloud (Vertex AI):**
- gemini-embedding-001 (768D) - Google's latest
- Requires Google Cloud credentials

## Chunking Strategies

The system uses [Chonkie](https://github.com/chonkie-inc/chonkie) for text chunking:

- **Recursive**: Splits text recursively while preserving structure
- **Semantic**: Groups semantically related content together
- **Token**: Simple token-based chunking

## Development

### Adding New Dependencies

**Frontend:**
```bash
cd apps/web
pnpm add <package>
```

**Backend:**
```bash
cd services/api
pip install <package>
echo "<package>" >> requirements.txt
```

### Running Tests

```bash
# Frontend tests
pnpm test

# Backend tests
cd services/api
pytest
```

## API Documentation

When the Python service is running, access the auto-generated API docs at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Deployment

### Frontend
The Next.js app deploys to Firebase Hosting.

### Backend
The Python service deploys to Google Cloud Run.

See individual service READMEs for deployment instructions.
