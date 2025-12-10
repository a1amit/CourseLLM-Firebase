"""
Topic extraction module using LLM (Google Gemini) for educational content.

Extracts relevant topic keywords from text chunks to enable topic-based search.
"""

from typing import List, Dict, Any, Optional
import re
import os


class TopicExtractor:
    """Extract topic tags from text chunks using LLM."""
    
    def __init__(self, model_name: str = "gemini-2.5-flash-lite"):
        """
        Initialize the topic extractor with Gemini.
        
        Args:
            model_name: Gemini model to use for topic extraction
        """
        try:
            from google import genai
        except ImportError:
            raise ImportError(
                "google-genai not installed. "
                "Install with: pip install google-genai"
            )
        
        
        self.model_name = model_name
        
        # Explicitly pass API key if available
        print(f"DEBUG: All Environment Keys: {list(os.environ.keys())}")
        api_key = os.environ.get("GOOGLE_GENAI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        print(f"DEBUG: Initializing Gemini Client. API Key found in env: {bool(api_key)}")
        if api_key:
            self.client = genai.Client(api_key=api_key)
        else:
            self.client = genai.Client()
    
    def extract_topics(self, text: str, max_topics: int = 5) -> tuple[List[str], str]:
        """
        Extract topic keywords from a single text chunk.
        
        Args:
            text: Text content to analyze
            max_topics: Maximum number of topics to extract
            
        Returns:
            Tuple of (List of topic keywords, source string)
        """
        if not text or len(text.strip()) < 10:
            return [], "empty_text"
        
        # Truncate very long text to avoid token limits
        text_sample = text[:1500] if len(text) > 1500 else text
        
        prompt = f"""You are an expert at analyzing educational content and extracting key topics.

Analyze this educational text and extract {max_topics} main topic keywords or phrases.

Rules:
- Return ONLY the topics, separated by commas
- Use lowercase
- Be specific and relevant to the content
- Prefer 1-3 word phrases
- No explanations, just the comma-separated list

Text:
{text_sample}

Topics:"""
        
        try:
            # Try to generate content


            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={
                    "temperature": 0.3,  # Low temperature for consistency
                    "max_output_tokens": 100,
                }
            )
            
            # Extract topics from response
            topics_text = response.text.strip()
            
            # Split by comma and clean
            topics = [
                topic.strip().lower()
                for topic in topics_text.split(',')
                if topic.strip()
            ]
            
            # Remove any topics that are too long or too short
            topics = [
                t for t in topics 
                if 2 <= len(t) <= 50 and not t.startswith(('the ', 'a ', 'an '))
            ]
            
            return topics[:max_topics], "gemini"
            
        except Exception as e:
            # Fallback: extract keywords from text using simple heuristics
            print(f"Warning: Topic extraction failed (using fallback): {e}")
            return self._fallback_extraction(text, max_topics), "fallback"
    
    def _fallback_extraction(self, text: str, max_topics: int) -> List[str]:
        """
        Fallback topic extraction using simple keyword extraction.
        
        Args:
            text: Text to analyze
            max_topics: Max topics to return
            
        Returns:
            List of extracted keywords
        """
        # Simple fallback: extract capitalized words/phrases
        # This is basic; in production, use a library like KeyBERT
        
        # Remove markdown formatting
        text = re.sub(r'[#*_`]', '', text)
        
        # Find capitalized words (potential topic names)
        # Exclude common start words if they appear capitalized at start of sentence
        words = re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text)
        
        # Count frequency
        word_freq = {}
        for word in words:
            word_lower = word.lower()
            # Skip common stopwords
            if word_lower in {'the', 'a', 'an', 'this', 'that', 'these', 'those', 'it', 'is', 'are'}:
                continue
            word_freq[word_lower] = word_freq.get(word_lower, 0) + 1
        
        # Sort by frequency and return top keywords
        sorted_topics = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        topics = [topic for topic, _ in sorted_topics[:max_topics]]
        
        return topics
    
    def extract_topics_batch(
        self, 
        chunks: List[Dict[str, Any]], 
        max_topics: int = 5,
        show_progress: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Extract topics for multiple chunks.
        
        Args:
            chunks: List of chunk dictionaries with 'content' field
            max_topics: Maximum topics per chunk
            show_progress: Print progress updates
            
        Returns:
            Chunks with added 'topics' and 'metadata' fields
        """
        total = len(chunks)
        
        for idx, chunk in enumerate(chunks):
            content = chunk.get('content', '')
            topics, source = self.extract_topics(content, max_topics)
            chunk['topics'] = topics
            
            # Add metadata
            if 'metadata' not in chunk:
                chunk['metadata'] = {}
            chunk['metadata']['topic_source'] = source
            
            if show_progress and (idx + 1) % 10 == 0:
                print(f"Extracted topics for {idx + 1}/{total} chunks")
        
        return chunks


def extract_topics_from_chunks(
    chunks: List[Dict[str, Any]],
    model_name: str = "gemini-2.5-flash-lite",
    max_topics: int = 5
) -> List[Dict[str, Any]]:
    """
    Convenience function to extract topics from chunks.
    
    Args:
        chunks: List of chunk dictionaries
        model_name: Gemini model to use
        max_topics: Maximum topics per chunk
        
    Returns:
        Chunks with topics added
    """
    extractor = TopicExtractor(model_name=model_name)
    return extractor.extract_topics_batch(
        chunks, 
        max_topics=max_topics,
        show_progress=len(chunks) > 10
    )
