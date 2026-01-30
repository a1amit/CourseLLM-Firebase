# Backend API Tests (PyTest)

This directory contains comprehensive PyTest tests for the CourseWise Ingestion FastAPI service. These are backend unit/integration tests that validate all API endpoints with proper setup, teardown, and preconditions.

## Overview

Following the three-tier testing approach:
1. **Unit Tests** (Frontend) ✅ - `apps/web/src/components/ChunkingPreview.test.tsx`
2. **E2E Tests** (Frontend-Backend Integration) ✅ - `apps/web/tests/chunking-workflow.spec.ts`
3. **Backend Tests** (API Layer) ✅ - `services/ingestion/tests/` (this directory)

## Test Structure

### Test Files

- **`test_health.py`** - Health check and metrics endpoints
  - `/health` endpoint validation
  - `/metrics` endpoint structure and data integrity

- **`test_chunk.py`** - Chunking API tests (largest test suite)
  - Basic chunking functionality
  - Error handling and validation
  - Optional features (topics, embeddings, preprocessing)
  - Data integrity and consistency

- **`test_search.py`** - Semantic search API tests
  - Search preconditions and setup
  - Basic search functionality
  - Filtering and limits
  - Error handling
  - Complete workflow integration

### Test Organization

Each test file uses **test classes** to organize related tests:
```
TestClassName
  └── test_method_name
```

Each test follows the **AAA pattern** (Arrange, Act, Assert) with docstrings showing:
```
Precondition: What state must exist before test
Action: What we're testing
Postcondition: What we expect after the action
```

## Running Tests

### Install Dependencies

```bash
cd services/ingestion
pip install -r requirements.txt
```

### Run All Tests

```bash
PYTHONPATH=. pytest tests/ -v
```

### Run E2E Pipeline Test

The E2E test demonstrates the complete **ingest → chunk → search** workflow:

```bash
# Run E2E pipeline test with verbose output
PYTHONPATH=. pytest tests/test_e2e_pipeline.py -v -s

# Run with a custom input file
TEST_FILE=/path/to/your/document.md PYTHONPATH=. pytest tests/test_e2e_pipeline.py::TestE2EWithRealFile -v -s
```

### Run Specific Test File

```bash
pytest tests/test_chunk.py -v
```

### Run Specific Test Class

```bash
pytest tests/test_chunk.py::TestChunkBasic -v
```

### Run Specific Test

```bash
pytest tests/test_chunk.py::TestChunkBasic::test_chunk_success_minimal -v
```

### Run with Coverage

```bash
PYTHONPATH=. pytest tests/ --cov=app --cov-report=term-missing

# Generate HTML coverage report
PYTHONPATH=. pytest tests/ --cov=app --cov-report=html
```

## Test Coverage

### Health Endpoints (3 tests)
- ✅ Health endpoint returns ok status
- ✅ Health response has required fields
- ✅ Metrics endpoint returns all system metrics

### Chunking Endpoint (28 tests)
**Basic Functionality (6 tests)**
- ✅ Minimal valid markdown succeeds
- ✅ Response has required fields
- ✅ Chunk indexes are sequential
- ✅ Custom chunk size works
- ✅ Overlap parameter works
- ✅ Section path included in response

**Error Handling (6 tests)**
- ✅ Empty text fails with 400
- ✅ Missing text fails with 422
- ✅ Whitespace-only text fails
- ✅ Text exceeding size limit fails with 413
- ✅ Invalid chunk_size fails
- ✅ Negative overlap_size fails

**Optional Features (4 tests)**
- ✅ Topics extraction works
- ✅ Custom topic limits respected
- ✅ Embeddings generation works
- ✅ Too many chunks for embeddings fails gracefully

**Data Integrity (5 tests)**
- ✅ Content preservation across chunks
- ✅ chunk_count matches chunks array
- ✅ Token counts present
- ✅ Chunk text never empty

### Semantic Search Endpoint (20 tests)
**Setup & Preconditions (2 tests)**
- ✅ Search without prior chunks fails
- ✅ Search without embeddings fails

**Basic Functionality (3 tests)**
- ✅ Search with embeddings succeeds
- ✅ Response has correct structure
- ✅ Returned chunks have required fields

**Filtering Options (4 tests)**
- ✅ Limit parameter works
- ✅ Similarity threshold filtering works
- ✅ Limit validation enforced
- ✅ min_similarity validation enforced

**Error Handling (3 tests)**
- ✅ Empty query fails
- ✅ Missing query fails
- ✅ Invalid similarity threshold fails

**Integration & Workflows (8 tests)**
- ✅ Complete chunk-then-search workflow
- ✅ Multiple sequential searches work
- ✅ Search results are properly ranked
- Plus additional integration tests

## Key Testing Patterns

### 1. Fixtures (in `conftest.py`)

**TestClient Fixture**
```python
@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    yield TestClient(app)
```

**Sample Data Fixtures**
- `sample_markdown` - Realistic ML content
- `minimal_markdown` - Edge case minimal content
- `large_markdown` - Large document for stress testing

**Cleanup Fixture** (autouse)
- Resets global state before/after each test
- Ensures tests don't interfere with each other

**Mock Embedder Fixture**
```python
@pytest.fixture
def mock_embedder():
    with patch("app.main.get_embedder") as mock:
        embedder_instance = MagicMock()
        embedder_instance.embed_texts.return_value = [
            [0.8, 0.2, 0.3, 0.1, 0.5],
            [0.7, 0.3, 0.4, 0.2, 0.6],
        ]
        mock.return_value = embedder_instance
        yield mock
```

### 2. Precondition Setup

Tests explicitly set up required state:

```python
def test_search_after_chunk_with_embeddings(self, client, sample_markdown, mock_embedder):
    # Precondition: Create chunks with embeddings
    chunk_response = client.post(
        "/chunk",
        json={"text": sample_markdown, "include_embeddings": True}
    )
    assert chunk_response.status_code == 200
    
    # Action: Search
    response = client.post("/search/semantic", json={"query": "test"})
    
    # Postcondition: Verify success
    assert response.status_code == 200
```

### 3. Error Testing

Comprehensive error validation:

```python
def test_chunk_text_too_large_fails(self, client, mock_settings):
    # Create input exceeding limit
    large_text = "x" * (mock_settings.max_input_chars + 1)
    response = client.post("/chunk", json={"text": large_text})
    
    # Verify error response structure
    assert response.status_code == 413
    assert "detail" in response.json()
```

### 4. Data Integrity Validation

Verify response data consistency:

```python
def test_chunk_count_matches_chunks_list(self, client, sample_markdown):
    response = client.post("/chunk", json={"text": sample_markdown})
    data = response.json()
    
    # Validate consistency
    assert data["chunk_count"] == len(data["chunks"])
```

## Important Testing Principles

### ✅ State Independence
Each test is independent and doesn't rely on database state:
```python
@pytest.fixture(autouse=True)
def cleanup_globals():
    # Reset before test
    app.main._LAST_CHUNKS = []
    yield
    # Clean up after test
    app.main._LAST_CHUNKS = []
```

### ✅ Repeatable Tests
Tests use fixtures with known data:
```python
@pytest.fixture
def sample_markdown() -> str:
    return """# Introduction to Machine Learning
...consistent content..."""
```

### ✅ Comprehensive Assertions
Multiple validations per test:
```python
def test_chunk_response_structure(self, client, sample_markdown):
    response = client.post("/chunk", json={"text": sample_markdown})
    data = response.json()
    
    assert response.status_code == 200
    assert "chunk_count" in data
    assert data["chunk_count"] > 0
    assert all(c["index"] >= 0 for c in data["chunks"])
```

## Test Execution Examples

### Run all backend tests
```bash
cd services/ingestion
pytest tests/ -v
```

### Run only chunk tests
```bash
pytest tests/test_chunk.py -v
```

### Run tests matching pattern
```bash
pytest tests/ -k "test_chunk" -v
```

### Run with detailed output
```bash
pytest tests/ -vv --tb=long
```

### Run specific test with output
```bash
pytest tests/test_chunk.py::TestChunkBasic::test_chunk_success_minimal -vvs
```

## Integration with CI/CD

These tests should run in CI pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run backend API tests
  run: |
    cd services/ingestion
    pip install -r requirements.txt
    pytest tests/ -v --junitxml=test-results.xml
```

## Common Issues

### Issue: Import errors when running pytest
**Solution**: Ensure you're running from the `services/ingestion` directory and have installed requirements.

### Issue: Mock embedder not working
**Solution**: The `mock_embedder` fixture patches `app.main.get_embedder`. Ensure it's imported in your test.

### Issue: Tests fail due to global state
**Solution**: The `cleanup_globals` fixture (autouse=True) should handle this. Check that it's being called.

## Extending Tests

### Add new test for a feature
1. Choose appropriate test file (or create new one)
2. Create test class: `TestFeatureName`
3. Write test following AAA pattern:
```python
def test_feature_works(self, client, sample_markdown):
    """Precondition: ...
    Action: ...
    Postcondition: ..."""
    
    # Arrange
    response = client.post("/endpoint", json={"data": sample_markdown})
    
    # Act & Assert
    assert response.status_code == 200
```

### Add new fixture
1. Add to `conftest.py`
2. Use `@pytest.fixture` decorator
3. Add docstring explaining what it provides

## References

- [PyTest Documentation](https://docs.pytest.org/)
- [FastAPI Testing Guide](https://fastapi.tiangolo.com/advanced/testing-dependencies/)
- [TestClient Documentation](https://www.starlette.io/testclient/)
