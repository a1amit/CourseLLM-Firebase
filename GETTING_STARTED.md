# Getting Started with CourseLLM

Welcome! This guide will help you run the CourseLLM application on your local machine.

## What You'll Need

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (package manager) - [Install guide](https://pnpm.io/installation)  
- **Firebase CLI** - [Install guide](https://firebase.google.com/docs/cli)
- **Docker Desktop** (recommended but optional) - [Download here](https://www.docker.com/products/docker-desktop/)
- **Google Gemini API Key** (free) - [Get one here](https://aistudio.google.com/app/apikey)

## Quick Start (5 Minutes)

### Step 1: Install Dependencies

Open your terminal and run:

```bash
pnpm install
```

### Step 2: Configure Environment

Create the environment file:

```bash
cd apps/web
cp ../../.env.local.example .env.local
```

Edit `apps/web/.env.local` and add your Gemini API key:

```bash
GOOGLE_API_KEY=your_api_key_here
```

> **Get your API key**: Visit https://aistudio.google.com/app/apikey and create a new key (it's free!)

### Step 3: Start All Services

Open **3 terminal windows** and run these commands:

**Terminal 1 - Firebase Emulators:**
```bash
firebase emulators:start
```

**Terminal 2 - Backend Service:**
```bash
pnpm docker:ingestion
```

**Terminal 3 - Web App:**
```bash
pnpm dev:web
```

### Step 4: Open the App

Visit **http://localhost:9002** in your browser!

## What Each Service Does

| Service | What It Does | URL |
|---------|-------------|-----|
| **Web App** | The main user interface | http://localhost:9002 |
| **Ingestion Service** | Processes course materials, chunks text, generates embeddings | http://localhost:8000 |
| **Firebase Emulators** | Database, authentication, storage (all running locally) | http://localhost:4000 |

## Common Issues & Solutions

### "Port already in use"

**Problem**: Something is already running on the port.

**Solution**: 
```bash
# Windows
netstat -ano | findstr :9002
taskkill /PID <number> /F

# Mac/Linux
lsof -ti:9002 | xargs kill -9
```

### "Can't find firebase command"

**Problem**: Firebase CLI not installed.

**Solution**:
```bash
npm install -g firebase-tools
firebase login
```

### "API Key Expired" or Chat Errors

**Problem**: Wrong environment file or missing API key.

**Solution**: Make sure you edited **`apps/web/.env.local`** (not the root `.env.local`!) and added your Gemini API key. Then restart the web app.

### "Docker not running"

**Problem**: Docker Desktop isn't running.

**Solution**: 
- Start Docker Desktop
- Or run without Docker: `pnpm dev:ingestion` (requires Python 3.11+)

## Running Without Docker

If you don't want to use Docker, you can run the Python service directly:

1. Install Python 3.11 or higher
2. Install dependencies:
   ```bash
   cd services/ingestion
   pip install -r requirements.txt
   ```
3. Run the service:
   ```bash
   pnpm dev:ingestion
   ```

## Key Features to Try

### 1. Chunking Visualizer

Visit **http://localhost:9002/debug/chunking** (requires login)

- Test how the system breaks down course materials
- Try different models and strategies
- See embedding vectors generated from text

### 2. Chat with Socratic Tutor

Navigate to a course and ask questions!

- The AI guides you through learning
- Powered by Google Gemini
- Uses course materials for context

### 3. Personalized Assessments

Generate custom quizzes based on your learning journey.

## Stopping the Application

Press **Ctrl+C** in each terminal window to stop the services.

To stop Docker completely:
```bash
pnpm docker:ingestion:down
```

## Need Help?

- **Documentation**: See `README.md` for technical details
- **Docker Guide**: See `services/ingestion/DOCKER.md`
- **Vertex AI Setup**: See `services/ingestion/VERTEX_AI_SETUP.md`

## What's Next?

Once everything is running:

1. **Create an account** - Sign up through the web interface
2. **Upload course materials** - Add PDFs, presentations, or text
3. **Chat with your content** - Ask questions about your materials
4. **Take assessments** - Test your knowledge

Enjoy using CourseLLM! 🚀
