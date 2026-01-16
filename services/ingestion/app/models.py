from pydantic import BaseModel, Field


class ChunkRequest(BaseModel):
    text: str = Field(..., description="Markdown text to chunk")
    chunk_size: int | None = Field(None, ge=50, le=4000)
    overlap_size: int | None = Field(None, ge=0, le=1000)
    include_section_path: bool = True
    include_preprocessing: bool = False
    include_embeddings: bool = False
    include_topics: bool = False

    # Preprocessing
    preprocess_model: str | None = Field(
        None,
        description="Optional per-request preprocessing model override (default: amazon/nova-2-lite-v1:free).",
    )

    # Topics
    max_topics: int | None = Field(
        None,
        ge=1,
        le=32,
        description="Optional per-request cap for number of topics per chunk.",
    )
    embedding_provider: str | None = Field(
        None,
        description="Optional per-request embedding provider override (e.g. sentence-transformers, openai, openrouter, mock)",
    )
    embedding_model: str | None = Field(
        None,
        description="Optional per-request embedding model override (provider-specific)",
    )


class ChunkOut(BaseModel):
    index: int
    text: str
    token_count: int | None = None
    section_index: int | None = None
    section_path: str | None = None
    embedding: list[float] | None = None
    topics: list[str] | None = None
    topic_source: str | None = None
    rank: float | None = None


class ChunkResponse(BaseModel):
    chunk_count: int
    chunks: list[ChunkOut]
    warnings: list[str] | None = None


class SemanticSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Natural language query to search for")
    limit: int = Field(25, ge=1, le=200)
    min_similarity: float | None = Field(None, ge=0.0, le=1.0, description="Minimum cosine similarity threshold (0-1)")


class SemanticSearchResponse(BaseModel):
    total_results: int
    chunks: list[ChunkOut]
    embedding_dim: int | None = None
