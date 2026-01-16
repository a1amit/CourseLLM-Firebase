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
class OpenRouterEmbedder:
    """Embedder using OpenRouter API (for Qwen and other models)."""
    api_key: str
    model: str
    base_url: str = "https://openrouter.ai/api/v1"
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

    if provider == "openrouter":
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise MissingEmbeddingAPIKeyError("Missing OPENROUTER_API_KEY")

        base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
        model_name = model or os.getenv("OPENROUTER_EMBED_MODEL", "qwen/qwen3-embedding-8b")

        return OpenRouterEmbedder(api_key=api_key, model=model_name, base_url=base_url)

    raise RuntimeError(f"Unknown EMBEDDING_PROVIDER={provider}; use 'mock' or 'openrouter'")
