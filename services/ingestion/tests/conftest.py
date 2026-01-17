"""Pytest configuration and fixtures for ingestion service tests."""

import pytest
import os
from typing import Generator
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock

# Import the FastAPI app
from app.main import app, _LAST_CHUNKS
from app.settings import get_settings


@pytest.fixture
def client() -> Generator[TestClient, None, None]:
    """Provide a TestClient for the FastAPI app."""
    yield TestClient(app)


@pytest.fixture
def mock_settings():
    """Provide mock settings for consistent test behavior."""
    settings = get_settings()
    # Ensure defaults for testing
    settings.default_chunk_size = 500
    settings.default_overlap_size = 50
    settings.max_input_chars = 100000
    settings.max_embed_chunks = 100
    settings.tokenizer = "cl100k_base"
    return settings


@pytest.fixture(autouse=True)
def cleanup_globals():
    """Clean up global state before and after each test."""
    # Reset global _LAST_CHUNKS before test
    import app.main
    app.main._LAST_CHUNKS = []
    app.main._LAST_EMBEDDER_PROVIDER = None
    app.main._LAST_EMBEDDER_MODEL = None
    
    yield
    
    # Clean up after test
    app.main._LAST_CHUNKS = []
    app.main._LAST_EMBEDDER_PROVIDER = None
    app.main._LAST_EMBEDDER_MODEL = None


@pytest.fixture
def mock_embedder():
    """Mock embedder for testing embedding-related functionality."""
    with patch("app.main.get_embedder") as mock:
        embedder_instance = MagicMock()
        # Return deterministic embeddings for testing
        embedder_instance.embed_texts.return_value = [
            [0.8, 0.2, 0.3, 0.1, 0.5],  # Chunk 1 embedding
            [0.7, 0.3, 0.4, 0.2, 0.6],  # Chunk 2 embedding
        ]
        mock.return_value = embedder_instance
        yield mock


@pytest.fixture
def sample_markdown() -> str:
    """Provide sample markdown for testing."""
    return """# Introduction to Machine Learning

## Overview
Machine Learning (ML) is a subset of artificial intelligence that enables systems to learn and improve from experience.

## Key Concepts
- **Supervised Learning**: Learning with labeled data
- **Unsupervised Learning**: Finding patterns in unlabeled data
- **Reinforcement Learning**: Learning through reward signals

## Applications
ML is used in recommendation systems, natural language processing, computer vision, and many other domains.

### Deep Learning
Deep learning uses neural networks with multiple layers to learn complex patterns.
"""


@pytest.fixture
def minimal_markdown() -> str:
    """Provide minimal markdown for edge case testing."""
    return "# Test\n\nMinimal content."


@pytest.fixture
def large_markdown() -> str:
    """Provide larger markdown content."""
    content = "# Large Document\n\n"
    for i in range(50):
        content += f"""## Section {i}
This is section {i} with some content about various topics.
It contains multiple paragraphs to ensure adequate token count.

Key points:
- Point 1
- Point 2
- Point 3

---

"""
    return content
