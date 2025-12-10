"""
Comprehensive test for the enhanced chunker with real educational content.
"""

import requests
import json
from pathlib import Path

def load_sample_content():
    """Load the sample ML markdown content."""
    content_path = Path(__file__).parent / "sample_ml_content.md"
    with open(content_path, 'r', encoding='utf-8') as f:
        return f.read()

def test_full_pipeline():
    """Test the complete enhanced chunking pipeline."""
    url = "http://localhost:8000/v1/chunk"
    
    markdown_content = load_sample_content()
    
    payload = {
        "markdown": markdown_content,
        "extract_topics": True,
        "rank_content": True,
        "document_title": "Introduction to Machine Learning",
        "max_chunk_size": 768,
        "strategy": "semantic"
    }
    
    print("🧪 Testing Enhanced Chunker with Real Educational Content")
    print("="*70)
    print(f"\n📄 Document: Introduction to Machine Learning")
    print(f"📏 Content length: {len(markdown_content)} characters")
    print(f"⚙️  Strategy: Semantic Chunking")
    print(f"🎯 Max chunk size: 768 tokens")
    print(f"\nSending request to {url}...")
    
    try:
        response = requests.post(url, json=payload, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            chunks = data.get('chunks', [])
            
            print(f"\n✅ SUCCESS! Received {len(chunks)} chunks\n")
            print("="*70)
            
            # Analyze chunks
            print("\n📊 Chunk Analysis:")
            print("-"*70)
            
            total_tokens = sum(c.get('token_count', 0) for c in chunks)
            avg_rank = sum(c.get('rank', 0) for c in chunks) / len(chunks) if chunks else 0
            
            print(f"Total chunks: {len(chunks)}")
           print(f"Total tokens: {total_tokens}")
            print(f"Average tokens per chunk: {total_tokens // len(chunks) if chunks else 0}")
            print(f"Average rank: {avg_rank:.2f}/100")
            
            # Collect all topics
            all_topics = set()
            for chunk in chunks:
                all_topics.update(chunk.get('topics', []))
            
            print(f"\n🏷️  Unique topics extracted: {len(all_topics)}")
            print(f"Topics: {', '.join(sorted(all_topics)[:10])}")
            if len(all_topics) > 10:
                print(f"... and {len(all_topics) - 10} more")
            
            # Show top 5 chunks by rank
            print("\n🏆 Top 5 Chunks by Rank:")
            print("-"*70)
            sorted_chunks = sorted(chunks, key=lambda x: x.get('rank', 0), reverse=True)
            
            for i, chunk in enumerate(sorted_chunks[:5], 1):
                content_preview = chunk.get('content', '')[:100].replace('\n', ' ').strip()
                topics = chunk.get('topics', [])
                rank = chunk.get('rank', 0)
                tokens = chunk.get('token_count', 0)
                
                print(f"\n{i}. Rank: {rank:.2f}/100 | Tokens: {tokens}")
                print(f"   Topics: {', '.join(topics[:5])}")
                print(f"   Preview: {content_preview}...")
            
            # Show chunks by topic
            print("\n\n📚 Chunks by Topic:")
            print("-"*70)
            
            # Group chunks by topic
            topic_chunks = {}
            for chunk in chunks:
                for topic in chunk.get('topics', []):
                    if topic not in topic_chunks:
                        topic_chunks[topic]= []
                    topic_chunks[topic].append(chunk)
            
            # Show top 5 topics by chunk count
            top_topics = sorted(topic_chunks.items(), key=lambda x: len(x[1]), reverse=True)[:5]
            
            for topic, topic_chunk_list in top_topics:
                avg_topic_rank = sum(c.get('rank', 0) for c in topic_chunk_list) / len(topic_chunk_list)
                print(f"\n  • {topic}")
                print(f"    {len(topic_chunk_list)} chunks | Avg rank: {avg_topic_rank:.2f}")
            
            # Test topic search
            print("\n\n🔍 Testing Topic Search:")
            print("-"*70)
            
            search_topics = ["machine learning", "neural networks"]
            search_url = "http://localhost:8000/v1/search/topics"
            search_payload = {
                "topics": search_topics,
                "min_rank": 60.0,
                "limit": 5
            }
            
            print(f"Searching for: {', '.join(search_topics)}")
            print(f"Minimum rank: 60.0")
            
            search_response = requests.post(search_url, json=search_payload, timeout=10)
            
            if search_response.status_code == 200:
                search_data = search_response.json()
                search_results = search_data.get('chunks', [])
                total_results = search_data.get('total_results', 0)
                
                print(f"\n✅ Found {total_results} matching chunks (showing {len(search_results)}):\n")
                
                for i, result in enumerate(search_results, 1):
                    content = result.get('content', '')[:80].replace('\n', ' ')
                    rank = result.get('rank', 0)
                    topics = result.get('topics', [])
                    
                    print(f"{i}. Rank: {rank:.2f} | Topics: {', '.join(topics[:3])}")
                    print(f"   {content}...\n")
            else:
                print(f"⚠️  Search failed: {search_response.status_code}")
            
            print("\n" + "="*70)
            print("✨ Test Complete!")
            
        else:
            print(f"\n❌ Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("\n❌ Cannot connect to the service.")
        print("Make sure Docker container is running: pnpm docker:ingestion")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_full_pipeline()
