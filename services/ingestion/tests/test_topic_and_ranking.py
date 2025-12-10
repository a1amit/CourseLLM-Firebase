"""
Tests for topic extraction and content ranking functionality.
"""

import os
import sys
from pathlib import Path

# Ensure services/ingestion is importable
ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from app.topic_extractor import TopicExtractor, extract_topics_from_chunks
from app.ranker import ContentRanker, rank_chunks


def test_topic_extractor_fallback():
    """Test fallback topic extraction when LLM is not available."""
    text = """
    # Machine Learning Basics
    
    This chapter introduces Machine Learning concepts including Supervised Learning
    and Neural Networks. We'll explore Deep Learning and Artificial Intelligence.
    """
    
    # Use fallback method directly
    extractor = TopicExtractor.__new__(TopicExtractor)
    topics = extractor._fallback_extraction(text, max_topics=5)
    
    assert isinstance(topics, list)
    assert len(topics) > 0
    # Should extract capitalized terms
    assert any('machine' in t or 'learning' in t or 'neural' in t for t in topics)


def test_extract_topics_from_chunks_structure():
    """Test that topics are added to chunks correctly."""
    chunks = [
        {"index": 0, "content": "Introduction to Python programming", "token_count": 100},
        {"index": 1, "content": "Advanced JavaScript techniques", "token_count": 150},
    ]
    
    # Mock the extract_topics method to avoid LLM calls
    original_extract = TopicExtractor.extract_topics
    TopicExtractor.extract_topics = lambda self, text, max_topics=5: ["test", "topic"]
    
    try:
        result = extract_topics_from_chunks(chunks, max_topics=3)
        
        # Check structure
        assert len(result) == 2
        assert all('topics' in chunk for chunk in result)
        assert all(isinstance(chunk['topics'], list) for chunk in result)
    finally:
        # Restore original method
        TopicExtractor.extract_topics = original_extract


def test_content_ranker_position_score():
    """Test position-based scoring."""
    ranker = ContentRanker()
    
    # First chunk should score higher
    chunk1 = {"index": 0, "content": "# Introduction\n\nFirst chapter"}
    chunk2 = {"index": 5, "content": "Later content"}
    
    score1 = ranker.calculate_position_score(chunk1, total_chunks=10)
    score2 = ranker.calculate_position_score(chunk2, total_chunks=10)
    
    assert score1 > score2
    assert 0 <= score1 <= 30
    assert 0 <= score2 <= 30


def test_content_ranker_quality_score():
    """Test content quality scoring."""
    ranker = ContentRanker()
    
    # Well-structured chunk
    good_chunk = {
        "index": 0,
        "content": """
# Important Topic

This is a well-written section with:
- Lists
- **Bold text**
- Code blocks

```python
def example():
    pass
```
        """,
        "token_count": 300
    }
    
    # Poor quality chunk
    poor_chunk = {
        "index": 0,
        "content": "Short text",
        "token_count": 10
    }
    
    good_score = ranker.calculate_quality_score(good_chunk)
    poor_score = ranker.calculate_quality_score(poor_chunk)
    
    assert good_score > poor_score
    assert 0 <= good_score <= 30
    assert 0 <= poor_score <= 30


def test_content_ranker_semantic_score():
    """Test semantic importance scoring."""
    ranker = ContentRanker()
    
    chunk_relevant = {
        "content": "Machine learning algorithms and neural networks",
        "topics": ["machine learning", "neural networks"],
        "token_count": 100
    }
    
    chunk_irrelevant = {
        "content": "Some random unrelated text",
        "topics": [],
        "token_count": 50
    }
    
    # With document title
    score_relevant = ranker.calculate_semantic_score(
        chunk_relevant,
        document_title="Introduction to Machine Learning"
    )
    score_irrelevant = ranker.calculate_semantic_score(
        chunk_irrelevant,
        document_title="Introduction to Machine Learning"
    )
    
    assert score_relevant > score_irrelevant
    assert 0 <= score_relevant <= 40


def test_rank_chunks_batch():
    """Test ranking multiple chunks."""
    chunks = [
        {
            "index": 0,
            "content": "# Introduction\n\nWelcome to Machine Learning",
            "token_count": 300,
            "topics": ["machine learning"]
        },
        {
            "index": 1,
            "content": "Some content in the middle",
            "token_count": 150,
            "topics": []
        },
        {
            "index": 2,
            "content": "Final thoughts",
            "token_count": 100,
            "topics": []
        }
    ]
    
    ranked_chunks = rank_chunks(chunks, document_title="Machine Learning Guide")
    
    # Check that all chunks have ranks
    assert all('rank' in chunk for chunk in ranked_chunks)
    assert all(0 <= chunk['rank'] <= 100 for chunk in ranked_chunks)
    
    # First chunk should generally rank higher
    assert ranked_chunks[0]['rank'] > ranked_chunks[2]['rank']


def test_integration_topics_and_ranking():
    """Integration test: chunks with topics and ranking."""
    chunks = [
        {
            "index": 0,
            "content": "# Deep Learning\n\nIntroduction to neural networks and AI",
            "token_count": 250
        },
        {
            "index": 1,
            "content": "**Machine Learning** uses algorithms to learn from data",
            "token_count": 200
        }
    ]
    
    # Mock topic extraction
   TopicExtractor.extract_topics = lambda self, text, max_topics=5: ["deep learning", "machine learning"]
    
    try:
        # Extract topics
        chunks_with_topics = extract_topics_from_chunks(chunks)
        
        # Rank chunks
        final_chunks = rank_chunks(chunks_with_topics, document_title="AI Fundamentals")
        
        # Verify both topics and ranks are present
        assert all('topics' in chunk for chunk in final_chunks)
        assert all('rank' in chunk for chunk in final_chunks)
        assert all(len(chunk['topics']) > 0 for chunk in final_chunks)
        assert all(chunk['rank'] > 0 for chunk in final_chunks)
    finally:
        # Cleanup
        pass


if __name__ == "__main__":
    import pytest
    pytest.main([__file__, "-v"])
