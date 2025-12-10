// Sample text constants for the Chunking Preview component

export const SAMPLE_ML = `# Introduction to Machine Learning

Machine learning is a subset of artificial intelligence that focuses on the development of algorithms and statistical models.

## Types of Machine Learning

### 1. Supervised Learning
In supervised learning, the algorithm learns from labeled training data. The model makes predictions and is corrected when those predictions are wrong.

### 2. Unsupervised Learning
Unsupervised learning involves training on unlabeled data. The algorithm tries to find patterns and relationships in the data without explicit guidance.

### 3. Reinforcement Learning
This type involves an agent that learns to make decisions by performing actions and receiving rewards or penalties.

## Applications

Machine learning has numerous applications across various industries:
- **Healthcare**: Disease diagnosis and drug discovery
- **Finance**: Fraud detection and algorithmic trading  
- **E-commerce**: Recommendation systems
- **Autonomous Vehicles**: Self-driving cars

## Conclusion

Machine learning continues to evolve and shape the future of technology, enabling systems to learn and improve from experience.`;

export const SAMPLE_ARCHITECTURE = `# Application Flows

Using a conversation to initialize the main flows of the target application:
https://gemini.google.com/share/2d02d16c

This is a Google Cloud-native stack. Using **Firebase Data Connect** is a strategic choice because it provides the developer experience of Firebase (GraphQL) with the capabilities of PostgreSQL (relational queries + vector search).

Here is the complete architecture overview tailored to your specific stack and requirements.

## I. High-Level Architecture Diagram

The system follows a **Event-Driven & Microservices** pattern. The Frontend interacts directly with Firebase services for standard operations (Auth, Read Data, Upload Files) and calls Python Microservices for "Intelligent" operations (Chat, Ingestion).

## II. Infrastructure & Services Breakdown

### 1. Frontend Layer

Framework: Next.js (React).
Hosting: Firebase Hosting (serves the static assets and Next.js SSR functions).
Responsibilities:
- User Interface (Teacher Dashboard, Student Chat, Topics Graph Visualization, Teacher Analytics).
- Authentication handling via Firebase SDK.
- Direct file uploads to Cloud Storage (using Firebase Client SDK).
- GraphQL queries/mutations via Data Connect SDK.

### 2. Data Layer (The "State")

Relational & Vector Data: Firebase Data Connect.
Underlying Tech: Cloud SQL (PostgreSQL).
Why: It handles our complex relational schema (Topics ↔ Chunks) and Vector Search (using the pgvector extension in Postgres) for the RAG pipeline.
Access: GraphQL API.

File Storage: Cloud Storage for Firebase.
- Stores raw files (PDF, PPTX, DOCX).
- Stores processed assets (images extracted from slides).
- Stores converted markdown files.

### 3. Backend Logic (Compute)

Runtime: Google Cloud Run (Serverless Containers).
Framework: Python FastAPI.
Communication:
- Exposes REST endpoints for the Frontend.
- Receives Eventarc triggers (e.g., when a file is uploaded to Storage).

### 4. AI & Intelligence Layer

Framework: DSPy.
Used inside the Python services to orchestrate LLM calls.
Manages "Signatures" (Input/Output definitions) and "Modules" (Chain of Thought, RAG).
LLM Provider: Vertex AI (Google Gemini models), OpenAI, or Qwen hosted on https://openrouter.ai accessed via DSPy.

## III. Backend Microservices Design

To keep the system modular, we split the Python backend into two logical services (deployed as separate Cloud Run services).

### Service A: The Ingestion Service (Async Worker)

Trigger: Eventarc trigger (fires when a file is uploaded to Cloud Storage).

Core Responsibilities (US1 - US3):
1. **File Parsing:** Downloads file from Storage. Uses libraries like MarkItDown to convert raw files into markdown.
2. **DSPy Extraction Module:** Signature: Context -> ExtractedTopics, Summary. Logic: Analyzes text to find topics.
3. **Chunking:** Splits text semantically with libraries such as chonkie.ai
4. **Embedding:** Generates vectors for chunks using an embedding model (e.g., text-embedding-gecko).
5. **Persistence:** Writes structured data (Chunks, Topics, Vectors) into Postgres via Data Connect GraphQL.
6. **Status Update:** Updates the SourceDocument status to ANALYZED.

### Service B: The Tutor Service (Synchronous API)

Trigger: HTTPS Requests from the Next.js Frontend.

Core Responsibilities (US6):
1. **Student Memory Manager:** Retrieves student history from Data Connect.
2. **DSPy RAG Module:** Performs vector search in Postgres, retrieves chunks, generates response.
3. **Quiz Generator:** Topic, Difficulty -> QuizJSON
4. **Logging:** Writes chat logs and analytics back to Data Connect.

## IV. Data Connect Schema (GraphQL Definition)

\`\`\`graphql
# 1. Users & Roles
type User @table {
  id: String!
  email: String!
  role: String! # 'TEACHER' or 'STUDENT'
}

# 2. Course Structure
type Course @table {
  id: UUID! @default(expr: "uuid_generate_v4()")
  title: String!
  description: String
  status: String! # 'DRAFT', 'PUBLISHED'
  teacher: User!
}

type Topic @table {
  id: UUID!
  course: Course!
  name: String!
  definition: String
  prerequisites: [Topic] @relation(name: "TopicPrereqs")
}

# 3. Content & Vectors
type SourceDocument @table {
  id: UUID!
  course: Course!
  storagePath: String!
  status: String!
}

type Chunk @table {
  id: UUID!
  document: SourceDocument!
  content: String!
  embedding: Vector! @col(type: "vector(768)")
  topics: [Topic] @relation(name: "ChunkTopics")
}

# 4. Student Interaction
type ChatSession @table {
  id: UUID!
  student: User!
  course: Course!
  messages: JSON!
}

type StudentMemory @table {
  id: UUID!
  student: User!
  key: String!
  value: String!
  confidence: Float!
}
\`\`\`

## V. Local Development Environment (Emulator)

1. **Frontend:** Run next dev (localhost:3000).
2. **Firebase Emulators:** Run firebase emulators:start
   - Auth Emulator: (localhost:9099)
   - Storage Emulator: (localhost:9199)
   - Data Connect Emulator: (Requires Docker)
3. **Backend (Python):** Run uvicorn main:app --reload --port 8000

## VI. Summary of Frontend Pages

- Sign-up / Sign-in
- User Profile (name, role, courses, usage)
- Course Definition (course name, participants, schedule, teachers)
- Course Material Review (raw material, markdown, chunks, topics)
- Conversation (question, history, quizzes, skills)
- Student Memory Review (skills, example: https://app.mem0.ai/dashboard/memories)
- Teacher Analytics (summary information per student, per topic)`;
