"""
Content ranking module for educational chunks.

Ranks chunks by relevance based on multiple factors:
- Position in document
- Semantic importance
- Content quality
"""

from typing import List, Dict, Any, Optional
import re
import numpy as np


class ContentRanker:
    """Rank content chunks by relevance and importance."""
    
    def __init__(
        self,
        position_weight: float = 0.3,
        semantic_weight: float = 0.4,
        quality_weight: float = 0.3
    ):
        """
        Initialize the content ranker.
        
        Args:
            position_weight: Weight for position-based scoring (0-1)
            semantic_weight: Weight for semantic importance (0-1)
            quality_weight: Weight for content quality (0-1)
        """
        # Normalize weights
        total = position_weight + semantic_weight + quality_weight
        self.position_weight = position_weight / total
        self.semantic_weight = semantic_weight / total
        self.quality_weight = quality_weight / total
    
    def calculate_position_score(self, chunk: Dict[str, Any], total_chunks: int) -> float:
        """
        Calculate position-based score (0-30 points).
        
        Earlier content and content with headers tend to be more important.
        
        Args:
            chunk: Chunk dictionary with 'index' field
            total_chunks: Total number of chunks in document
            
        Returns:
            Position score (0-30)
        """
        index = chunk.get('index', 0)
        
        # Earlier chunks get higher scores (exponential decay)
        # First chunk: 30 points, last chunk: ~5 points
        position_ratio = index / max(total_chunks - 1, 1)
        position_score = 30 * (1 - position_ratio ** 0.5)
        
        # Bonus for chunks with markdown headers
        content = chunk.get('content', '')
        header_bonus = 0
        if re.search(r'^#{1,3}\s+\w+', content, re.MULTILINE):
            header_bonus = 5
        
        return min(position_score + header_bonus, 30)
    
    def calculate_semantic_score(
        self, 
        chunk: Dict[str, Any], 
        document_title: Optional[str] = None,
        all_chunks: Optional[List[Dict[str, Any]]] = None
    ) -> float:
        """
        Calculate semantic importance score (0-40 points).
        
        Based on relevance to document title and overall content.
        
        Args:
            chunk: Chunk dictionary with 'content' field
            document_title: Optional document title for comparison
            all_chunks: All chunks for context (optional)
            
        Returns:
            Semantic score (0-40)
        """
        content = chunk.get('content', '').lower()
        score = 20  # Base score
        
        # If document title is provided, check for keyword overlap
        if document_title:
            title_words = set(re.findall(r'\b\w+\b', document_title.lower()))
            # Remove common words
            title_words = title_words - {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for'}
            
            content_words = set(re.findall(r'\b\w+\b', content))
            
            if title_words and content_words:
                overlap = len(title_words & content_words) / len(title_words)
                score += overlap * 15  # Up to 15 bonus points
        
        # Bonus for having topic-related keywords (if topics exist)
        topics = chunk.get('topics', [])
        if topics:
            # More topics might indicate important content
            topic_bonus = min(len(topics) * 1.5, 10)
            score += topic_bonus
        
        # Penalty for very short chunks (might be incomplete thoughts)
        token_count = chunk.get('token_count', 0)
        if token_count < 50:
            score -= 5
        
        return min(score, 40)
    
    def calculate_quality_score(self, chunk: Dict[str, Any]) -> float:
        """
        Calculate content quality score (0-30 points).
        
        Based on structure, formatting, and completeness.
        
        Args:
            chunk: Chunk dictionary with 'content' and 'token_count'
            
        Returns:
            Quality score (0-30)
        """
        content = chunk.get('content', '')
        token_count = chunk.get('token_count', 0)
        
        score = 0
        
        # Optimal length bonus (chunks with 200-600 tokens are ideal)
        if 200 <= token_count <= 600:
            score += 15
        elif 100 <= token_count < 200 or 600 < token_count <= 800:
            score += 10
        else:
            score += 5
        
        # Structured content bonus
        # Has headers
        if re.search(r'^#{1,6}\s+', content, re.MULTILINE):
            score += 4
        
        # Has lists
        if re.search(r'^\s*[-*+]\s+', content, re.MULTILINE) or re.search(r'^\s*\d+\.\s+', content, re.MULTILINE):
            score += 3
        
        # Has code blocks
        if '```' in content or '`' in content:
            score += 3
        
        # Has tables
        if '|' in content and content.count('|') >= 4:
            score += 2
        
        # Has emphasis (bold/italic)
        if re.search(r'\*\*\w+\*\*|\*\w+\*|__\w+__|_\w+_', content):
            score += 2
        
        # Completeness: ends with proper punctuation or structure
        if re.search(r'[.!?]$', content.strip()) or re.search(r'```\s*$', content):
            score += 1
        
        return min(score, 30)
    
    def rank_chunk(
        self, 
        chunk: Dict[str, Any],
        context: Dict[str, Any]
    ) -> float:
        """
        Calculate overall rank for a chunk.
        
        Args:
            chunk: Chunk to rank
            context: Context dictionary containing:
                - total_chunks: Total number of chunks
                - document_title: Optional document title
                - all_chunks: Optional list of all chunks
                
        Returns:
            Rank score (0-100)
        """
        total_chunks = context.get('total_chunks', 1)
        document_title = context.get('document_title')
        all_chunks = context.get('all_chunks')
        
        # Calculate individual scores
        position_score = self.calculate_position_score(chunk, total_chunks)
        semantic_score = self.calculate_semantic_score(chunk, document_title, all_chunks)
        quality_score = self.calculate_quality_score(chunk)
        
        # Weighted sum
        total_score = (
            position_score * self.position_weight * 100 / 30 +
            semantic_score * self.semantic_weight * 100 / 40 +
            quality_score * self.quality_weight * 100 / 30
        )
        
        return round(total_score, 2)
    
    def rank_chunks_batch(
        self, 
        chunks: List[Dict[str, Any]],
        document_title: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Rank multiple chunks.
        
        Args:
            chunks: List of chunks to rank
            document_title: Optional document title for context
            
        Returns:
            Chunks with added 'rank' field
        """
        context = {
            'total_chunks': len(chunks),
            'document_title': document_title,
            'all_chunks': chunks
        }
        
        for chunk in chunks:
            rank = self.rank_chunk(chunk, context)
            chunk['rank'] = rank
        
        return chunks


def rank_chunks(
    chunks: List[Dict[str, Any]],
    document_title: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Convenience function to rank chunks.
    
    Args:
        chunks: List of chunk dictionaries
        document_title: Optional document title for context
        
    Returns:
        Chunks with ranks added
    """
    ranker = ContentRanker()
    return ranker.rank_chunks_batch(chunks, document_title)
