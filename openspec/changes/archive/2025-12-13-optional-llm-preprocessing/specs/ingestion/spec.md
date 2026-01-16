# Ingestion Service

## LLM Preprocessing

To support high-quality semantic chunking on messy or unstructured input (like raw notes), the service offers an optional **LLM Preprocessing** stage.

### Workflow

1.  **Input:** Raw text (notes, slides, bad MD).
2.  **LLM Call:** The text is sent to an LLM with a system prompt enforcing:
    *   Output **valid Markdown** only.
    *   Preserve **all information**.
    *   Use **headers** to structure topics.
3.  **Output:** Clean Markdown.
4.  **Chunking:** The clean Markdown is passed to the deterministic chunker.

### API Changes

**POST /chunk**

New parameters in `ChunkRequest`:

*   `include_preprocessing` (boolean, default: `false`): Enable the LLM normalization step.
*   `preprocess_model` (string, optional): Override the model used (e.g., `google/gemma-2-9b-it:free`).

### Configuration

*   `PREPROCESS_ENABLED`: Global toggle (default: false).
*   `PREPROCESS_MAX_INPUT_CHARS`: Safety limit (default: 40000) to protect against huge context costs.
*   `OPENROUTER_API_KEY`: Required for this feature to work.

### Failure Strategy

If preprocessing fails (API error, missing key, timeout), the service **falls back** to using the original raw input for chunking and adds a warning to the response.
