# CourseLLM

## Purpose
CourseLLM (Coursewise) is an educational platform that leverages AI to provide personalized learning experiences. 
It is intended for Undergraduate University Courses and is being tested on Computer Science courses.

To get started, take a look at src/app/page.tsx.

## 🚀 Local Development

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud account (for production deployment)

### Quick Start

**1. Install Dependencies**
```bash
pnpm install
```

**2. Configure Environment Variables**
```bash
cp .env.local.example .env.local
```
Edit `.env.local` with your Firebase project credentials. For local development with emulators, ensure:
```env
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
```

**3. Start Firebase Emulators**
```bash
firebase emulators:start
```
This starts local emulators for Auth, Firestore, and Storage. The Emulator UI is available at **http://localhost:4000**.

| Service   | Port |
|-----------|------|
| Auth      | 9099 |
| Firestore | 8080 |
| Storage   | 9199 |
| UI        | 4000 |

**4. Start the Development Server**
In a separate terminal:
```bash
npm run dev
```
The app runs at **http://localhost:9002**. It will automatically connect to the local emulators.

### Environment Configuration

The app validates environment variables at startup using Zod schemas (see `src/lib/env.ts`):

- **Development with emulators**: Set `USE_FIREBASE_EMULATORS=true`. Firebase credentials can use placeholder values.
- **Production**: All `NEXT_PUBLIC_FIREBASE_*` variables are strictly required. The app will fail fast with descriptive errors if any are missing.

## 🧠 AI Features

### Context-Aware RAG Pipeline

We have implemented an optimized Retrieval-Augmented Generation (RAG) pipeline designed for course materials (textbooks, lectures).

**The Problem:** Standard chunking loses context. A chunk saying "It uses a boolean flag" is useless without knowing it belongs to "Chapter 2 > While Loops".

**Our Solution:**
1.  **Hierarchical Chunking:** We parse Markdown headers to track the full path of every text chunk (e.g., `["Unit 1", "React", "Hooks"]`).
2.  **AI Enrichment:** We use Gemini to generate metadata for each chunk:
    *   **Summary:** One-sentence overview.
    *   **Keywords:** For tag-based filtering.
    *   **Hypothetical Questions:** Enables "Question-to-Question" semantic search.
3.  **Smart Embedding:** We embed a rich context string (Title + Path + Summary + Content) rather than just raw text.

### 🧪 Testing the Pipeline

**1. Configure Environment Variables**
Create a `.env.local` file in the root directory (`CourseLLM-Firebase`) and add your Google Gemini API key. This is required for the AI enrichment features.

```env
GOOGLE_API_KEY=YOUR_API_KEY_HERE
```

**2. Run the Chunking Logic Tests**
Verify that the deterministic chunker correctly handles headers, nesting, and code blocks.
```bash
npx tsx scripts/test-chunking.ts
```

**3. Test the Full AI Pipeline (Genkit UI)**
1.  Start the Genkit server:
    ```bash
    npm run genkit:dev
    ```
2.  Open `http://localhost:4000`.
3.  Click on the **Flows** menu item.
4.  Select `optimizedIndexingFlow`.
5.  Input sample Markdown to see the generated chunks, metadata, and vector embeddings.

    **Example Input JSON:**
    ```json
    {
      "courseId": "cs-101",
      "documentTitle": "Introduction to AI",
      "markdownContent": "# What is AI?\n\nArtificial Intelligence (AI) is the simulation of human intelligence processes by machines.\n\n## Key Concepts\n\n### Machine Learning\nMachine Learning (ML) is a subset of AI that provides systems the ability to automatically learn and improve from experience."
    }
    ```
