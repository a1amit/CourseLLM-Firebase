from fastapi import Header, HTTPException, Security, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer, APIKeyHeader
from typing import Optional

from .config import (
    CHUNKER_SECRET,
    SERVICE_API_KEY,
    FIREBASE_SERVICE_ACCOUNT_PATH,
    FIREBASE_SERVICE_ACCOUNT_JSON,
    ENABLE_TEST_AUTH,
)
import os
from pathlib import Path
import json

# Use firebase-admin to verify Firebase ID tokens issued by the project's Auth service.
try:
    import firebase_admin
    from firebase_admin import auth as firebase_auth
    from firebase_admin import credentials as firebase_credentials
    _FIREBASE_AVAILABLE = True
    # Try to initialize the admin SDK with default credentials if not already initialized.
    try:
        firebase_admin.get_app()
    except Exception:
        # Attempt to initialize using explicit service account settings if provided in env.
        # Prefer an explicit path or JSON string over ADC to make local configuration deterministic.
        sa_path = FIREBASE_SERVICE_ACCOUNT_PATH or os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
        sa_json = FIREBASE_SERVICE_ACCOUNT_JSON or os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')
        # Allow relative paths in .env.local to resolve from repo root
        if sa_path and not Path(sa_path).is_absolute():
            sa_path = str(Path(__file__).resolve().parents[3] / sa_path)
        try:
            if sa_path:
                cred = firebase_credentials.Certificate(sa_path)
                firebase_admin.initialize_app(cred)
            elif sa_json:
                # service account JSON provided as string (useful for CI)
                cred_dict = json.loads(sa_json)
                cred = firebase_credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
            else:
                # Fallback to default initialization (ADC) if available in environment
                firebase_admin.initialize_app()
        except Exception:
            # Initialization may fail if no ADC or credentials provided; keep available flag but
            # verification will raise an informative error at runtime.
            pass
except Exception:
    firebase_admin = None
    firebase_auth = None
    _FIREBASE_AVAILABLE = False

bearer_scheme = HTTPBearer()
api_key_scheme = APIKeyHeader(name='X-API-Key', auto_error=False)


def verify_service_api_key(x_api_key: Optional[str] = Security(api_key_scheme)) -> bool:
    if x_api_key and x_api_key == SERVICE_API_KEY:
        return True
    return False


def _verify_firebase_token(id_token: str) -> dict:
    if not _FIREBASE_AVAILABLE:
        raise HTTPException(status_code=500, detail='Server not configured to verify Firebase tokens')
    try:
        # This will raise if invalid
        decoded = firebase_auth.verify_id_token(id_token)
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail=f'Invalid Firebase token: {e}')


def _verify_local_jwt(token: str) -> dict:
    # Lightweight fallback for development/testing using local HS256 secret
    import jwt
    try:
        payload = jwt.decode(token, CHUNKER_SECRET, algorithms=['HS256'])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail='Invalid authentication token')


def verify_bearer_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    token = credentials.credentials

    # Allow an explicit test-mode override to force local HS256 verification.
    # This is useful for unit tests and local development when the Admin SDK
    # may be importable but not configured with credentials.
    if os.getenv('ENABLE_TEST_AUTH', 'false').lower() in ('1', 'true', 'yes'):
        return _verify_local_jwt(token)

    # Try Firebase verification first (preferred in production) if available.
    if _FIREBASE_AVAILABLE:
        try:
            return _verify_firebase_token(token)
        except Exception:
            # If Firebase verification fails and a local secret is configured,
            # fall back to local HS256 verification to aid testing/development.
            if CHUNKER_SECRET:
                return _verify_local_jwt(token)
            raise

    # Otherwise fall back to local HS256 verification
    return _verify_local_jwt(token)


def require_authenticated_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> dict:
    payload = verify_bearer_token(credentials)
    # The Firebase ID token may not include a 'role' claim by default. We expect the
    # authentication service to include a custom claim 'role' or the caller to include
    # role information in a separate user profile lookup.
    role = payload.get('role')
    if not role:
        # For clarity, return payload but raise a 403 if role is required by the endpoint.
        raise HTTPException(status_code=403, detail='User role not present in token')
    return payload
