# Ingestion Service

## Topic Extraction

The ingestion service can optionally extract key topics (keywords/tags) from each generated chunk. This facilitates labeling, filtering, and debugging.

### Topic Models

We support pluggable topic extraction strategies.

| Model | Description | Key Requirement |
| :--- | :--- | :--- |
| `heuristic` | Deterministic, regex-based keyword extraction. | None (runs locally) |

### API Changes

**POST /chunk**

New parameters in `ChunkRequest`:

*   `include_topics` (boolean, default: `false`): Whether to extract topics.
*   `topic_model` (string, enum: `["heuristic"]`): Strategy to use.
*   `max_topics` (int, default: `10`): Maximum number of topics to return per chunk.

**Response Structure**

`ChunkOut` object additions:

```json
{
  "text": "...",
  "topics": ["linked list", "data structure", "pointers"],
  "topic_source": "heuristic"
}
```

### Heuristic Logic

The `heuristic` model uses a stopword-filtered word frequency approach:
1.  Tokenizes text into words.
2.  Filters out common English stopwords.
3.  Normalizes words (lowercase, strip punctuation).
4.  Scoring based on frequency and position (e.g., words in headings might be weighted higher in future iterations).
