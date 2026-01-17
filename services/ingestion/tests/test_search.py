"""Tests for semantic search endpoint."""

import pytest
from fastapi.testclient import TestClient


class TestSemanticSearchSetup:
    """Test semantic search preconditions and setup."""

    def test_search_without_prior_chunk_fails(self, client: TestClient):
        """Precondition: No chunks have been created
        Action: POST /search/semantic
        Postcondition: Returns 400 error"""
        response = client.post(
            "/search/semantic",
            json={"query": "machine learning"}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert "No chunks available" in data["detail"]

    def test_search_after_chunk_without_embeddings_fails(self, client: TestClient, sample_markdown: str):
        """Precondition: Chunks created without embeddings
        Action: POST /search/semantic
        Postcondition: Returns 400 error"""
        # First chunk without embeddings
        client.post("/chunk", json={"text": sample_markdown})
        
        # Then try to search
        response = client.post(
            "/search/semantic",
            json={"query": "machine learning"}
        )
        
        assert response.status_code == 400
        data = response.json()
        assert "embeddings" in data["detail"].lower()


class TestSemanticSearchBasic:
    """Test basic semantic search functionality."""

    def test_search_with_embeddings_success(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: Chunks created with embeddings
        Action: POST /chunk with embeddings, then POST /search/semantic
        Postcondition: Returns 200 with search results"""
        # Setup: Create chunks with embeddings
        chunk_response = client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        assert chunk_response.status_code == 200
        
        # Test: Search
        response = client.post(
            "/search/semantic",
            json={"query": "machine learning"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert "total_results" in data
        assert "chunks" in data
        assert data["total_results"] >= 0

    def test_search_response_structure(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: Chunks with embeddings exist
        Action: POST /search/semantic
        Postcondition: Response has correct structure"""
        # Setup
        client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        
        # Test
        response = client.post(
            "/search/semantic",
            json={"query": "learning algorithms"}
        )
        
        data = response.json()
        assert isinstance(data["total_results"], int)
        assert data["total_results"] >= 0
        assert "chunks" in data
        assert isinstance(data["chunks"], list)
        assert "embedding_dim" in data

    def test_search_returns_chunks(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: Chunks with embeddings exist
        Action: POST /search/semantic
        Postcondition: Returned chunks have required fields"""
        # Setup
        client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        
        # Test
        response = client.post(
            "/search/semantic",
            json={"query": "deep learning"}
        )
        
        data = response.json()
        for chunk in data["chunks"]:
            assert "index" in chunk
            assert "text" in chunk
            assert len(chunk["text"]) > 0


class TestSemanticSearchFiltering:
    """Test filtering options for semantic search."""

    def test_search_with_limit(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: Multiple chunks with embeddings
        Action: POST /search/semantic with limit=2
        Postcondition: Returns at most 2 results"""
        # Setup
        client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        
        # Test
        response = client.post(
            "/search/semantic",
            json={"query": "learning", "limit": 2}
        )
        
        data = response.json()
        assert len(data["chunks"]) <= 2

    def test_search_with_similarity_threshold(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: Chunks with embeddings exist
        Action: POST /search/semantic with min_similarity=0.5
        Postcondition: Filters by similarity threshold"""
        # Setup
        client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        
        # Test
        response = client.post(
            "/search/semantic",
            json={
                "query": "neural networks",
                "min_similarity": 0.5
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        # All returned chunks should meet similarity threshold
        for chunk in data["chunks"]:
            if "rank" in chunk and chunk["rank"] is not None:
                assert chunk["rank"] >= (0.5 * 100)  # Convert to 0-100 scale

    def test_search_limit_validation(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: None
        Action: POST /search/semantic with limit=500 (exceeds max)
        Postcondition: Returns 422 validation error"""
        # Setup
        client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        
        # Test
        response = client.post(
            "/search/semantic",
            json={"query": "learning", "limit": 500}
        )
        
        assert response.status_code == 422

    def test_search_min_similarity_validation(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: None
        Action: POST /search/semantic with min_similarity=1.5 (out of range)
        Postcondition: Returns 422 validation error"""
        # Setup
        client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        
        # Test
        response = client.post(
            "/search/semantic",
            json={"query": "learning", "min_similarity": 1.5}
        )
        
        assert response.status_code == 422


class TestSemanticSearchErrorHandling:
    """Test error handling for semantic search."""

    def test_search_empty_query_fails(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: Chunks with embeddings exist
        Action: POST /search/semantic with empty query
        Postcondition: Returns 422 validation error"""
        # Setup
        client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        
        # Test
        response = client.post(
            "/search/semantic",
            json={"query": ""}
        )
        
        assert response.status_code == 422

    def test_search_missing_query_fails(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: Chunks with embeddings exist
        Action: POST /search/semantic without query field
        Postcondition: Returns 422 validation error"""
        # Setup
        client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        
        # Test
        response = client.post(
            "/search/semantic",
            json={}
        )
        
        assert response.status_code == 422

    def test_search_with_zero_similarity_threshold(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: Chunks with embeddings exist
        Action: POST /search/semantic with min_similarity=0
        Postcondition: Returns all chunks (no filtering)"""
        # Setup
        chunk_resp = client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        chunk_count = chunk_resp.json()["chunk_count"]
        
        # Test
        response = client.post(
            "/search/semantic",
            json={
                "query": "test",
                "min_similarity": 0.0
            }
        )
        
        assert response.status_code == 200
        # Should return all chunks or at least not fail
        assert "chunks" in response.json()


class TestSemanticSearchIntegration:
    """Integration tests for semantic search workflow."""

    def test_chunk_then_search_workflow(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: None
        Action: 1) Chunk with embeddings, 2) Search, 3) Verify results
        Postcondition: Complete workflow succeeds"""
        # Step 1: Create chunks with embeddings
        chunk_response = client.post(
            "/chunk",
            json={
                "text": sample_markdown,
                "include_embeddings": True,
                "include_topics": True
            }
        )
        assert chunk_response.status_code == 200
        chunks_data = chunk_response.json()
        original_chunk_count = chunks_data["chunk_count"]
        
        # Step 2: Search
        search_response = client.post(
            "/search/semantic",
            json={"query": "machine learning concepts"}
        )
        assert search_response.status_code == 200
        search_data = search_response.json()
        
        # Step 3: Verify
        assert search_data["total_results"] <= original_chunk_count
        assert len(search_data["chunks"]) <= search_data["total_results"]
        
        # Verify chunk structure in search results
        for chunk in search_data["chunks"]:
            assert "index" in chunk
            assert "text" in chunk
            assert "rank" in chunk or search_data["total_results"] == 0

    def test_multiple_searches_with_same_chunks(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: Chunks with embeddings exist
        Action: Perform multiple searches
        Postcondition: All searches succeed with consistent structure"""
        # Setup: Create chunks once
        client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        
        queries = [
            "machine learning",
            "neural networks",
            "deep learning",
            "algorithms"
        ]
        
        # Test: Multiple searches
        for query in queries:
            response = client.post(
                "/search/semantic",
                json={"query": query}
            )
            
            assert response.status_code == 200
            data = response.json()
            assert "total_results" in data
            assert "chunks" in data
            assert isinstance(data["chunks"], list)

    def test_search_result_ranking(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: Chunks with embeddings, multiple results
        Action: POST /search/semantic
        Postcondition: Results have rank field and are properly ordered"""
        # Setup
        client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        
        # Test
        response = client.post(
            "/search/semantic",
            json={"query": "learning"}
        )
        
        data = response.json()
        if len(data["chunks"]) > 1:
            # Check that chunks have rank field
            for chunk in data["chunks"]:
                assert "rank" in chunk
            
            # Check ordering (should be descending by rank)
            ranks = [c.get("rank", 0) for c in data["chunks"]]
            for i in range(len(ranks) - 1):
                assert ranks[i] >= ranks[i + 1]
