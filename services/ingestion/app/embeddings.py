"""
Embedding generation for text chunks.

Uses sentence-transformers for local embedding generation.
Can be extended to use Vertex AI or OpenAI in production.
"""

from typing import List, Union
import numpy as np

try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False


class EmbeddingGenerator:
    """Generate embeddings for text chunks."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize the embedding generator.
        
        Args:
            model_name: HuggingFace model name for embeddings.
                       Default is a lightweight model (384 dimensions).
                       
        Popular models:
        - "all-MiniLM-L6-v2" (384 dims, fast, good for development)
        - "all-mpnet-base-v2" (768 dims, better quality)
        - "multi-qa-mpnet-base-dot-v1" (768 dims, optimized for Q&A)
        """
        if not SENTENCE_TRANSFORMERS_AVAILABLE:
            raise ImportError(
                "sentence-transformers not installed. "
                "Install with: pip install sentence-transformers"
            )
        
        self.model_name = model_name
        self.model = SentenceTransformer(model_name)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()
    
    def generate_embeddings(
        self, 
        texts: Union[str, List[str]],
        batch_size: int = 32,
        show_progress: bool = False
    ) -> np.ndarray:
        """
        Generate embeddings for one or more texts.
        
        Args:
            texts: Single text string or list of text strings
            batch_size: Number of texts to process at once
            show_progress: Show progress bar for large batches
            
        Returns:
            numpy array of shape (n, embedding_dim) where n is number of texts
        """
        # Convert single string to list
        if isinstance(texts, str):
            texts = [texts]
        
        # Generate embeddings
        embeddings = self.model.encode(
            texts,
            batch_size=batch_size,
            show_progress_bar=show_progress,
            convert_to_numpy=True
        )
        
        return embeddings
    
    def generate_chunk_embeddings(self, chunks: List[dict]) -> List[dict]:
        """
        Generate embeddings for a list of chunks.
        
        Args:
            chunks: List of chunk dictionaries with 'content' field
            
        Returns:
            Same chunks with added 'embedding' field
        """
        # Extract content from chunks
        texts = [chunk['content'] for chunk in chunks]
        
        # Generate all embeddings at once (more efficient)
        embeddings = self.generate_embeddings(texts, show_progress=len(texts) > 10)
        
        # Add embeddings to chunks
        for chunk, embedding in zip(chunks, embeddings):
            chunk['embedding'] = embedding.tolist()  # Convert to list for JSON serialization
            chunk['embedding_dim'] = len(embedding)
        
        return chunks


# For Vertex AI
class VertexAIEmbedding:
    """
    Vertex AI embedding generator using google-genai SDK.
    
    Requires:
    - google-genai SDK installed
    - Environment variables set:
      - GOOGLE_CLOUD_PROJECT (your GCP project ID)
      - GOOGLE_CLOUD_LOCATION (e.g., 'global')
      - GOOGLE_GENAI_USE_VERTEXAI=True
    - Or Application Default Credentials configured
    """
    
    def __init__(self, model_name: str = "gemini-embedding-001", output_dimensionality: int = 768):
        """
        Initialize Vertex AI embeddings using google-genai SDK.
        
        Args:
            model_name: Vertex AI embedding model
                       - "gemini-embedding-001" (default: 3072 dims, configurable)
                       - "text-embedding-004" (768 dims)
output_dimensionality: Output embedding dimension (default: 768)
                              - For gemini-embedding-001: can be 256-3072
                              - For text-embedding-004: 768
        """
        try:
            from google import genai
            from google.genai.types import EmbedContentConfig
        except ImportError:
            raise ImportError(
                "google-genai not installed. "
                "Install with: pip install google-genai\n"
                "Also set: export GOOGLE_GENAI_USE_VERTEXAI=True"
            )
        
        self.model_name = model_name
        self.output_dimensionality = output_dimensionality
        self.client = genai.Client()
        self.EmbedContentConfig = EmbedContentConfig
        
        # Store actual embedding dimension
        self.embedding_dim = output_dimensionality
    
    def generate_embeddings(
        self, 
        texts: Union[str, List[str]],
        batch_size: int = 100,  # google-genai supports larger batches
        show_progress: bool = False
    ) -> np.ndarray:
        """
        Generate embeddings using Vertex AI.
        
        Args:
            texts: Single text string or list of text strings
            batch_size: Number of texts to process at once
            show_progress: Show progress for large batches
            
        Returns:
            numpy array of shape (n, output_dimensionality)
        """
        # Convert single string to list
        if isinstance(texts, str):
            texts = [texts]
        
        all_embeddings = []
        
        # Process in batches
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i + batch_size]
            
            response = self.client.models.embed_content(
                model=self.model_name,
                contents=batch,
                config=self.EmbedContentConfig(
                    task_type="RETRIEVAL_DOCUMENT",
                    output_dimensionality=self.output_dimensionality
                )
            )
            
            # Extract embedding values
            for embedding in response.embeddings:
                all_embeddings.append(embedding.values)
            
            if show_progress:
                print(f"Processed {min(i + batch_size, len(texts))}/{len(texts)} texts")
        
        return np.array(all_embeddings)
    
    def generate_chunk_embeddings(self, chunks: List[dict]) -> List[dict]:
        """
        Generate embeddings for a list of chunks.
        
        Args:
            chunks: List of chunk dictionaries with 'content' field
            
        Returns:
            Same chunks with added 'embedding' field
        """
        # Extract content from chunks
        texts = [chunk['content'] for chunk in chunks]
        
        # Generate all embeddings
        embeddings = self.generate_embeddings(texts, show_progress=len(texts) > 10)
        
        # Add embeddings to chunks
        for chunk, embedding in zip(chunks, embeddings):
            chunk['embedding'] = embedding.tolist()
            chunk['embedding_dim'] = len(embedding)
        
        return chunks


def get_embedding_generator(provider: str = "sentence-transformers", model_name: str = None, **kwargs):
    """
    Factory function to get the appropriate embedding generator.
    
    Args:
        provider: "sentence-transformers" or "vertex-ai"
        model_name: Model name (provider-specific)
        **kwargs: Additional provider-specific arguments
        
    Returns:
        EmbeddingGenerator or VertexAIEmbedding instance
    """
    if provider == "sentence-transformers":
        model = model_name or "all-MiniLM-L6-v2"
        return EmbeddingGenerator(model_name=model)
    
    elif provider == "vertex-ai":
        model = model_name or "gemini-embedding-001"
        output_dim = kwargs.get('output_dimensionality', 768)
        return VertexAIEmbedding(
            model_name=model,
            output_dimensionality=output_dim
        )
    
    else:
        raise ValueError(f"Unknown provider: {provider}. Use 'sentence-transformers' or 'vertex-ai'")

