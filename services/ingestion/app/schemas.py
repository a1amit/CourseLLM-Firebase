from pydantic import BaseModel, Field
from typing import List, Optional


class ChunkRequest(BaseModel):
    """Request model for chunking markdown text."""
    markdown: str = Field(..., description="Markdown text to chunk")
    max_chunk_size: Optional[int] = Field(768, description="Maximum chunk size in tokens")
    strategy: Optional[str] = Field("semantic", description="Chunking strategy: recursive, semantic, or token")
    tokenizer: Optional[str] = Field("gpt2", description="Tokenizer to use")
    generate_embeddings: Optional[bool] = Field(False, description="Generate embeddings for chunks")
    embedding_provider: Optional[str] = Field("sentence-transformers", description="Embedding provider: sentence-transformers or vertex-ai")
    embedding_model: Optional[str] = Field(None, description="Embedding model to use (provider-specific)")
    extract_topics: Optional[bool] = Field(True, description="Extract topic tags from chunks")
    rank_content: Optional[bool] = Field(True, description="Rank chunks by relevance")
    document_title: Optional[str] = Field(None, description="Document title for ranking context")




class ChunkItem(BaseModel):
    """Individual chunk in the response."""
    index: int = Field(..., description="Chunk index")
    content: str = Field(..., description="Chunk text content")
    token_count: int = Field(..., description="Number of tokens in this chunk")
    start_index: Optional[int] = Field(None, description="Start character index in original text")
    end_index: Optional[int] = Field(None, description="End character index in original text")
    embedding: Optional[list] = Field(None, description="Vector embedding of the chunk")
    embedding_dim: Optional[int] = Field(None, description="Dimension of the embedding vector")
    topics: List[str] = Field(default_factory=list, description="Topic tags extracted from chunk")
    rank: float = Field(default=0.0, description="Relevance rank (0-100)")
    metadata: Optional[dict] = Field(default_factory=dict, description="Additional metadata")



class ChunkResponse(BaseModel):
    """Response model containing list of chunks."""
    chunks: List[ChunkItem]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str


class TopicSearchRequest(BaseModel):
    """Request model for searching chunks by topics."""
    topics: List[str] = Field(..., description="Topics to search for")
    min_rank: Optional[float] = Field(0.0, description="Minimum rank threshold")
    limit: Optional[int] = Field(10, description="Maximum number of results")


class TopicSearchResponse(BaseModel):
    """Response model for topic search results."""
    chunks: List[ChunkItem]
    total_results: int
