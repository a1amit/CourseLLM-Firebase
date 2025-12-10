"""
Chunking module using Chonkie library for semantic/recursive text chunking.
Based on: https://github.com/chonkie-inc/chonkie

This module provides intelligent chunking for markdown documents,
preserving semantic meaning and structure.
"""

from typing import List, Dict, Any, Optional
try:
    from chonkie import RecursiveChunker, SemanticChunker, TokenChunker
except ImportError:
    raise ImportError(
        "chonkie is not installed. Install with: pip install chonkie"
    )


class ChonkieChunker:
    """Wrapper for Chonkie chunkers with support for multiple strategies."""
    
    def __init__(
        self,
        strategy: str = "recursive",
        chunk_size: int = 512,
        tokenizer: str = "gpt2",
        overlap: int = 0
    ):
        """
        Initialize the chunker.
        
        Args:
            strategy: Chunking strategy - "recursive" (default), "semantic", or "token"
            chunk_size: Maximum chunk size in tokens
            tokenizer: Tokenizer to use (default: "gpt2")
            overlap: Number of tokens to overlap between chunks
        """
        self.strategy = strategy
        self.chunk_size = chunk_size
        self.tokenizer = tokenizer
        self.overlap = overlap
        
        # Initialize the chunker based on strategy
        if strategy == "semantic":
            self.chunker = SemanticChunker(
                chunk_size=chunk_size,
                tokenizer=tokenizer
            )
        elif strategy == "token":
            self.chunker = TokenChunker(
                chunk_size=chunk_size,
                tokenizer=tokenizer
            )
        else:  # default to recursive
            self.chunker = RecursiveChunker(
                chunk_size=chunk_size,
                tokenizer=tokenizer
            )
    
    def chunk(self, text: str) -> List[Dict[str, Any]]:
        """
        Chunk the given text using the configured strategy.
        
        Args:
            text: The text content to chunk (markdown format supported)
            
        Returns:
            List of chunk dictionaries with content, token_count, and metadata
        """
        # Use Chonkie to chunk the text
        chunks = self.chunker(text)
        
        # Convert Chonkie chunk objects to our dictionary format
        result = []
        for idx, chunk in enumerate(chunks):
            result.append({
                "index": idx,
                "content": chunk.text,
                "token_count": chunk.token_count,
                "start_index": getattr(chunk, "start_index", None),
                "end_index": getattr(chunk, "end_index", None),
            })
        
        return result


def chunk_markdown(
    markdown: str,
    strategy: str = "semantic",
    max_chunk_size: int = 768,
    tokenizer: str = "gpt2"
) -> List[Dict[str, Any]]:
    """
    Chunk markdown text using Chonkie.
    
    This is the main entry point for chunking operations,
    maintaining backward compatibility with the old interface.
    
    Args:
        markdown: Markdown text to chunk
        strategy: Chunking strategy ("recursive", "semantic", or "token")
        max_chunk_size: Maximum chunk size in tokens
        tokenizer: Tokenizer model name
        
    Returns:
        List of chunk dictionaries
    """
    chunker = ChonkieChunker(
        strategy=strategy,
        chunk_size=max_chunk_size,
        tokenizer=tokenizer
    )
    
    return chunker.chunk(markdown)
