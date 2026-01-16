# Ingestion Service Specification

## Overview
The Ingestion Service is a standalone microservice within the CourseLLM platform responsible for transforming raw educational content into structured, AI-ready data. It serves as the primary processing engine for the "Course Material Service" capability, enabling RAG (Retrieval-Augmented Generation) workflows, semantic search, and topic-based organization.

## Capabilities

### 1. Content Chunking
**Description**: Deconstructs large documents into smaller, semantically coherent segments.
- **Requirement**: Must support Markdown syntax, preserving document structure (headers, lists, code blocks).
- **Requirement**: Must support configurable chunk sizes and overlap to optimize for different LLM context windows.
- **Requirement**: Must include metadata for each chunk, such as its section path (hierarchy of headers) to preserve context.

### 2. Intelligent Preprocessing
**Description**: Cleans and normalizes raw text input before processing.
- **Requirement**: Provide optional LLM-based preprocessing to convert raw unstructured text (e.g., OCR output, messy copy-paste) into clean, valid Markdown.
- **Requirement**: Handle large inputs gracefully, with appropriate fallbacks or warnings if input exceeds limits.

### 3. Semantic Enrichment
**Description**: Adds AI-derived metadata to chunks to facilitate search and discovery.
- **Requirement (Embeddings)**: Generate vector embeddings for every chunk using state-of-the-art models (e.g., Vertex AI, OpenRouter/Gemma).
- **Requirement (Topics)**: Extract key topics and keywords from chunks to support faceted search and filtering in the Student/Teacher dashboards.

### 4. Semantic Search (Development)
**Description**: Provides a search over the possible chunks in memory.
- **Requirement**: Allow developers to execute "search by meaning" against the most recently processed document batch to tune parameters.

### 5. Observability
**Description**: Exposes service health and system resource metrics for monitoring.
- **Requirement**: Provide a `/health` endpoint returning service status and version.
- **Requirement**: Provide a `/metrics` endpoint returning CPU, memory, and disk usage for container monitoring.

## Integration Ecosystem

### Relationship to CourseLLM Components
The Ingestion Service operates within a larger ecosystem of specialized services:

| Component | Responsibility | Interaction with Ingestion |
|-----------|----------------|----------------------------|
| **Course Material Service** | Management of raw files (PDF/PPT) | **Primary Caller**. Converts files to Markdown and invokes Ingestion to process them. |
| **Search Content (LLMRnD)** | Indexing and Retrieval | **Consumer**. Uses the embeddings and chunks we generate to provide semantic search capabilities to the chatbot. |
| **LLM Chatbot** | Student Interaction | **Beneficiary**. RAG responses depend entirely on the quality of chunking provided by Ingestion. |
| **Memory (Infernobles)** | Persistent User Context | **Parallel**. While Ingestion handles *static content* (documents), Memory handles *dynamic context* (chat history). Both sources are merged to generate Tutor responses. |

## Integration Contracts

### Input Contract
The service expects JSON payloads containing:
- `text`: The raw string content (Markdown expected).
- `config`: Processing flags (topics, embeddings, preprocessing) and parameters (model names, chunk sizes).

### Output Contract
The service returns a structural representation of the document:
- A list of `Chunk` objects, each containing:
  - `text`: The content of the chunk.
  - `embedding`: Vector data (list of floats).
  - `topics`: List of string tags.
  - `metadata`: Structural context (e.g., section headers).

## Scenarios

#### Scenario: Teacher Uploads Lecture Notes
**Given** a teacher uploads a "Week 1 - Intro to Algorithms" document
**When** the frontend sends the text to the Ingestion Service
**Then** the service cleans the formatting using the Preprocessor
**And** splits the text into 500-token chunks with 50-token overlap
**And** generates 768-dimensional embeddings for each chunk
**And** extracts tags like "Big O Notation", "Sorting", "Complexity"
**And** returns the enriched chunks to be saved in Firestore

#### Scenario: Student Asks a Question
*(Note: Indirect usage via Vector Search, but facilitated by this service)*
**Given** a student queries "How does binary search work?"
**And** the vector store was populated using the Ingestion Service
**When** the query is embedded and matched against stored chunks
**Then** the system retrieves the specific paragraphs explaining Binary Search defined during the ingestion phase.
