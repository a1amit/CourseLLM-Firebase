from __future__ import annotations

import re


def _norm(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"\s+", " ", s)
    return s


def score_topic_match(*, chunk_topics: list[str] | None, query_topics: list[str]) -> float:
    """Deterministic topic relevance score in range [0, 100].

    Heuristic goals:
    - Prefer chunks matching more query topics
    - Prefer exact matches over partial matches
    - Provide a stable score even when topics are sparse
    """

    if not query_topics:
        return 0.0

    q = [_norm(t) for t in query_topics if t and t.strip()]
    if not q:
        return 0.0

    ct = [_norm(t) for t in (chunk_topics or []) if t and t.strip()]
    if not ct:
        return 0.0

    q_set = set(q)
    ct_set = set(ct)

    exact = len(q_set & ct_set)

    partial = 0
    if exact < len(q_set):
        # Partial match: substring containment (both directions) for remaining query terms.
        for qt in q_set - ct_set:
            for ctt in ct_set:
                if qt in ctt or ctt in qt:
                    partial += 1
                    break

    # Base score: weighted match coverage.
    coverage = exact / max(1, len(q_set))
    score = coverage * 70.0

    # Bonus for additional matches.
    score += min(exact * 10.0, 25.0)
    score += min(partial * 4.0, 10.0)

    # Small bonus when the chunk has focused topic list (less noisy)
    score += max(0.0, 5.0 - max(0, len(ct_set) - 8) * 0.5)

    # Clamp.
    if score < 0.0:
        return 0.0
    if score > 100.0:
        return 100.0
    return float(round(score, 2))


def matches_query(*, chunk_topics: list[str] | None, query_topics: list[str], match: str = "any") -> bool:
    """Return whether chunk topics match the query topics under a mode."""

    q = {_norm(t) for t in query_topics if t and t.strip()}
    if not q:
        return False

    ct = {_norm(t) for t in (chunk_topics or []) if t and t.strip()}
    if not ct:
        return False

    mode = (match or "any").strip().lower()
    if mode == "all":
        return q.issubset(ct)

    # default: any
    if q & ct:
        return True

    # allow partial match as a weaker fallback for "any"
    for qt in q:
        for ctt in ct:
            if qt in ctt or ctt in qt:
                return True

    return False
