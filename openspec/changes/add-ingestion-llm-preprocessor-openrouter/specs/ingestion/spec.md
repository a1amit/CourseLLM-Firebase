## ADDED Requirements

### Requirement: Optional LLM preprocessing for chunking
The ingestion service SHALL support an optional preprocessing step that converts input text into clean, semantically structured Markdown before deterministic chunking.

#### Scenario: Preprocessing enabled and succeeds
- **GIVEN** the client calls `POST /chunk` with preprocessing enabled
- **AND** the ingestion service is configured with an OpenRouter API key
- **WHEN** the request is processed
- **THEN** the service calls OpenRouter Chat Completions using `amazon/nova-2-lite-v1:free`
- **AND** the service uses the model output as the chunking input
- **AND** the response chunks reflect the preprocessed Markdown structure

#### Scenario: Preprocessing enabled but OpenRouter not configured
- **GIVEN** the client calls `POST /chunk` with preprocessing enabled
- **AND** `OPENROUTER_API_KEY` is missing
- **WHEN** the request is processed
- **THEN** the service SHALL NOT attempt preprocessing
- **AND** the service SHALL fall back to chunking the original input
- **AND** the response includes a warning describing the missing configuration

#### Scenario: Preprocessing enabled but OpenRouter call fails
- **GIVEN** the client calls `POST /chunk` with preprocessing enabled
- **AND** OpenRouter returns an error or an invalid response
- **WHEN** the request is processed
- **THEN** the service SHALL fall back to chunking the original input
- **AND** the response includes a warning indicating preprocessing failed

### Requirement: No chunking by the preprocessor
The preprocessing step SHALL NOT introduce chunk boundaries or delimiters beyond legitimate semantic headings present in the source.

#### Scenario: Output constraints
- **WHEN** preprocessing is enabled
- **THEN** the preprocessing prompt instructs the model to output Markdown only
- **AND** the service uses the model response content verbatim (as markdown) as the chunking input
