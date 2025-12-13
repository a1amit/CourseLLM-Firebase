import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .models import ChunkRequest, ChunkResponse, ChunkOut, TopicSearchRequest, TopicSearchResponse
from .settings import get_settings
from .chunking import chunk_markdown
from .embeddings import MissingEmbeddingAPIKeyError, get_embedder
from .preprocess import MissingPreprocessAPIKeyError, get_preprocessor
from .topic_extraction import extract_topics
from .ranking import matches_query, score_topic_match


settings = get_settings()

app = FastAPI(title="CourseWise Ingestion", version="0.1.0")


# Dev-only in-memory store backing /search/topics.
# This is intentionally ephemeral and resets on process restart.
_LAST_CHUNKS: list[dict] = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True, "service": "ingestion", "version": app.version}


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
        debug_topics = os.getenv("TOPIC_DEBUG", "").strip().lower() in {"1", "true", "yes", "on"}
        max_topics = req.max_topics if req.max_topics is not None else int(os.getenv("TOPIC_MAX_TOPICS", "10"))
        model = req.topic_model

        error_details: list[str] = []

        for c in chunks_raw:
            r = extract_topics(c["text"], model=model, max_topics=max_topics)
            c["topics"] = r.topics
            c["topic_source"] = r.source
            if debug_topics and getattr(r, "error", None):
                error_details.append(str(r.error))

        # Provide a user-visible indication when we fall back.
        sources = {str(c.get("topic_source") or "") for c in chunks_raw}
        if any(s.startswith("heuristic:forced") for s in sources):
            warnings.append("Topic extraction used the deterministic heuristic extractor (forced by request).")
        elif any(s.startswith("heuristic:no_key") for s in sources):
            warnings.append("Topic extraction fell back to a heuristic extractor because GOOGLE_API_KEY is not set.")
        elif any(s.startswith("heuristic:no_dependency") for s in sources):
            warnings.append("Topic extraction fell back to a heuristic extractor because the Gemini client dependency is not installed.")
        elif any(s.startswith("heuristic:") for s in sources):
            warnings.append("Topic extraction fell back to a heuristic extractor due to a Gemini error.")
            if debug_topics and error_details:
                unique = []
                seen = set()
                for d in error_details:
                    if d not in seen:
                        unique.append(d)
                        seen.add(d)
                    if len(unique) >= 2:
                        break
                warnings.append("Gemini error details: " + " | ".join(unique))

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

    # Store most-recent results for dev search.
    global _LAST_CHUNKS
    _LAST_CHUNKS = chunks_raw

    chunks = [ChunkOut(**c) for c in chunks_raw]

    return ChunkResponse(chunk_count=len(chunks), chunks=chunks, warnings=warnings or None)


@app.post("/search/topics", response_model=TopicSearchResponse)
def search_topics(req: TopicSearchRequest):
    if not _LAST_CHUNKS:
        raise HTTPException(
            status_code=400,
            detail="No chunks available. Call POST /chunk first (with include_topics=true to extract topics).",
        )

    query_topics = [t for t in (req.topics or []) if isinstance(t, str) and t.strip()]
    if not query_topics:
        raise HTTPException(status_code=400, detail="topics is required")

    filtered: list[dict] = []
    for c in _LAST_CHUNKS:
        if matches_query(chunk_topics=c.get("topics"), query_topics=query_topics, match=req.match):
            score = score_topic_match(
                chunk_topics=c.get("topics"),
                query_topics=query_topics,
                chunk_text=c.get("text"),
            )
            c_out = dict(c)
            c_out["rank"] = score
            filtered.append(c_out)

    filtered.sort(key=lambda x: (-(x.get("rank") or 0.0), x.get("index") or 0))

    if req.min_rank is not None:
        filtered = [c for c in filtered if (c.get("rank") or 0.0) >= req.min_rank]

    total = len(filtered)
    limited = filtered[: req.limit]

    chunks = [ChunkOut(**c) for c in limited]
    return TopicSearchResponse(total_results=total, chunks=chunks)
