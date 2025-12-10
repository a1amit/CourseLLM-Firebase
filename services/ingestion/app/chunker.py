"""
Chunking module using Chonkie library for semantic/recursive text chunking.
Based on: https://github.com/chonkie-inc/chonkie

This module provides intelligent chunking for markdown documents,
preserving semantic meaning and structure.
"""

from typing import List, Dict, Any, Optional
try:
    from chonkie import Pipeline
    from chonkie.refineries import EmbeddingsRefinery
except ImportError:
    # Fallback/Error if chonkie not installed
    pass


class ChonkieChunker:
    """Wrapper for Chonkie pipeline with support for multiple strategies and refinements."""
    
    def __init__(
        self,
        strategy: str = "recursive",
        chunk_size: int = 512,
        tokenizer: str = "gpt2",
        overlap: int = 0,
        # Embedding config
        generate_embeddings: bool = False,
        embedding_provider: str = None,
        embedding_model: str = None,
        # Semantic tuning
        similarity_threshold: float = None,
        min_sentences_per_chunk: int = None
    ):
        """
        Initialize the chunker pipeline.
        
        Args:
            strategy: Chunking strategy - "recursive", "semantic", or "token"
            chunk_size: Maximum chunk size in tokens
            tokenizer: Tokenizer to use (default: "gpt2")
            overlap: Number of tokens to overlap between chunks
            generate_embeddings: Whether to add embedding refinement
            embedding_provider: "sentence-transformers" (supported native) or "vertex-ai" (manual)
            embedding_model: Model name
            similarity_threshold: Threshold for semantic similarity (0-1)
            min_sentences_per_chunk: Minimum sentences per chunk
        """
        self.strategy = strategy
        self.chunk_size = chunk_size
        self.tokenizer = tokenizer
        self.overlap = overlap
        
        # Initialize pipeline
        self.pipeline = Pipeline()
        
        # 1. Chunking Step
        chunk_kwargs = {"chunk_size": chunk_size}
        
        if strategy == "semantic":
            # SemanticChunker uses embedding_model for similarity
            # It does NOT accept 'tokenizer' in this version (despite online docs)
            if embedding_model:
                chunk_kwargs["embedding_model"] = embedding_model
            
            # Add semantic tuning params if provided
            if similarity_threshold is not None:
                # Chonkie requires threshold < 1.0
                chunk_kwargs["threshold"] = min(similarity_threshold, 0.99)
            
            # Default to 2 sentences to avoid orphaned headers/tiny chunks
            chunk_kwargs["min_sentences_per_chunk"] = min_sentences_per_chunk if min_sentences_per_chunk is not None else 2
            
        elif strategy == "recursive":
            chunk_kwargs["tokenizer"] = tokenizer
            # Use markdown recipe for structure awareness
            chunk_kwargs["recipe"] = "markdown"
            
        else:
            # Token chunker
            chunk_kwargs["tokenizer"] = tokenizer
            
        self.pipeline.chunk_with(
            strategy, 
            **chunk_kwargs
        )
        
        # 2. Overlap Refinement
        if overlap > 0:
            self.pipeline.refine_with(
                "overlap", 
                context_size=overlap,
                tokenizer=tokenizer
            )
            
        # 3. Embedding Refinement (Native)
        # Only if provider is native (sentence-transformers/huggingface)
        # For Vertex AI, we handle it sequentially outside to use our custom client
        self.native_embedding = False
        if generate_embeddings and embedding_provider == "sentence-transformers":
            model = embedding_model or "all-MiniLM-L6-v2"
            try:
                # Try to add native embedding step
                self.pipeline.refine_with("embeddings", embedding_model=model)
                self.native_embedding = True
            except Exception as e:
                print(f"Warning: Could not add native embedding step: {e}")
            
    def chunk(self, text: str) -> List[Dict[str, Any]]:
        """
        Chunk the given text using the configured pipeline.
        
        Args:
            text: The text content to chunk (markdown format supported)
            
        Returns:
            List of chunk dictionaries with content, token_count, and metadata
        """
        # Run the pipeline
        doc = self.pipeline.run(text)
        
        # Convert chunks to our dictionary format
        result = []
        for idx, chunk in enumerate(doc.chunks):
            chunk_dict = {
                "index": idx,
                "content": chunk.text,
                "token_count": chunk.token_count,
                "start_index": getattr(chunk, "start_index", None),
                "end_index": getattr(chunk, "end_index", None),
                "metadata": getattr(chunk, "metadata", {})
            }
            
            # Extract embedding if native pipeline generated it
            if getattr(chunk, "embedding", None) is not None:
                chunk_dict["embedding"] = chunk.embedding
                # If embedding is numpy array/tensor, convert to list
                if hasattr(chunk_dict["embedding"], "tolist"):
                    chunk_dict["embedding"] = chunk_dict["embedding"].tolist()
                chunk_dict["embedding_dim"] = len(chunk_dict["embedding"])
            
            result.append(chunk_dict)
        
        return result


def chunk_markdown(
    markdown: str,
    strategy: str = "semantic",
    max_chunk_size: int = 768,
    tokenizer: str = "gpt2",
    # Forward new params
    overlap: int = 0,
    generate_embeddings: bool = False,
    embedding_provider: str = None,
    embedding_model: str = None,
    similarity_threshold: float = None,
    min_sentences_per_chunk: int = None
) -> List[Dict[str, Any]]:
    """
    Chunk markdown text using Chonkie Pipeline.
    """
    chunker = ChonkieChunker(
        strategy=strategy,
        chunk_size=max_chunk_size,
        tokenizer=tokenizer,
        overlap=overlap,
        generate_embeddings=generate_embeddings,
        embedding_provider=embedding_provider,
        embedding_model=embedding_model,
        similarity_threshold=similarity_threshold,
        min_sentences_per_chunk=min_sentences_per_chunk
    )
    
    return chunker.chunk(markdown)
