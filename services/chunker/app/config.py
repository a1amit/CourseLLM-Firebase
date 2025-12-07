from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Local Chunker service settings
    CHUNKER_SECRET: str = Field('devsecret', description='HS256 secret used for local/dev JWTs')
    SERVICE_API_KEY: str = Field('devkey', description='Service-to-service API key (dev only)')
    MAX_CHUNK_SIZE: int = Field(1000, description='Default max chunk characters')

    # Firebase admin credentials (server-side)
    FIREBASE_SERVICE_ACCOUNT_PATH: Optional[str] = Field(None, description='Path to service account JSON')
    FIREBASE_SERVICE_ACCOUNT_JSON: Optional[str] = Field(None, description='Service account JSON string (CI)')

    # Test auth flag (dev/test only)
    ENABLE_TEST_AUTH: bool = Field(False, description='When true prefer local HS256 verification')

    # Exposed in .env.local for convenience
    NEXT_PUBLIC_FIREBASE_API_KEY: Optional[str] = None

    class Config:
        env_file = '.env.local'
        env_file_encoding = 'utf-8'


settings = Settings()

# Backwards-compatible module-level constants
CHUNKER_SECRET = settings.CHUNKER_SECRET
SERVICE_API_KEY = settings.SERVICE_API_KEY
DEFAULT_MAX_CHUNK_SIZE = settings.MAX_CHUNK_SIZE
FIREBASE_SERVICE_ACCOUNT_PATH = settings.FIREBASE_SERVICE_ACCOUNT_PATH
FIREBASE_SERVICE_ACCOUNT_JSON = settings.FIREBASE_SERVICE_ACCOUNT_JSON
ENABLE_TEST_AUTH = settings.ENABLE_TEST_AUTH
NEXT_PUBLIC_FIREBASE_API_KEY = settings.NEXT_PUBLIC_FIREBASE_API_KEY
