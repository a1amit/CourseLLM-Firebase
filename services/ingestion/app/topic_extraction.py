from __future__ import annotations

import re
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


def extract_topics(text: str, *, max_topics: int = 10) -> TopicExtractionResult:
    """Extract topics using deterministic heuristic extraction."""
    return TopicExtractionResult(
        topics=heuristic_extract_topics(text, max_topics=max_topics),
        source="heuristic",
    )
