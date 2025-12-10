from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from .schemas import ChunkRequest, ChunkResponse, HealthResponse
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
    
    Optionally generates embeddings for each chunk.
    
    This endpoint is publicly accessible for development and testing purposes.
    For production, consider adding authentication or rate limiting.
    """
    max_size = request.max_chunk_size if request.max_chunk_size is not None else DEFAULT_MAX_CHUNK_SIZE
    strategy = request.strategy if request.strategy else "recursive"
    tokenizer = request.tokenizer if request.tokenizer else "gpt2"

    # Generate chunks
    chunks = chunk_markdown(
        request.markdown,
        strategy=strategy,
        max_chunk_size=max_size,
        tokenizer=tokenizer
    )
    
    # Optionally generate embeddings
    if request.generate_embeddings:
        try:
            from .embeddings import get_embedding_generator
            
            provider = request.embedding_provider if request.embedding_provider else "sentence-transformers"
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
    
    return {'chunks': chunks}


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
