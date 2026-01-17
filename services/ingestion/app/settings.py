from pydantic import BaseModel
import os


class Settings(BaseModel):
    cors_allow_origins: list[str]
    max_input_chars: int
    default_chunk_size: int
    default_overlap_size: int
    tokenizer: str
    max_embed_chunks: int


def get_settings() -> Settings:
    origins_raw = os.getenv(
        "CORS_ALLOW_ORIGINS",
        "*",  # Allow all origins by default for easier dev (Codespaces, etc.)
    )
    origins = [o.strip() for o in origins_raw.split(",") if o.strip()]

    return Settings(
        cors_allow_origins=origins,
        max_input_chars=int(os.getenv("MAX_INPUT_CHARS", "400000")),
        default_chunk_size=int(os.getenv("CHUNK_SIZE", "450")),
        default_overlap_size=int(os.getenv("OVERLAP_SIZE", "80")),
        tokenizer=os.getenv("TOKENIZER", "word"),
        max_embed_chunks=int(os.getenv("MAX_EMBED_CHUNKS", "256")),
    )
