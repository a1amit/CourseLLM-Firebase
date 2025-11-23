# Key Components of a RAG System

Building a robust RAG system requires several interconnected components, each playing a crucial role in both the indexing and retrieval/generation phases.

| Component            | Indexing Phase                                  | Retrieval & Generation Phase              | Role                                                                        |
| :------------------- | :---------------------------------------------- | :---------------------------------------- | :-------------------------------------------------------------------------- |
| **Knowledge Base (Corpus)** | Source documents (raw text, PDFs, web pages)    | Vector DB / Information Retrieval (IR) system | Stores domain‑specific data as text or vector embeddings.                   |
| **Embedding Model**  | Embeds documents into vector representations      | Embeds the user query into a vector       | Enables semantic similarity search via converting text into vector embeddings. |
| **Retriever**        | N/A (operates on pre-indexed data)              | Performs vector search & optional re-ranking | Finds the top‑k most relevant chunks using methods like cosine similarity or BM25. |
| **Generator (LLM)**  | N/A (operates during inference)                 | Generates the final answer                | Combines the user's query with the retrieved context to form a grounded response. |

## Component Breakdown

### Knowledge Base (Corpus)
This is the collection of all external data that the RAG system can access. It can include various formats like raw text files, PDFs, company wikis, databases, or web pages. During the indexing phase, this data is processed and stored in a way that allows for efficient retrieval, often in a vector database or a specialized IR system.

### Embedding Model
An embedding model is a critical component that converts natural language (text) into numerical vector representations. These vectors capture the semantic meaning of the text. During indexing, it embeds the documents in the knowledge base. During the retrieval phase, it embeds the user's query, allowing for semantic similarity searches to find relevant document chunks.

### Retriever
The retriever's job is to efficiently search the indexed knowledge base and identify the most relevant pieces of information in response to a user's query. It uses the query embedding to perform vector similarity searches (e.g., cosine similarity) or other ranking algorithms (like BM25) to find the top-k most relevant document chunks. Advanced retrievers may also incorporate re-ranking steps to further refine the results.

### Generator (LLM)
The generator is a Large Language Model (LLM) that takes the original user query and the context retrieved by the retriever. Its role is to synthesize this information and produce a coherent, accurate, and grounded answer. The LLM leverages its internal knowledge alongside the external context to avoid hallucination and provide real-time, relevant responses.