# The Architecture of a RAG System

A RAG system operates through two primary, distinct phases:

1.  **Indexing (Offline):** This phase involves preparing the external knowledge base for efficient retrieval.
2.  **Retrieval & Generation (Online):** This phase occurs when a user query is received and involves fetching relevant information to augment the LLM's response.

## Core Principle

At its heart, a RAG system functions on a simple yet powerful principle:

A specialized **retriever** component is responsible for selecting the most relevant documents or passages from a vast knowledge base. These retrieved pieces of information are then provided to a **generator** (which is typically a Large Language Model) that uses them as context to produce a grounded, informed, and accurate answer to the user's query.