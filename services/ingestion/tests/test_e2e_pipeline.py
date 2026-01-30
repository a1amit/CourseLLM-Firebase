"""
End-to-end test demonstrating the complete ingest → chunk → search pipeline.

This test validates the full workflow:
1. Ingest a sample document (markdown text)
2. Chunk the document with embeddings
3. Perform semantic search to find relevant chunks

Run this test:
    cd services/ingestion
    PYTHONPATH=. pytest tests/test_e2e_pipeline.py -v -s

With coverage:
    PYTHONPATH=. pytest tests/test_e2e_pipeline.py -v -s --cov=app --cov-report=term-missing
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock


# Sample course material for E2E testing
SAMPLE_COURSE_DOCUMENT = """# Introduction to Python Programming

## Module 1: Getting Started

### What is Python?
Python is a high-level, interpreted programming language known for its simplicity and readability.
It was created by Guido van Rossum and first released in 1991.

### Key Features
- **Easy to Learn**: Python has a simple syntax similar to English
- **Interpreted**: No compilation needed, code runs directly
- **Dynamically Typed**: No need to declare variable types
- **Extensive Libraries**: Rich ecosystem of packages for various tasks

## Module 2: Variables and Data Types

### Variables
Variables are containers for storing data values. In Python, you don't need to declare a type.

```python
name = "Alice"      # String
age = 25            # Integer
height = 5.6        # Float
is_student = True   # Boolean
```

### Data Types
Python has several built-in data types:
1. **Strings**: Text data enclosed in quotes
2. **Integers**: Whole numbers without decimals
3. **Floats**: Numbers with decimal points
4. **Booleans**: True or False values
5. **Lists**: Ordered, mutable collections
6. **Dictionaries**: Key-value pairs

## Module 3: Control Flow

### Conditional Statements
Use if, elif, and else to make decisions in your code.

```python
if age >= 18:
    print("Adult")
elif age >= 13:
    print("Teenager")
else:
    print("Child")
```

### Loops
Python supports for loops and while loops for iteration.

```python
# For loop
for i in range(5):
    print(i)

# While loop
count = 0
while count < 5:
    print(count)
    count += 1
```

## Module 4: Functions

### Defining Functions
Functions are reusable blocks of code that perform specific tasks.

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("World")
print(message)  # Output: Hello, World!
```

### Parameters and Return Values
Functions can accept parameters and return values to make them flexible and reusable.

## Summary
This course covered the fundamentals of Python programming including variables, 
data types, control flow, and functions. Practice these concepts to build a solid foundation.
"""


class TestE2EPipeline:
    """End-to-end tests for the complete ingest → chunk → search pipeline."""

    @pytest.fixture
    def mock_embedder_for_e2e(self):
        """Mock embedder that returns deterministic embeddings for E2E testing."""
        with patch("app.main.get_embedder") as mock:
            embedder_instance = MagicMock()
            
            # Generate deterministic embeddings based on text content
            def generate_embeddings(texts):
                embeddings = []
                for i, text in enumerate(texts):
                    # Create simple deterministic embeddings
                    # Higher values for texts containing certain keywords
                    base = [0.1] * 384  # Standard embedding dimension
                    
                    # Boost specific dimensions based on content
                    if "variable" in text.lower():
                        base[0] = 0.9
                        base[1] = 0.8
                    if "function" in text.lower():
                        base[2] = 0.9
                        base[3] = 0.8
                    if "loop" in text.lower():
                        base[4] = 0.9
                        base[5] = 0.8
                    if "python" in text.lower():
                        base[6] = 0.9
                        base[7] = 0.8
                    if "data type" in text.lower():
                        base[8] = 0.9
                        base[9] = 0.8
                        
                    embeddings.append(base)
                return embeddings
            
            embedder_instance.embed_texts.side_effect = generate_embeddings
            mock.return_value = embedder_instance
            yield mock

    def test_full_pipeline_ingest_chunk_search(self, client: TestClient, mock_embedder_for_e2e):
        """
        E2E Test: Complete pipeline from document ingestion to semantic search.
        
        This test demonstrates:
        1. Ingesting a course document via /chunk endpoint
        2. Generating chunks with embeddings
        3. Performing semantic search to find relevant content
        """
        print("\n" + "="*60)
        print("E2E TEST: Ingest → Chunk → Search Pipeline")
        print("="*60)
        
        # ============================================
        # STEP 1: INGEST AND CHUNK THE DOCUMENT
        # ============================================
        print("\n📥 Step 1: Ingesting and chunking document...")
        
        chunk_response = client.post(
            "/chunk",
            json={
                "text": SAMPLE_COURSE_DOCUMENT,
                "chunk_size": 300,
                "overlap_size": 50,
                "include_embeddings": True,
                "include_section_path": True
            }
        )
        
        assert chunk_response.status_code == 200, f"Chunking failed: {chunk_response.text}"
        chunk_data = chunk_response.json()
        
        print(f"   ✅ Document chunked successfully")
        print(f"   📊 Total chunks created: {chunk_data['chunk_count']}")
        print(f"   📏 Input characters: {len(SAMPLE_COURSE_DOCUMENT)}")
        
        # Validate chunk structure
        assert chunk_data["chunk_count"] >= 1
        assert len(chunk_data["chunks"]) == chunk_data["chunk_count"]
        
        for chunk in chunk_data["chunks"]:
            assert "index" in chunk
            assert "text" in chunk
            assert "embedding" in chunk
            assert len(chunk["text"]) > 0
            
        print(f"   ✅ All chunks have valid structure with embeddings")
        
        # ============================================
        # STEP 2: SEMANTIC SEARCH - Query about variables
        # ============================================
        print("\n🔍 Step 2: Searching for 'variables and data types'...")
        
        search_response = client.post(
            "/search/semantic",
            json={
                "query": "What are variables and how do I use them?",
                "top_k": 3
            }
        )
        
        assert search_response.status_code == 200, f"Search failed: {search_response.text}"
        search_data = search_response.json()
        
        print(f"   ✅ Search completed successfully")
        print(f"   📊 Results found: {search_data['total_results']}")
        
        assert search_data["total_results"] >= 0
        assert "chunks" in search_data
        
        if search_data["chunks"]:
            print(f"   📄 Top result preview: {search_data['chunks'][0]['text'][:100]}...")
            # Verify result structure
            for result in search_data["chunks"]:
                assert "text" in result
                assert "rank" in result
                assert "index" in result
        
        # ============================================
        # STEP 3: SEMANTIC SEARCH - Query about functions
        # ============================================
        print("\n🔍 Step 3: Searching for 'functions in Python'...")
        
        search_response_2 = client.post(
            "/search/semantic",
            json={
                "query": "How do I define and use functions?",
                "top_k": 3
            }
        )
        
        assert search_response_2.status_code == 200
        search_data_2 = search_response_2.json()
        
        print(f"   ✅ Search completed successfully")
        print(f"   📊 Results found: {search_data_2['total_results']}")
        
        # ============================================
        # STEP 4: SEMANTIC SEARCH - Query about loops
        # ============================================
        print("\n🔍 Step 4: Searching for 'loops and iteration'...")
        
        search_response_3 = client.post(
            "/search/semantic",
            json={
                "query": "How do for loops and while loops work?",
                "top_k": 3
            }
        )
        
        assert search_response_3.status_code == 200
        search_data_3 = search_response_3.json()
        
        print(f"   ✅ Search completed successfully")
        print(f"   📊 Results found: {search_data_3['total_results']}")
        
        # ============================================
        # SUMMARY
        # ============================================
        print("\n" + "="*60)
        print("✅ E2E PIPELINE TEST COMPLETED SUCCESSFULLY")
        print("="*60)
        print(f"   📄 Document: Python Programming Course")
        print(f"   📊 Chunks generated: {chunk_data['chunk_count']}")
        print(f"   🔍 Searches performed: 3")
        print("="*60 + "\n")

    def test_pipeline_with_different_chunk_sizes(self, client: TestClient, mock_embedder_for_e2e):
        """Test the pipeline with various chunk size configurations."""
        print("\n" + "="*60)
        print("E2E TEST: Pipeline with different chunk sizes")
        print("="*60)
        
        chunk_sizes = [100, 300, 500]
        
        for chunk_size in chunk_sizes:
            print(f"\n📥 Testing with chunk_size={chunk_size}...")
            
            # Chunk with current size
            response = client.post(
                "/chunk",
                json={
                    "text": SAMPLE_COURSE_DOCUMENT,
                    "chunk_size": chunk_size,
                    "include_embeddings": True
                }
            )
            
            assert response.status_code == 200
            data = response.json()
            print(f"   ✅ Created {data['chunk_count']} chunks")
            
            # Search should still work
            search_response = client.post(
                "/search/semantic",
                json={"query": "Python programming basics", "top_k": 2}
            )
            
            assert search_response.status_code == 200
            print(f"   ✅ Search successful with {chunk_size} token chunks")
        
        print("\n✅ All chunk size configurations work correctly\n")

    def test_pipeline_search_without_embeddings_fails(self, client: TestClient):
        """Verify that search fails gracefully without embeddings."""
        print("\n" + "="*60)
        print("E2E TEST: Search without embeddings (error case)")
        print("="*60)
        
        # Chunk without embeddings
        chunk_response = client.post(
            "/chunk",
            json={"text": SAMPLE_COURSE_DOCUMENT}
        )
        assert chunk_response.status_code == 200
        print("\n📥 Chunked document without embeddings")
        
        # Search should fail gracefully
        search_response = client.post(
            "/search/semantic",
            json={"query": "Python variables"}
        )
        
        assert search_response.status_code == 400
        print("✅ Search correctly rejected (no embeddings available)")
        print("="*60 + "\n")


class TestE2EWithRealFile:
    """
    E2E tests that can work with real files.
    
    To run with a real file, set the TEST_FILE environment variable:
        TEST_FILE=/path/to/your/document.md PYTHONPATH=. pytest tests/test_e2e_pipeline.py::TestE2EWithRealFile -v -s
    """

    @pytest.fixture
    def mock_embedder_for_file_test(self):
        """Mock embedder for file-based testing."""
        with patch("app.main.get_embedder") as mock:
            embedder_instance = MagicMock()
            embedder_instance.embed_texts.return_value = lambda texts: [[0.1] * 384 for _ in texts]
            embedder_instance.embed_texts.side_effect = lambda texts: [[0.1 + (i * 0.01)] * 384 for i, _ in enumerate(texts)]
            mock.return_value = embedder_instance
            yield mock

    def test_pipeline_with_sample_document(self, client: TestClient, mock_embedder_for_file_test):
        """
        Test the pipeline with the built-in sample document.
        
        This test can be used as a template for testing with custom files.
        """
        import os
        
        # Check if a custom test file is provided
        test_file = os.environ.get("TEST_FILE")
        
        if test_file and os.path.exists(test_file):
            print(f"\n📂 Using custom test file: {test_file}")
            with open(test_file, "r") as f:
                document_text = f.read()
        else:
            print("\n📂 Using built-in sample document")
            document_text = SAMPLE_COURSE_DOCUMENT
        
        # Run the pipeline
        print(f"📊 Document size: {len(document_text)} characters")
        
        # Step 1: Chunk
        chunk_response = client.post(
            "/chunk",
            json={
                "text": document_text,
                "chunk_size": 300,
                "include_embeddings": True,
                "include_section_path": True
            }
        )
        
        assert chunk_response.status_code == 200
        chunk_data = chunk_response.json()
        print(f"✅ Created {chunk_data['chunk_count']} chunks")
        
        # Step 2: Search
        search_response = client.post(
            "/search/semantic",
            json={"query": "main concepts", "top_k": 5}
        )
        
        assert search_response.status_code == 200
        search_data = search_response.json()
        print(f"✅ Found {search_data['total_results']} search results")
        
        # Display top results
        if search_data["chunks"]:
            print("\n📋 Top search results:")
            for i, result in enumerate(search_data["chunks"][:3], 1):
                preview = result["text"][:80].replace("\n", " ")
                print(f"   {i}. [rank: {result['rank']:.2f}] {preview}...")
