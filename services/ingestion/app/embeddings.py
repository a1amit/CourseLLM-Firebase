from __future__ import annotations

import hashlib
import os
from dataclasses import dataclass
from typing import Protocol

import requests


class Embedder(Protocol):
    def embed_texts(self, texts: list[str]) -> list[list[float]]: ...


class MissingEmbeddingAPIKeyError(RuntimeError):
    """Raised when an embeddings provider requires an API key but none is configured."""


@dataclass(frozen=True)
class MockEmbedder:
    dim: int = 64

    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        # Deterministic, cheap embeddings for local/dev.
        # Not semantically meaningful; only for plumbing/UI testing.
        out: list[list[float]] = []
        for t in texts:
            h = hashlib.blake2b(t.encode("utf-8"), digest_size=32).digest()
            # Expand bytes deterministically to requested dim.
            vec: list[float] = []
            i = 0
            while len(vec) < self.dim:
                b = h[i % len(h)]
                # Map 0..255 -> -1..1
                vec.append((b / 127.5) - 1.0)
                i += 1
            out.append(vec)
        return out


@dataclass(frozen=True)
class OpenAICompatibleEmbedder:
    base_url: str
    api_key: str
    model: str
    timeout_s: float = 30.0

    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        url = self.base_url.rstrip("/") + "/embeddings"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {"model": self.model, "input": texts}

        resp = requests.post(url, json=payload, headers=headers, timeout=self.timeout_s)
        resp.raise_for_status()
        data = resp.json()

        # OpenAI-style response: { data: [ { embedding: [...] }, ... ] }
        items = data.get("data")
        if not isinstance(items, list):
            raise RuntimeError("Unexpected embeddings response format")

        embeddings: list[list[float]] = []
        for item in items:
            emb = item.get("embedding") if isinstance(item, dict) else None
            if not isinstance(emb, list):
                raise RuntimeError("Unexpected embedding item format")
            embeddings.append([float(x) for x in emb])

        return embeddings


def get_embedder(*, provider: str | None = None, model: str | None = None) -> Embedder:
    provider = (provider or os.getenv("EMBEDDING_PROVIDER", "mock")).strip().lower()

    if provider == "mock":
        dim = int(os.getenv("EMBEDDING_DIM", "64"))
        return MockEmbedder(dim=dim)

    if provider in {"openai", "openrouter"}:
        api_key = os.getenv("OPENAI_API_KEY") if provider == "openai" else os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise MissingEmbeddingAPIKeyError(
                "Missing OPENAI_API_KEY" if provider == "openai" else "Missing OPENROUTER_API_KEY"
            )

        base_url = os.getenv("OPENAI_BASE_URL")
        if not base_url:
            base_url = "https://api.openai.com/v1" if provider == "openai" else "https://openrouter.ai/api/v1"

        if model:
            model_name = model
        else:
            model_name = (
                os.getenv("OPENAI_EMBED_MODEL")
                if provider == "openai"
                else os.getenv("OPENROUTER_EMBED_MODEL")
            ) or "qwen/qwen3-embedding-8b"
        return OpenAICompatibleEmbedder(base_url=base_url, api_key=api_key, model=model_name)

    if provider == "vertex":
        # Placeholder: Vertex AI embeddings require GCP auth / SDK and project+location.
        raise RuntimeError("EMBEDDING_PROVIDER=vertex not implemented yet; use mock or openai/openrouter")

    raise RuntimeError(f"Unknown EMBEDDING_PROVIDER={provider}")
