## ADDED Requirements

### Requirement: Chunk topic extraction
The ingestion service SHALL support extracting a list of topics for each returned chunk.

#### Scenario: Extract topics with Gemini
- **GIVEN** the client calls `POST /chunk` with topic extraction enabled
- **AND** the ingestion service is configured with a Gemini API key
- **WHEN** the request is processed
- **THEN** each chunk includes `topics` (a short list of strings)
- **AND** the response includes `topic_source="gemini"`

#### Scenario: Topic extraction requested but Gemini not configured
- **GIVEN** the client calls `POST /chunk` with topic extraction enabled
- **AND** the ingestion service is not configured with a Gemini API key
- **WHEN** the request is processed
- **THEN** the service falls back to a heuristic topic extractor
- **AND** each chunk includes `topics` (a short list of strings)
- **AND** the response includes `topic_source` indicating the fallback reason (e.g. `"heuristic:no_key"`)
- **AND** the response includes a warning indicating it fell back due to missing configuration

### Requirement: Topic search
The ingestion service SHALL provide a topic search endpoint for development that returns chunks matching the requested topics.

#### Scenario: Search by topic
- **GIVEN** the client has previously called `POST /chunk` and topics were extracted
- **WHEN** the client calls `POST /search/topics` with a list of topics
- **THEN** the service returns matching chunks
- **AND** results are ordered by descending relevance

### Requirement: Ranking
The ingestion service SHALL assign a deterministic rank score to topic-search results so that the most relevant chunks appear first.

#### Scenario: Ranking prefers stronger matches
- **GIVEN** two chunks match the search topic list
- **AND** one chunk matches more query topics than the other
- **WHEN** results are ranked
- **THEN** the chunk with more topic matches appears first
