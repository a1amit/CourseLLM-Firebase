import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psutil

from .models import (
    ChunkRequest,
    ChunkResponse,
    ChunkOut,
    SemanticSearchRequest,
    SemanticSearchResponse,
)
from .settings import get_settings
from .chunking import chunk_markdown
from .embeddings import MissingEmbeddingAPIKeyError, get_embedder
from .preprocess import MissingPreprocessAPIKeyError, get_preprocessor
from .topic_extraction import extract_topics
from .ranking import cosine_similarity


settings = get_settings()

app = FastAPI(title="CourseWise Ingestion", version="0.1.0")


# Dev-only in-memory store backing /search/topics.
# This is intentionally ephemeral and resets on process restart.
_LAST_CHUNKS: list[dict] = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=False,  # Must be False when using wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True, "service": "ingestion", "version": app.version}


@app.get("/metrics")
def metrics():
    """Return system metrics: CPU, memory, and disk usage."""
    # CPU usage (percent over last interval)
    cpu_percent = psutil.cpu_percent(interval=0.1)
    
    # Memory usage
    memory = psutil.virtual_memory()
    memory_used_mb = round(memory.used / (1024 * 1024), 1)
    memory_total_mb = round(memory.total / (1024 * 1024), 1)
    memory_percent = memory.percent
    
    # Disk usage (root partition)
    disk = psutil.disk_usage("/")
    disk_used_gb = round(disk.used / (1024 * 1024 * 1024), 1)
    disk_total_gb = round(disk.total / (1024 * 1024 * 1024), 1)
    disk_percent = disk.percent
    
    return {
        "cpu": {
            "percent": cpu_percent,
        },
        "memory": {
            "used_mb": memory_used_mb,
            "total_mb": memory_total_mb,
            "percent": memory_percent,
        },
        "disk": {
            "used_gb": disk_used_gb,
            "total_gb": disk_total_gb,
            "percent": disk_percent,
        },
    }




@app.post("/chunk", response_model=ChunkResponse)
def chunk(req: ChunkRequest):
    if not req.text or not req.text.strip():
        raise HTTPException(status_code=400, detail="text is required")

    if len(req.text) > settings.max_input_chars:
        raise HTTPException(
            status_code=413,
            detail=f"text too large (max {settings.max_input_chars} chars)",
        )

    warnings: list[str] = []

    # Optional LLM preprocessing: normalize to clean Markdown before deterministic chunking.
    preprocess_enabled = bool(req.include_preprocessing) or (
        os.getenv("PREPROCESS_ENABLED", "").strip().lower() in {"1", "true", "yes", "on"}
    )

    text_for_chunking = req.text
    if preprocess_enabled:
        max_chars = int(os.getenv("PREPROCESS_MAX_INPUT_CHARS", "40000"))
        if len(text_for_chunking) > max_chars:
            warnings.append(
                f"Preprocessing skipped because input is too large ({len(text_for_chunking)} > {max_chars} chars)."
            )
        else:
            try:
                pre = get_preprocessor(model=req.preprocess_model)
                text_for_chunking = pre.preprocess_to_markdown(text_for_chunking)
            except MissingPreprocessAPIKeyError:
                warnings.append(
                    "Preprocessing requested but OPENROUTER_API_KEY is not set; proceeding with original input."
                )
            except Exception as e:
                warnings.append(f"Preprocessing failed; proceeding with original input. ({type(e).__name__})")

    chunk_size = req.chunk_size or settings.default_chunk_size
    overlap_size = req.overlap_size if req.overlap_size is not None else settings.default_overlap_size

    chunks_raw = chunk_markdown(
        text_for_chunking,
        chunk_size=chunk_size,
        overlap_size=overlap_size,
        tokenizer=settings.tokenizer,
        include_section_path=req.include_section_path,
    )

    if req.include_topics:
        max_topics = req.max_topics if req.max_topics is not None else int(os.getenv("TOPIC_MAX_TOPICS", "10"))

        for c in chunks_raw:
            r = extract_topics(c["text"], max_topics=max_topics)
            c["topics"] = r.topics
            c["topic_source"] = r.source

    if req.include_embeddings:
        if len(chunks_raw) > settings.max_embed_chunks:
            raise HTTPException(
                status_code=413,
                detail=f"too many chunks to embed ({len(chunks_raw)} > {settings.max_embed_chunks}); increase MAX_EMBED_CHUNKS or reduce chunk size",
            )

        try:
            embedder = get_embedder(provider=req.embedding_provider, model=req.embedding_model)
            vectors = embedder.embed_texts([c["text"] for c in chunks_raw])
        except MissingEmbeddingAPIKeyError as e:
            raise HTTPException(status_code=401, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"embedding failed: {e}")

        for c, v in zip(chunks_raw, vectors):
            c["embedding"] = v

        # Save embedder settings for semantic search
        global _LAST_EMBEDDER_PROVIDER, _LAST_EMBEDDER_MODEL
        _LAST_EMBEDDER_PROVIDER = req.embedding_provider
        _LAST_EMBEDDER_MODEL = req.embedding_model

    # Store most-recent results for dev search.
    global _LAST_CHUNKS
    _LAST_CHUNKS = chunks_raw

    chunks = [ChunkOut(**c) for c in chunks_raw]

    return ChunkResponse(chunk_count=len(chunks), chunks=chunks, warnings=warnings or None)


# Track last embedder settings to reuse for query embedding
_LAST_EMBEDDER_PROVIDER: str | None = None
_LAST_EMBEDDER_MODEL: str | None = None


@app.post("/search/semantic", response_model=SemanticSearchResponse)
def search_semantic(req: SemanticSearchRequest):
    """Search chunks by semantic similarity using embeddings.

    Requires that POST /chunk was called with include_embeddings=true.
    Embeds the query using the same embedder settings and returns chunks
    ranked by cosine similarity.
    """
    if not _LAST_CHUNKS:
        raise HTTPException(
            status_code=400,
            detail="No chunks available. Call POST /chunk first (with include_embeddings=true).",
        )

    # Check if any chunks have embeddings
    chunks_with_embeddings = [c for c in _LAST_CHUNKS if c.get("embedding")]
    if not chunks_with_embeddings:
        raise HTTPException(
            status_code=400,
            detail="No embeddings found in stored chunks. Call POST /chunk with include_embeddings=true.",
        )

    # Embed the query using cached embedder settings
    try:
        embedder = get_embedder(provider=_LAST_EMBEDDER_PROVIDER, model=_LAST_EMBEDDER_MODEL)
        query_embedding = embedder.embed_texts([req.query])[0]
    except MissingEmbeddingAPIKeyError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to embed query: {e}")

    # Compute similarity for each chunk
    results: list[dict] = []
    for c in chunks_with_embeddings:
        chunk_emb = c.get("embedding")
        if not chunk_emb:
            continue

        similarity = cosine_similarity(query_embedding, chunk_emb)
        c_out = dict(c)
        c_out["rank"] = round(similarity * 100, 2)  # Scale to 0-100 for consistency with topic search
        results.append(c_out)

    # Sort by similarity descending
    results.sort(key=lambda x: (-(x.get("rank") or 0.0), x.get("index") or 0))

    # Apply min_similarity filter
    if req.min_similarity is not None:
        min_rank = req.min_similarity * 100  # Convert to 0-100 scale
        results = [c for c in results if (c.get("rank") or 0.0) >= min_rank]

    total = len(results)
    limited = results[: req.limit]

    # Get embedding dimension for response metadata
    embedding_dim = len(query_embedding) if query_embedding else None

    chunks = [ChunkOut(**c) for c in limited]
    return SemanticSearchResponse(total_results=total, chunks=chunks, embedding_dim=embedding_dim)
