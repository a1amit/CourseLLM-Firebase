from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from .schemas import ChunkRequest, ChunkResponse, HealthResponse, TopicSearchRequest, TopicSearchResponse
from .chunker import chunk_markdown
from .config import DEFAULT_MAX_CHUNK_SIZE
from .auth import verify_service_api_key, require_authenticated_user

app = FastAPI(title='Chunker Service', version='0.1.0')

# Configure CORS to allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:9002",  # Next.js dev server
        "http://localhost:3000",  # Alternative Next.js port
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define allowed user roles for accessing the chunking endpoint
ALLOWED_USER_ROLES = {'teacher', 'admin'}


def auth_dependency(authorization: Optional[str] = Header(None), x_api_key: Optional[str] = Header(None)):
    """Authenticate either via service API key or via user bearer token.

    RBAC policy: If caller uses service API key, allow. If caller authenticates with a user token,
    require that the token contains a role claim in `ALLOWED_USER_ROLES`.
    """
    # If service key present and valid, allow (service-to-service calls)
    if x_api_key:
        if verify_service_api_key(x_api_key):
            return {'service': True}
        else:
            raise HTTPException(status_code=401, detail='Invalid service API key')

    # Otherwise require user token
    if authorization:
        # Adapter: extract token from header value
        token = authorization.split('Bearer ')[-1]
        creds = HTTPAuthorizationCredentials(scheme='Bearer', credentials=token)
        payload = require_authenticated_user(creds)

        role = payload.get('role')
        if role not in ALLOWED_USER_ROLES:
            raise HTTPException(status_code=403, detail='Insufficient role for this operation')
        return payload

    raise HTTPException(status_code=401, detail='Missing authentication')


@app.get('/v1/health', response_model=HealthResponse, summary='Health check')
def health():
    return {'status': 'ok'}


@app.post('/v1/chunk', response_model=ChunkResponse, summary='Chunk Markdown')
def chunk_endpoint(request: ChunkRequest):
    """
    Public endpoint for chunking markdown text.
    
    Optionally generates embeddings, extracts topics, and ranks chunks.
    
    This endpoint is publicly accessible for development and testing purposes.
    For production, consider adding authentication or rate limiting.
    """
    max_size = request.max_chunk_size if request.max_chunk_size is not None else DEFAULT_MAX_CHUNK_SIZE
    strategy = request.strategy if request.strategy else "semantic"
    tokenizer = request.tokenizer if request.tokenizer else "gpt2"
    overlap = request.overlap if request.overlap is not None else 0

    # Generate chunks with optional overlap and embeddings (if native provider)
    chunks = chunk_markdown(
        request.markdown,
        strategy=strategy,
        max_chunk_size=max_size,
        tokenizer=tokenizer,
        overlap=overlap,
        generate_embeddings=request.generate_embeddings,
        embedding_provider=request.embedding_provider,
        embedding_model=request.embedding_model,
        similarity_threshold=request.similarity_threshold,
        min_sentences_per_chunk=request.min_sentences_per_chunk
    )
    
    # Extract topics if requested
    if request.extract_topics:
        try:
            from .topic_extractor import extract_topics_from_chunks
            
            chunks = extract_topics_from_chunks(chunks, max_topics=5)
        except ImportError as error:
            if "google-genai" in str(error):
                error_msg = "Topic extraction requires google-genai SDK. Install with: pip install google-genai"
                raise HTTPException(status_code=400, detail=error_msg)
            else:
                error_msg = f"Missing dependency for topic extraction: {str(error)}"
                raise HTTPException(status_code=400, detail=error_msg)
        except Exception as error:
            # Log warning but continue without topics
            print(f"Warning: Topic extraction failed: {error}")
            # Set empty topics for all chunks
            for chunk in chunks:
                chunk['topics'] = []
    
    # Rank content if requested
    if request.rank_content:
        try:
            from .ranker import rank_chunks
            
            chunks = rank_chunks(chunks, document_title=request.document_title)
        except Exception as error:
            # Log warning but continue without ranking
            print(f"Warning: Content ranking failed: {error}")
            # Set default rank for all chunks
            for chunk in chunks:
                chunk['rank'] = 0.0
    
    # Generate embeddings if requested and NOT already done by pipeline
    # (The pipeline handles sentence-transformers natively now)
    if request.generate_embeddings:
        # Check if first chunk already has embedding
        has_embeddings = len(chunks) > 0 and 'embedding' in chunks[0]
        
        if not has_embeddings:
            # Fallback for non-native providers (e.g. Vertex AI)
            try:
                from .embeddings import get_embedding_generator
                
                provider = request.embedding_provider if request.embedding_provider else "sentence-transformers"
                
                # If provider is sentence-transformers but we are here, it means
                # Chonkie pipeline failed to load it or it wasn't used. 
                # We can try manual generation or skip.
                
                model_name = request.embedding_model
                
                # Auto-select default model based on provider
                if not model_name:
                    if provider == "vertex-ai":
                        model_name = "gemini-embedding-001"
                    else:
                        model_name = "all-MiniLM-L6-v2"
                
                # Get the appropriate generator
                generator = get_embedding_generator(
                    provider=provider,
                    model_name=model_name
                )
                
                chunks = generator.generate_chunk_embeddings(chunks)
            except ImportError as error:
                # Library not installed
                if "google-genai" in str(error):
                    error_msg = "Vertex AI requires google-genai SDK. Install with: pip install google-genai"
                elif "sentence-transformers" in str(error):
                    error_msg = "Sentence Transformers requires installation. Run: pip install sentence-transformers"
                else:
                    error_msg = f"Missing dependency: {str(error)}"
                
                raise HTTPException(status_code=400, detail=error_msg)
            
            except Exception as error:
                error_str = str(error)
                
                # Check for common Vertex AI credential errors
                if "GOOGLE_CLOUD_PROJECT" in error_str or "project" in error_str.lower():
                    raise HTTPException(
                        status_code=401,
                        detail="Vertex AI credentials not configured. Please set GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION, and GOOGLE_GENAI_USE_VERTEXAI=True environment variables, or run: gcloud auth application-default login"
                    )
                elif "credentials" in error_str.lower() or "authentication" in error_str.lower():
                    raise HTTPException(
                        status_code=401,
                        detail="Vertex AI authentication failed. Run: gcloud auth application-default login"
                    )
                elif "api" in error_str.lower() and "enabled" in error_str.lower():
                    raise HTTPException(
                        status_code=403,
                        detail="Vertex AI API not enabled. Enable it in Google Cloud Console for your project."
                    )
                else:
                    # Generic embedding error - log it but continue without embeddings
                    print(f"Warning: Could not generate embeddings: {error}")
                    import traceback
                    traceback.print_exc()
                    raise HTTPException(
                        status_code=500,
                        detail=f"Embedding generation failed: {error_str}"
                    )
    
    # Store chunks in memory for topic search (development only)
    global _chunk_store
    _chunk_store = chunks.copy()
    
    return {'chunks': chunks}


# In-memory storage for demonstration (replace with database in production)
_chunk_store = []


@app.post('/v1/search/topics', response_model=TopicSearchResponse, summary='Search Chunks by Topics')
def search_topics_endpoint(request: TopicSearchRequest):
    """
    Search for chunks by topics and rank.
    
    Note: This is an in-memory implementation for development.
    For production, integrate with Firestore or another database.
    
    To use this endpoint:
    1. First call /v1/chunk to create chunks (they'll be stored in memory)
    2. Then call this endpoint to search by topics
    """
    search_topics_lower = [t.lower() for t in request.topics]
    
    # Filter chunks that match any of the requested topics
    matching_chunks = []
    for chunk in _chunk_store:
        chunk_topics = [t.lower() for t in chunk.get('topics', [])]
        # Check if any topic matches
        if any(search_topic in chunk_topics for search_topic in search_topics_lower):
            # Check rank threshold
            if chunk.get('rank', 0.0) >= request.min_rank:
                matching_chunks.append(chunk)
    
    # Sort by rank (descending)
    matching_chunks.sort(key=lambda x: x.get('rank', 0.0), reverse=True)
    
    # Apply limit
    limited_chunks = matching_chunks[:request.limit]
    
    return {
        'chunks': limited_chunks,
        'total_results': len(matching_chunks)
    }


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    from fastapi.openapi.utils import get_openapi

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        routes=app.routes,
    )

    # Add security schemes for bearer JWT and API Key
    openapi_schema.setdefault('components', {}).setdefault('securitySchemes', {})
    openapi_schema['components']['securitySchemes']['bearerAuth'] = {
        'type': 'http',
        'scheme': 'bearer',
        'bearerFormat': 'JWT'
    }
    openapi_schema['components']['securitySchemes']['ApiKeyAuth'] = {
        'type': 'apiKey',
        'in': 'header',
        'name': 'X-API-Key'
    }

    # Declare that /v1/chunk can be secured by either scheme (note: OpenAPI does not support OR natively,
    # but clients will be able to see the available schemes). We attach both as possible security requirements.
    for path, methods in openapi_schema.get('paths', {}).items():
        if path == '/v1/chunk':
            for method_name, method_spec in methods.items():
                method_spec.setdefault('security', [])
                method_spec['security'].append({'bearerAuth': []})
                method_spec['security'].append({'ApiKeyAuth': []})

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi
