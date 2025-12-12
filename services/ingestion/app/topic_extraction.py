from __future__ import annotations

import os
import re
import logging
from dataclasses import dataclass


_WORD_RE = re.compile(r"[a-zA-Z][a-zA-Z0-9_-]{2,}")

_STOPWORDS = {
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "because",
    "been",
    "but",
    "by",
    "can",
    "could",
    "did",
    "do",
    "does",
    "for",
    "from",
    "had",
    "has",
    "have",
    "how",
    "i",
    "if",
    "in",
    "into",
    "is",
    "it",
    "its",
    "may",
    "might",
    "more",
    "most",
    "must",
    "not",
    "of",
    "on",
    "or",
    "our",
    "should",
    "so",
    "such",
    "than",
    "that",
    "the",
    "their",
    "then",
    "there",
    "these",
    "this",
    "those",
    "to",
    "use",
    "used",
    "using",
    "was",
    "we",
    "were",
    "what",
    "when",
    "which",
    "will",
    "with",
    "without",
    "you",
    "your",
}


def _normalize_topic(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"\s+", " ", s)
    s = s.strip("-–—•:;,. ")
    return s


def heuristic_extract_topics(text: str, *, max_topics: int = 10) -> list[str]:
    """Deterministic keyword-ish topic extraction.

    Not semantically perfect, but good enough for dev and ensures we always
    return something when LLM keys/deps are missing.
    """

    # Prefer headings as topics when present.
    headings: list[str] = []
    for line in text.splitlines():
        m = re.match(r"^\s*#{1,6}\s+(.*)$", line)
        if m:
            h = _normalize_topic(m.group(1))
            if h and h not in headings:
                headings.append(h)

    # Token-based scoring (simple frequency with slight boost for earlier occurrences).
    scores: dict[str, float] = {}
    words = [w.lower() for w in _WORD_RE.findall(text)]
    for i, w in enumerate(words):
        if w in _STOPWORDS:
            continue
        if w.isdigit():
            continue
        # De-emphasize long ids/paths
        if len(w) > 40:
            continue
        scores[w] = scores.get(w, 0.0) + (1.0 / (1.0 + (i / 50.0)))

    ranked = sorted(scores.items(), key=lambda kv: (-kv[1], kv[0]))
    topics: list[str] = []

    for h in headings:
        topics.append(h)
        if len(topics) >= max_topics:
            return topics

    for w, _ in ranked:
        t = _normalize_topic(w)
        if not t or t in _STOPWORDS:
            continue
        if t in topics:
            continue
        topics.append(t)
        if len(topics) >= max_topics:
            break

    return topics


@dataclass(frozen=True)
class TopicExtractionResult:
    topics: list[str]
    source: str
    error: str | None = None


def extract_topics(text: str, *, model: str | None = None, max_topics: int = 10) -> TopicExtractionResult:
    """Extract topics using Gemini when available; otherwise fall back to heuristic.

    - If GOOGLE_API_KEY is missing -> heuristic with source "heuristic:no_key".
    - If google-genai is not installed -> heuristic with source "heuristic:no_dependency".
    - If Gemini call fails -> heuristic with source "heuristic:error".
    """

    api_key = (os.getenv("GOOGLE_API_KEY") or os.getenv("GOOGLE_GENAI_API_KEY") or "").strip()
    if not api_key:
        return TopicExtractionResult(
            topics=heuristic_extract_topics(text, max_topics=max_topics),
            source="heuristic:no_key",
        )

    try:
        from google import genai
    except Exception:
        return TopicExtractionResult(
            topics=heuristic_extract_topics(text, max_topics=max_topics),
            source="heuristic:no_dependency",
        )

    model_name = (model or os.getenv("TOPIC_MODEL") or "gemini-2.5-flash-lite").strip()

    prompt = (
        "You are helping tag educational/product documents with concise topics.\n"
        "Return a short list of topics as a comma-separated list.\n"
        "Rules:\n"
        f"- Return at most {max_topics} items\n"
        "- Each topic should be 1-4 words\n"
        "- Use lowercase\n"
        "- No numbering, no extra text\n\n"
        "Text:\n"
        f"{text[:4000]}\n\n"
        "Topics:"
    )

    try:
        client = genai.Client(api_key=api_key)
        resp = client.models.generate_content(model=model_name, contents=prompt)
        raw = (getattr(resp, "text", None) or "").strip()

        # Split comma/line-separated output.
        parts = re.split(r"[,\n]", raw)
        topics: list[str] = []
        for p in parts:
            t = _normalize_topic(p)
            if not t:
                continue
            if t in topics:
                continue
            topics.append(t)
            if len(topics) >= max_topics:
                break

        if not topics:
            return TopicExtractionResult(
                topics=heuristic_extract_topics(text, max_topics=max_topics),
                source="heuristic:empty_llm",
            )

        return TopicExtractionResult(topics=topics, source="gemini")
    except Exception as e:
        logger = logging.getLogger(__name__)
        # Logs go to container stdout/stderr so `docker compose logs` will show details.
        logger.exception("Gemini topic extraction failed; falling back to heuristic")

        detail = f"{type(e).__name__}: {e}".strip()
        if len(detail) > 500:
            detail = detail[:500] + "…"

        return TopicExtractionResult(
            topics=heuristic_extract_topics(text, max_topics=max_topics),
            source="heuristic:error",
            error=detail or type(e).__name__,
        )
