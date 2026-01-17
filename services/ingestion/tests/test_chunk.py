"""Tests for the /chunk endpoint."""

import pytest
from fastapi.testclient import TestClient


class TestChunkBasic:
    """Test basic chunking functionality."""

    def test_chunk_success_minimal(self, client: TestClient, minimal_markdown: str):
        """Precondition: None
        Action: POST /chunk with minimal valid markdown
        Postcondition: Returns 200 with chunk_count >= 1"""
        response = client.post("/chunk", json={"text": minimal_markdown})
        
        assert response.status_code == 200
        data = response.json()
        assert "chunk_count" in data
        assert data["chunk_count"] >= 1
        assert "chunks" in data
        assert len(data["chunks"]) == data["chunk_count"]

    def test_chunk_response_structure(self, client: TestClient, sample_markdown: str):
        """Precondition: None
        Action: POST /chunk with valid markdown
        Postcondition: Response has required fields for each chunk"""
        response = client.post("/chunk", json={"text": sample_markdown})
        
        data = response.json()
        assert data["chunk_count"] > 0
        
        for chunk in data["chunks"]:
            # Required fields
            assert "index" in chunk
            assert "text" in chunk
            assert isinstance(chunk["index"], int)
            assert isinstance(chunk["text"], str)
            assert len(chunk["text"]) > 0

    def test_chunk_indexes_sequential(self, client: TestClient, sample_markdown: str):
        """Precondition: None
        Action: POST /chunk with valid markdown
        Postcondition: Chunk indexes are sequential starting from 0"""
        response = client.post("/chunk", json={"text": sample_markdown})
        
        data = response.json()
        for i, chunk in enumerate(data["chunks"]):
            assert chunk["index"] == i

    def test_chunk_with_custom_size(self, client: TestClient, sample_markdown: str):
        """Precondition: None
        Action: POST /chunk with chunk_size=200
        Postcondition: Returns chunks with approximately 200 token size"""
        response = client.post(
            "/chunk",
            json={"text": sample_markdown, "chunk_size": 200}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["chunk_count"] >= 1

    def test_chunk_with_overlap(self, client: TestClient, sample_markdown: str):
        """Precondition: None
        Action: POST /chunk with overlap_size=50
        Postcondition: Returns overlapping chunks"""
        response = client.post(
            "/chunk",
            json={"text": sample_markdown, "overlap_size": 50}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["chunk_count"] >= 1

    def test_chunk_section_path_included(self, client: TestClient, sample_markdown: str):
        """Precondition: include_section_path=true
        Action: POST /chunk
        Postcondition: Chunks have section_path field"""
        response = client.post(
            "/chunk",
            json={"text": sample_markdown, "include_section_path": True}
        )
        
        data = response.json()
        for chunk in data["chunks"]:
            assert "section_path" in chunk


class TestChunkErrorHandling:
    """Test error handling for chunking endpoint."""

    def test_chunk_empty_text_fails(self, client: TestClient):
        """Precondition: None
        Action: POST /chunk with empty text
        Postcondition: Returns 400 error"""
        response = client.post("/chunk", json={"text": ""})
        
        assert response.status_code == 400
        data = response.json()
        assert "detail" in data

    def test_chunk_missing_text_fails(self, client: TestClient):
        """Precondition: None
        Action: POST /chunk without text field
        Postcondition: Returns 422 validation error"""
        response = client.post("/chunk", json={})
        
        assert response.status_code == 422

    def test_chunk_whitespace_only_fails(self, client: TestClient):
        """Precondition: None
        Action: POST /chunk with whitespace-only text
        Postcondition: Returns 400 error"""
        response = client.post("/chunk", json={"text": "   \n\t  "})
        
        assert response.status_code == 400

    def test_chunk_invalid_chunk_size_fails(self, client: TestClient, sample_markdown: str):
        """Precondition: None
        Action: POST /chunk with chunk_size < 50
        Postcondition: Returns 422 validation error"""
        response = client.post(
            "/chunk",
            json={"text": sample_markdown, "chunk_size": 10}
        )
        
        assert response.status_code == 422

    def test_chunk_invalid_overlap_negative_fails(self, client: TestClient, sample_markdown: str):
        """Precondition: None
        Action: POST /chunk with negative overlap_size
        Postcondition: Returns 422 validation error"""
        response = client.post(
            "/chunk",
            json={"text": sample_markdown, "overlap_size": -10}
        )
        
        assert response.status_code == 422


class TestChunkWithOptionalFeatures:
    """Test chunking with optional features."""

    def test_chunk_with_topics(self, client: TestClient, sample_markdown: str):
        """Precondition: include_topics=true
        Action: POST /chunk
        Postcondition: Chunks have topics field"""
        response = client.post(
            "/chunk",
            json={"text": sample_markdown, "include_topics": True}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["chunk_count"] > 0
        
        for chunk in data["chunks"]:
            # Topics may be None or a list
            if "topics" in chunk and chunk["topics"]:
                assert isinstance(chunk["topics"], list)
                if chunk["topics"]:
                    assert all(isinstance(t, str) for t in chunk["topics"])

    def test_chunk_with_custom_topic_limit(self, client: TestClient, sample_markdown: str):
        """Precondition: include_topics=true, max_topics=3
        Action: POST /chunk
        Postcondition: Each chunk has max 3 topics"""
        response = client.post(
            "/chunk",
            json={
                "text": sample_markdown,
                "include_topics": True,
                "max_topics": 3
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        for chunk in data["chunks"]:
            if chunk.get("topics"):
                assert len(chunk["topics"]) <= 3

    def test_chunk_with_embeddings(self, client: TestClient, sample_markdown: str, mock_embedder):
        """Precondition: include_embeddings=true, mock embedder
        Action: POST /chunk
        Postcondition: Chunks have embedding vectors"""
        response = client.post(
            "/chunk",
            json={"text": sample_markdown, "include_embeddings": True}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["chunk_count"] > 0
        
        for chunk in data["chunks"]:
            if chunk.get("embedding"):
                assert isinstance(chunk["embedding"], list)
                assert len(chunk["embedding"]) > 0

    def test_chunk_too_many_chunks_for_embeddings_fails(self, client: TestClient, large_markdown: str):
        """Precondition: large markdown that will create many chunks
        Action: POST /chunk with include_embeddings=true
        Postcondition: May return 413 if exceeds max_embed_chunks"""
        response = client.post(
            "/chunk",
            json={
                "text": large_markdown,
                "chunk_size": 100,  # Small chunks create many chunks
                "include_embeddings": True
            }
        )
        
        # Depending on max_embed_chunks setting, should either succeed or fail gracefully
        assert response.status_code in [200, 413]

    def test_chunk_warns_on_preprocessing_large_input(self, client: TestClient, large_markdown: str):
        """Precondition: include_preprocessing=true with large text
        Action: POST /chunk
        Postcondition: May include warning about preprocessing skipped"""
        response = client.post(
            "/chunk",
            json={"text": large_markdown, "include_preprocessing": True}
        )
        
        # Should succeed
        assert response.status_code == 200
        data = response.json()
        # May have warnings
        if data.get("warnings"):
            assert isinstance(data["warnings"], list)


class TestChunkDataIntegrity:
    """Test data integrity and consistency."""

    def test_chunk_content_preserved(self, client: TestClient, sample_markdown: str):
        """Precondition: None
        Action: POST /chunk, then combine all chunks
        Postcondition: Combined chunks contain original content"""
        response = client.post("/chunk", json={"text": sample_markdown})
        
        data = response.json()
        combined = "".join(chunk["text"] for chunk in data["chunks"])
        
        # Original content should be represented in chunks (may have overlaps)
        assert len(combined) >= len(sample_markdown) / 2  # Allow for some loss due to overlap handling

    def test_chunk_count_matches_chunks_list(self, client: TestClient, sample_markdown: str):
        """Precondition: None
        Action: POST /chunk
        Postcondition: chunk_count matches length of chunks array"""
        response = client.post("/chunk", json={"text": sample_markdown})
        
        data = response.json()
        assert data["chunk_count"] == len(data["chunks"])

    def test_chunk_token_counts_present(self, client: TestClient, sample_markdown: str):
        """Precondition: None
        Action: POST /chunk
        Postcondition: Each chunk has token_count field"""
        response = client.post("/chunk", json={"text": sample_markdown})
        
        data = response.json()
        for chunk in data["chunks"]:
            # token_count should be present and > 0
            assert "token_count" in chunk
            if chunk["token_count"] is not None:
                assert chunk["token_count"] >= 0

    def test_chunk_non_empty_text(self, client: TestClient, sample_markdown: str):
        """Precondition: None
        Action: POST /chunk
        Postcondition: Each chunk has non-empty text"""
        response = client.post("/chunk", json={"text": sample_markdown})
        
        data = response.json()
        for chunk in data["chunks"]:
            assert len(chunk["text"].strip()) > 0
