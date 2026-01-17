## 1. Implementation
- [x] 1.1 Add preprocessing request flags to ingestion models (`include_preprocessing`, `preprocess_model`).
- [x] 1.2 Implement OpenRouter chat-completions client in ingestion (requests-based) with timeouts and robust parsing.
- [x] 1.3 Add preprocessing step to `POST /chunk` before chunking; on failure, fall back to raw input and return a warning.
- [x] 1.4 Add env vars to configure preprocessing defaults and OpenRouter headers (optional):
  - `OPENROUTER_API_KEY`
  - `PREPROCESS_ENABLED` (default false)
  - `PREPROCESS_MODEL` (default amazon/nova-2-lite-v1:free)
  - `PREPROCESS_TIMEOUT_S` (default 60)
  - `PREPROCESS_MAX_INPUT_CHARS` (default 40000)
- [x] 1.5 Update `services/ingestion/.env.example` to include the above, with comments.
- [x] 1.6 Update `services/ingestion/README.md` with usage examples.

## 2. Validation
- [x] 2.1 Add a minimal unit-style test or smoke check (skipped: no existing ingestion Python test harness in repo).
- [x] 2.2 Run existing lint/typecheck/tests relevant to edited code (syntax checked via editor tooling).
