from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Iterable

from chonkie import Pipeline


@dataclass(frozen=True)
class MarkdownSection:
    index: int
    path: list[str]
    text: str


_HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)\s*$")
_CODE_FENCE_RE = re.compile(r"^\s*(```|~~~)")


def _iter_markdown_sections(markdown: str) -> Iterable[MarkdownSection]:
    lines = markdown.splitlines(keepends=True)

    in_code_block = False
    fence_marker: str | None = None

    current_lines: list[str] = []
    heading_stack: list[tuple[int, str]] = []

    def current_path() -> list[str]:
        return [h for _, h in heading_stack]

    def flush(section_index: int) -> MarkdownSection | None:
        nonlocal current_lines
        text = "".join(current_lines).strip()
        current_lines = []
        if not text:
            return None
        return MarkdownSection(index=section_index, path=current_path(), text=text)

    section_index = 0

    for line in lines:
        fence_match = _CODE_FENCE_RE.match(line)
        if fence_match:
            marker = fence_match.group(1)
            if not in_code_block:
                in_code_block = True
                fence_marker = marker
            else:
                if fence_marker == marker:
                    in_code_block = False
                    fence_marker = None

        if not in_code_block:
            heading_match = _HEADING_RE.match(line)
            if heading_match:
                maybe = flush(section_index)
                if maybe is not None:
                    yield maybe
                    section_index += 1

                level = len(heading_match.group(1))
                title = heading_match.group(2).strip()

                while heading_stack and heading_stack[-1][0] >= level:
                    heading_stack.pop()
                heading_stack.append((level, title))

                current_lines.append(line)
                continue

        current_lines.append(line)

    last = flush(section_index)
    if last is not None:
        yield last


def chunk_markdown(
    markdown: str,
    *,
    chunk_size: int,
    overlap_size: int,
    tokenizer: str = "word",
    include_section_path: bool = True,
) -> list[dict]:
    """Chunk markdown into RAG-friendly chunks.

    Strategy for course material markdown:
    - Split by headings (outside fenced code blocks) to preserve topic structure.
    - Apply Chonkie recursive chunking with recipe='markdown' within each section.
    - Add small overlap to avoid losing context at boundaries.
    """

    pipeline_markdown = (
        Pipeline()
        .chunk_with("recursive", tokenizer=tokenizer, chunk_size=chunk_size, recipe="markdown")
        .refine_with("overlap", context_size=overlap_size)
    )

    pipeline_plain = (
        Pipeline()
        .chunk_with("recursive", tokenizer=tokenizer, chunk_size=chunk_size)
        .refine_with("overlap", context_size=overlap_size)
    )

    out: list[dict] = []
    global_index = 0

    for section in _iter_markdown_sections(markdown):
        try:
            doc = pipeline_markdown.run(texts=section.text)
        except Exception:
            doc = pipeline_plain.run(texts=section.text)

        section_path = " > ".join(section.path) if (include_section_path and section.path) else None

        for chunk in getattr(doc, "chunks", []) or []:
            text = getattr(chunk, "text", str(chunk)).strip()
            if not text:
                continue

            token_count = getattr(chunk, "token_count", None)

            out.append(
                {
                    "index": global_index,
                    "text": text,
                    "token_count": token_count,
                    "section_index": section.index,
                    "section_path": section_path,
                }
            )
            global_index += 1

    return out
