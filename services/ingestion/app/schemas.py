from pydantic import BaseModel, Field
from typing import List, Optional


class ChunkRequest(BaseModel):
    """Request model for chunking markdown text."""
    markdown: str = Field(..., description="Markdown text to chunk")
    max_chunk_size: Optional[int] = Field(512, description="Maximum chunk size in tokens")
    strategy: Optional[str] = Field("recursive", description="Chunking strategy: recursive, semantic, or token")
    tokenizer: Optional[str] = Field("gpt2", description="Tokenizer to use")
    generate_embeddings: Optional[bool] = Field(False, description="Generate embeddings for chunks")
    embedding_provider: Optional[str] = Field("sentence-transformers", description="Embedding provider: sentence-transformers or vertex-ai")
    embedding_model: Optional[str] = Field(None, description="Embedding model to use (provider-specific)")




class ChunkItem(BaseModel):
    """Individual chunk in the response."""
    index: int = Field(..., description="Chunk index")
    content: str = Field(..., description="Chunk text content")
    token_count: int = Field(..., description="Number of tokens in this chunk")
    start_index: Optional[int] = Field(None, description="Start character index in original text")
    end_index: Optional[int] = Field(None, description="End character index in original text")
    embedding: Optional[list] = Field(None, description="Vector embedding of the chunk")
    embedding_dim: Optional[int] = Field(None, description="Dimension of the embedding vector")



class ChunkResponse(BaseModel):
    """Response model containing list of chunks."""
    chunks: List[ChunkItem]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
