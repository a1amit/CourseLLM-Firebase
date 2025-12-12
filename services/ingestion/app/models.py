from pydantic import BaseModel, Field


class ChunkRequest(BaseModel):
    text: str = Field(..., description="Markdown text to chunk")
    chunk_size: int | None = Field(None, ge=50, le=4000)
    overlap_size: int | None = Field(None, ge=0, le=1000)
    include_section_path: bool = True
    include_embeddings: bool = False
    include_topics: bool = False
    include_ranking: bool = False

    # Topics
    topic_model: str | None = Field(
        None,
        description="Optional per-request topic model (e.g. gemini-2.5-flash-lite). If omitted, server default applies.",
    )
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


class TopicSearchRequest(BaseModel):
    topics: list[str] = Field(..., description="Topics to search for")
    match: str = Field(
        "any",
        description="Match mode: 'any' (default) returns chunks matching at least one topic; 'all' requires all topics.",
    )
    limit: int = Field(25, ge=1, le=200)
    min_rank: float | None = Field(None, ge=0.0, le=100.0)


class TopicSearchResponse(BaseModel):
    total_results: int
    chunks: list[ChunkOut]
