import { defineEmbedder, embed } from 'genkit/ai';
import { googleAI } from '@genkit-ai/google-genai';
import { chromaDB } from 'genkitx-chromadb';
import { Document } from 'genkit/doc';

// Define the text embedder using Google's model
export const textEmbedder = defineEmbedder({
  name: 'googleai/text-embedding-004',
  config: {},
}, async (input) => {
  const result = await embed({ 
    embedder: googleAI('text-embedding-004'), 
    content: input 
  });
  return {
    embedding: result.embedding,
  };
});


// Configure ChromaDB for local vector storage
export const localVectorStore = chromaDB({
    collection: 'course-materials',
    embedder: textEmbedder,
});

/**
 * Indexes a set of documents by creating embeddings and storing them in the local vector store.
 * @param documents An array of documents to index.
 */
export async function indexDocuments(documents: Document<any>[]) {
    console.log(`Indexing ${documents.length} documents...`);
    await localVectorStore.add(documents);
    console.log('Documents indexed successfully.');
}

/**
 * Performs a similarity search on the indexed documents.
 * @param query The query text to search for.
 * @param k The number of results to return.
 * @returns An array of documents that are most similar to the query.
 */
export async function searchDocuments(query: string, k: number = 5) {
    console.log(`Searching for documents similar to: "${query}"`);
    const results = await localVectorStore.retrieve({ query, k });
    console.log(`Found ${results.length} similar documents.`);
    return results;
}
