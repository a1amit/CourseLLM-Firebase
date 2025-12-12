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

export const SAMPLE_PRD = `# What is a PRD

In product management and development, **PRD** stands for **Product Requirements
Document**. It is a comprehensive guide that outlines the purpose, features, functionality, and
behavior of a new product or a significant feature.

The PRD serves as a "single source of truth" that aligns cross-functional teams (product
managers, designers, developers, and stakeholders) on what needs to be built and why.

## Key Components of a PRD

A PRD typically includes:

The PRD is a living document that is updated throughout the development lifecycle to reflect
new insights and feedback, helping manage expectations and prevent _scope creep_.

To make the PRD a living document, we will keep it as a component of our GitHub repository
and update it through a set of reviewed PRs (Pull Requests).

# PRDs and LLMs

Large Language Models (LLMs) can significantly streamline and enhance the process of
working on Product Requirements Documents (PRDs) by acting as powerful assistants for
generation, refinement, analysis, and validation.

\`\`\`
Overview and Objectives: A high-level summary of the product's vision, goals, and how
it aligns with overall business strategy.
Target Audience & Problem Statement: Identification of the customer personas and
the specific pain points or problems the product aims to solve for them.
Features and Functionality: A detailed list of what the product must do, often broken
down into user stories and acceptance criteria.
User Experience (UX) Requirements: Descriptions or visuals (wireframes, mockups) of
the intended user flow and interface design.
Technical Specifications: Details for the engineering team, such as the technology
stack, performance expectations, security, and integrations.
Release Plan & Timeline: Key milestones, dependencies, and a target release date.
Metrics for Success: Key Performance Indicators (KPIs) used to measure the product's
performance and impact after launch. It should be possible to measure quantitatively that
using the product contributes to value as defined by the audience. To this end, the
product must produce logs of activity that can be analyzed to compute automatic metrics
that measure indication of value.
Assumptions and Constraints: Potential risks, limitations (e.g., budget, resources,
regulatory), and assumptions made during planning.
\`\`\`

Here is how LLMs can help with writing, improving, and critiquing PRDs:

## To Write PRDs (Generation & Drafting)

LLMs excel at generating structured content quickly, drastically reducing the time required to
create a first draft:

## To Improve PRDs (Refinement & Enhancement)

LLMs can act as an editor and a writing coach, enhancing the clarity and quality of the
document:

## To Critique PRDs (Validation & Analysis)

LLMs can simulate different perspectives and identify potential weaknesses or gaps in the
document:

\`\`\`
Generating a Structured Template: An LLM can instantly generate a standard PRD
template with relevant sections (e.g., Objectives, Target Audience, Features, Metrics)
tailored to a specific industry or product type.
Drafting Section Content: By providing a brief prompt or a few bullet points, an LLM
can flesh out full sections. For example, a prompt like "Draft a problem statement for a
new task management app aimed at remote teams" can produce a polished,
professional description.
Creating User Stories: LLMs can transform high-level requirements into structured user
stories in the standard format: "As a (user persona), I want to (action), so that I can
(benefit/value)". This saves significant time in agile planning.
Summarizing Inputs: LLMs can ingest meeting notes, customer feedback transcripts, or
market research data and synthesize them into concise summaries suitable for the
"Problem Statement" or "Assumptions" sections of the PRD.
\`\`\`
\`\`\`
Enhancing Clarity and Conciseness: LLMs can rephrase technical jargon into plain
language, ensuring the document is easily understood by all stakeholders (engineering,
design, marketing).
Improving Tone and Consistency: They can adjust the tone to be formal, encouraging,
or objective, and ensure consistent terminology is used throughout the document.
Proofreading and Editing: LLMs catch grammatical errors, typos, and syntax issues
faster and sometimes more effectively than standard grammar tools.
Formatting and Structure: They can suggest improvements to the document's
structure, ensuring a logical flow from high-level objectives down to specific technical
requirements.
\`\`\`
\`\`\`
Identifying Gaps and Ambiguity: An LLM can be prompted to review a finished draft
and ask questions a developer or designer might have, such as, "Does this feature
\`\`\`

Large Language Models (LLMs) can act as assistants for product managers, significantly
enhancing the process of working on Product Requirements Documents (PRDs) by
streamlining drafting, improving content quality, and offering critical feedback.

# Workflow

We describe here a specific workflow to prepare and maintain the PRD of the product using
LLMs based on using GitHub as a shared repository among the team.

# Using LLMs to Enhance Requirements

LLMs excel at translating unstructured information into structured, comprehensive
documents, reducing the time spent on initial drafting and documentation, helping adopt
best-practices and increasing consistency when multiple authors collaborate on the
requirements.

\`\`\`
description clearly define acceptance criteria?" or "What use cases are missing from this
section?".
Checking for Alignment and Consistency: LLMs can cross-reference different
sections to ensure the features proposed in one section directly address the objectives
outlined earlier in the document.
Simulating Stakeholder Reviews: An LLM can adopt a persona, such as an
"overburdened engineer" or a "skeptical VP of Marketing," to provide critical feedback on
feasibility, marketability, or resource constraints.
Validating Metrics: LLMs can suggest relevant KPIs or evaluate whether the proposed
"Metrics for Success" directly measure the achievement of the stated goals.
\`\`\`
1. We will store the PRD related files under a folder in the Repo named PRD.
2. All the files will be stored in Markdown format (.md) Why MD as format for LLMs
3. We will start with the following files:
   1. **DraftPRD.md** - the high level ideas, brainstorming level.
   2. **PRD.md** - the _live_ PRD for the project - it will be updated over time using Pull
     Requests.
4. We will then refine the toplevel PRD file into different perspectives:
   1. **UserStories.md** - the user stories, broken down by user persona and features.
   2. **DataModel.md** - the data model description
   3. **Glossary.md** - the project terminology to be used consistently when describing
     functionality
   4. **AcceptanceCriteria.md** - the list of criteria, KPIs and metrics that will be used to
     determine the product is ready for release.

\`\`\`
Generating First Drafts from Notes: Product managers can input brainstorming notes,
meeting summaries, or high-level goals and ask the LLM to structure them into a formal
PRD draft using a predefined template (e.g., as user stories with "Given/When/Then"
\`\`\`

LLMs can function as "super editors" to refine and optimize the language and structure of a
PRD, leading to clearer communication and better alignment.

LLMs can simulate different perspectives to provide a multi-faceted review, which acts as a
valuable testing method before a human team review:

# Human in the Loop

\`\`\`
acceptance criteria).
To this end, we will store our original notes in the repo under the DraftPRD.md file.
We will then use the LLM to review, expand, suggest alternatives for the Draft PRD. This
will be used to generate or update the PRD.md file.
Creating User Stories and Acceptance Criteria: LLMs can break down high-level
features into detailed user stories and suggest corresponding acceptance criteria,
ensuring thoroughness and clarity for the development team.
We will use this functionality to initialize the UserStories.md and
AcceptanceCriteria.md files.
Ensuring Consistency: LLMs can enforce consistent terminology, tone, and formatting
across all documents by adhering to project-wide style guides, making PRDs easier to
read and follow. To this end, it helps to create a specific repository with the project
specific terminology which we wil call glossary.md
\`\`\`
\`\`\`
Simplifying Technical Jargon: LLMs can rephrase complex technical details into more
straightforward language, making the document accessible to non-technical
collaborators (e.g., marketing, sales, or executives).
Summarization: They can generate concise summaries of long PRDs or specific
sections for different audiences (e.g., an executive summary), ensuring efficient
communication of key points.
Identifying Gaps and Inconsistencies: LLMs can scan a PRD for missing information,
logical inconsistencies, or conflicting requirements, prompting the product manager to
address these potential issues before development begins.
Suggesting Success Metrics: LLMs can propose relevant Key Performance Indicators
(KPIs) based on the stated objectives and industry benchmarks, helping to define clear,
measurable goals for the new product or feature.
\`\`\`
\`\`\`
Role-Playing Persona: A PM can prompt the LLM to "Review this PRD from an
engineering perspective and flag any technical concerns," or "What questions would a
UX designer ask about this feature?". Other persona can be the technical support team,
the marketing team, etc.
Brainstorming Edge Cases: LLMs can help identify potential edge cases or error
scenarios that human teams might miss during the initial planning phase, enhancing the
robustness of the requirements.
\`\`\`

While LLMs offer benefits, especially for beginner product managers, human oversight
remains crucial. Product managers must use LLMs as assistants, not replacements for
critical thinking, user research, or final decision-making. LLMs may "mask unknowns" with
generic content or produce overly rigid and detailed documents. This must be actively
detected and pruned away.
`;
