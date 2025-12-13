from __future__ import annotations

import os
from dataclasses import dataclass

import requests


_SYSTEM_PROMPT = """### SYSTEM / INSTRUCTION PROMPT

You are a preprocessing component in a Retrieval-Augmented Generation (RAG) pipeline.

Your task is to take an input text (which may be plain text, markdown, lecture notes, slides, or mixed formatting)
and convert it into a **clean, well-structured Markdown (MD) document** that preserves **all original information**
while improving **semantic clarity and structural coherence**.

This output will be forwarded to a deterministic chunking library.
Therefore, you MUST NOT perform chunking yourself.

---

### OBJECTIVES

1. Preserve **100% of the original informational content**
   - Do NOT omit facts, examples, explanations, or nuances
   - Do NOT summarize or compress ideas

2. Improve **semantic structure**
   - Use Markdown headers (`#`, `##`, `###`) to reflect topic hierarchy
   - Group closely related ideas under the same section
   - Split clearly distinct topics into separate sections

3. Normalize formatting
   - Convert informal formatting into valid Markdown
   - Preserve lists, tables, quotes, and emphasis when present
   - Remove noise such as duplicated titles, slide markers, page numbers, or irrelevant separators

4. Prepare for downstream chunking
   - Do NOT introduce chunk boundaries
   - Do NOT label or number chunks
   - Do NOT insert delimiters like `---` unless they represent real semantic section breaks
   - Avoid extremely short sections when possible (merge if semantically appropriate)

---

### STRICT OUTPUT RULES

- Output **ONLY valid Markdown**
- Do NOT output JSON
- Do NOT include explanations, comments, or meta-text
- Do NOT add new content
- Do NOT remove content
- Do NOT mention chunking or the pipeline
- Do NOT include code fences unless they are part of the original content

---

### ONE-SHOT EXAMPLE

#### INPUT
Game theory intro
game theory studies strategic interaction
examples: firms competing, countries negotiating

players = decision makers
strategies = plans
payoffs = outcomes

nash equilibrium: no one wants to deviate

#### OUTPUT
# Introduction to Game Theory

## What Is Game Theory?
Game theory is the study of **strategic interaction** between decision-makers, where outcomes depend on the choices of all participants.

Examples include:
- Firms competing with one another
- Countries negotiating agreements

## Core Concepts

### Players
Players are the decision-makers in the game.

### Strategies
Strategies are complete plans of action available to a player.

### Payoffs
Payoffs represent the outcomes resulting from the chosen strategies.

## Nash Equilibrium
A Nash equilibrium is a situation in which no player has an incentive to deviate unilaterally from their chosen strategy.

---

### TASK

Convert the following input into a **clean, semantically structured Markdown document**, following all rules above.

INPUT:
"""


class MissingPreprocessAPIKeyError(RuntimeError):
    """Raised when preprocessing is enabled but no OpenRouter API key is configured."""


@dataclass(frozen=True)
class OpenRouterPreprocessor:
    api_key: str
    model: str
    timeout_s: float = 60.0
    base_url: str = "https://openrouter.ai/api/v1"
    http_referer: str | None = None
    x_title: str | None = None

    def preprocess_to_markdown(self, text: str) -> str:
        url = self.base_url.rstrip("/") + "/chat/completions"

        headers: dict[str, str] = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        if self.http_referer:
            headers["HTTP-Referer"] = self.http_referer
        if self.x_title:
            headers["X-Title"] = self.x_title

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": text},
            ],
            # OpenRouter supports disabling reasoning for reasoning-enabled models.
            # This keeps preprocessing fast/cheap and avoids long reasoning traces.
            "reasoning": {"effort": "none"},
        }

        resp = requests.post(url, json=payload, headers=headers, timeout=self.timeout_s)
        resp.raise_for_status()
        data = resp.json()

        choices = data.get("choices")
        if not isinstance(choices, list) or not choices:
            raise RuntimeError("Unexpected OpenRouter response: missing choices")

        message = choices[0].get("message") if isinstance(choices[0], dict) else None
        content = message.get("content") if isinstance(message, dict) else None
        if not isinstance(content, str) or not content.strip():
            raise RuntimeError("Unexpected OpenRouter response: empty content")

        return content


def get_preprocessor(*, model: str | None = None) -> OpenRouterPreprocessor:
    api_key = (os.getenv("OPENROUTER_API_KEY") or "").strip()
    if not api_key:
        raise MissingPreprocessAPIKeyError("Missing OPENROUTER_API_KEY")

    base_url = (os.getenv("OPENROUTER_BASE_URL") or "https://openrouter.ai/api/v1").strip()
    timeout_s = float(os.getenv("PREPROCESS_TIMEOUT_S", "60"))

    model_name = (model or os.getenv("PREPROCESS_MODEL") or "amazon/nova-2-lite-v1:free").strip()

    http_referer = (os.getenv("OPENROUTER_HTTP_REFERER") or "").strip() or None
    x_title = (os.getenv("OPENROUTER_X_TITLE") or "").strip() or None

    return OpenRouterPreprocessor(
        api_key=api_key,
        model=model_name,
        timeout_s=timeout_s,
        base_url=base_url,
        http_referer=http_referer,
        x_title=x_title,
    )
