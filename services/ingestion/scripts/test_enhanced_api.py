"""
Quick test script to verify the enhanced chunker API.
Run this to test the new topic extraction and ranking features.
"""

import requests
import json

# Test data
test_markdown = """
# Machine Learning Fundamentals

## Introduction

Machine learning is a subset of artificial intelligence that enables computers to learn from data.

## Supervised Learning

Supervised learning uses labeled data to train models. Common algorithms include:
- Linear Regression
- Decision Trees
- Neural Networks

## Deep Learning

Deep learning uses multi-layer neural networks to solve complex problems. It's particularly effective for:
- Image recognition
- Natural language processing
- Speech recognition

## Conclusion

Understanding these fundamentals is crucial for modern AI development.
"""

def test_enhanced_chunking():
    """Test the enhanced chunking endpoint."""
    url = "http://localhost:8000/v1/chunk"
    
    payload = {
        "markdown": test_markdown,
        "extract_topics": True,
        "rank_content": True,
        "document_title": "Machine Learning Fundamentals",
        "max_chunk_size": 768,
        "strategy": "semantic"
    }
    
    print("Testing enhanced chunking endpoint...")
    print(f"URL: {url}")
    print(f"\nRequest payload:")
    print(json.dumps(payload, indent=2))
    
    try:
        response = requests.post(url, json=payload, timeout=30)
        
        print(f"\nResponse status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            chunks = data.get('chunks', [])
            
            print(f"\n✅ Success! Received {len(chunks)} chunks\n")
            
            # Display chunk details
            for i, chunk in enumerate(chunks):
                print(f"--- Chunk {i + 1} ---")
                print(f"Content preview: {chunk.get('content', '')[:100]}...")
                print(f"Token count: {chunk.get('token_count', 0)}")
                print(f"Topics: {chunk.get('topics', [])}")
                print(f"Rank: {chunk.get('rank', 0.0):.2f}/100")
                print()
            
            # Sort chunks by rank
            sorted_chunks = sorted(chunks, key=lambda x: x.get('rank', 0), reverse=True)
            print("\n📊 Chunks sorted by rank:")
            for i, chunk in enumerate(sorted_chunks[:3]):  # Top 3
                content_preview = chunk.get('content', '')[:60].replace('\n', ' ')
                print(f"{i+1}. Rank {chunk.get('rank', 0):.2f}: {content_preview}...")
            
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to the service. Make sure it's running:")
        print("   pnpm docker:ingestion")
    except Exception as e:
        print(f"\n❌ Error: {e}")


def test_topic_search():
    """Test the topic search endpoint."""
    url = "http://localhost:8000/v1/search/topics"
    
    payload = {
        "topics": ["machine learning", "neural networks"],
        "min_rank": 50.0,
        "limit": 5
    }
    
    print("\n" + "="*60)
    print("Testing topic search endpoint...")
    print(f"URL: {url}")
    print(f"\nRequest payload:")
    print(json.dumps(payload, indent=2))
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        
        print(f"\nResponse status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            chunks = data.get('chunks', [])
            total = data.get('total_results', 0)
            
            print(f"\n✅ Success! Found {total} matching chunks (showing {len(chunks)})\n")
            
            for i, chunk in enumerate(chunks):
                content_preview = chunk.get('content', '')[:80].replace('\n', ' ')
                print(f"{i+1}. Rank {chunk.get('rank', 0):.2f} | Topics: {chunk.get('topics', [])}")
                print(f"   {content_preview}...")
                print()
        else:
            print(f"\n⚠️  Status: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"\n❌ Error: {e}")


if __name__ == "__main__":
    print("🚀 Testing Enhanced Chunker API\n")
    print("="*60)
    
    # Test chunking
    test_enhanced_chunking()
    
    # Test search
    test_topic_search()
    
    print("\n" + "="*60)
    print("✨ Testing complete!")
