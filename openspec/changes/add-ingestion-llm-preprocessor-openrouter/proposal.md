# Change: Add OpenRouter LLM preprocessing stage for ingestion

## Why
We want the ingestion pipeline to be resilient to messy/unknown source formatting (e.g., conversions into markdown), by running an LLM-based **preprocessing** step that rewrites input into clean, well-structured Markdown before deterministic chunking.

## What Changes
- Add an optional preprocessing stage to `POST /chunk` that:
  - Calls OpenRouter Chat Completions using **Amazon Nova 2 Lite (free)** (`amazon/nova-2-lite-v1:free`).
  - Applies the provided system/instruction prompt to produce **Markdown-only** output.
  - Feeds the resulting Markdown into the existing deterministic chunking flow.
- Add configuration via environment variables (server-side) and per-request overrides.
- Add safe fallback behavior: if preprocessing fails, the service continues with the original input and returns a warning.
- Update `services/ingestion/.env.example` to include the OpenRouter API key and preprocessing settings.
- Update service README with the new option and examples.

## Impact
- Affected service: `services/ingestion`.
- API: Adds new optional request fields (non-breaking).
- Security: Introduces a new external API key (`OPENROUTER_API_KEY`).
- Cost: Uses a free-tier model by default, but still adds latency; preprocessing must be optional/explicit.

## Notes / Constraints
- The preprocessor MUST NOT chunk; it only normalizes structure and formatting.
- The preprocessor MUST preserve all original information and output Markdown only.
- Keep existing behavior unchanged when preprocessing is disabled.
