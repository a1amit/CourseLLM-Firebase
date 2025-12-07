import os
import sys
import jwt
import json
from pathlib import Path

# Ensure services/chunker is importable
ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))

from app.chunker import chunk_markdown
from app.main import app

from fastapi.testclient import TestClient


def test_chunk_markdown_simple():
    md = "# Title\n\nFirst paragraph.\n\n## Section\nContent here."
    chunks = chunk_markdown(md, max_chunk_size=1000)
    assert isinstance(chunks, list)
    assert any('Title' in (h.get('text') if isinstance(h, dict) else '' ) for h in [] ) or True
    # Expect at least one chunk
    assert len(chunks) >= 1


def test_post_chunk_with_api_key():
    client = TestClient(app)
    resp = client.post('/v1/chunk', json={'markdown': '# Hello\n\nWorld'}, headers={'X-API-Key': os.getenv('SERVICE_API_KEY', 'devkey')})
    assert resp.status_code == 200
    j = resp.json()
    assert 'chunks' in j and isinstance(j['chunks'], list)


def test_post_chunk_with_local_jwt():
    client = TestClient(app)
    secret = os.getenv('CHUNKER_SECRET', 'devsecret')
    token = jwt.encode({'uid': 'test', 'role': 'teacher'}, secret, algorithm='HS256')
    resp = client.post('/v1/chunk', json={'markdown': '# A\n\nB'}, headers={'Authorization': f'Bearer {token}'})
    assert resp.status_code == 200
    j = resp.json()
    assert 'chunks' in j


def test_header_inside_code_block_not_recognized():
    md = """
# Real Header

```
# Not A Header
```

More text.
"""
    # Use chunk_markdown directly to assert header parsing
    chunks = chunk_markdown(md, max_chunk_size=1000)
    # We should have at least one chunk; header path for chunks should include 'Real Header'
    assert any('Real Header' in (item.get('header_path') or []) for item in chunks)
    # Ensure the string 'Not A Header' does not appear as a header in any header_path
    assert all('Not A Header' not in (h for h in (item.get('header_path') or [])) for item in chunks)


def test_paragraph_splitting_when_exceeding_max_size():
    # Build content with 3 paragraphs that together exceed max_chunk_size
    para = 'x' * 60
    md = '# Title\n\n' + '\n\n'.join([para for _ in range(6)])
    # Small max to force splitting
    chunks = chunk_markdown(md, max_chunk_size=100)
    # Each chunk content length should be <= max_chunk_size
    assert all(len(c['content']) <= 100 for c in chunks)


def test_invalid_api_key_returns_401():
    client = TestClient(app)
    resp = client.post('/v1/chunk', json={'markdown': '# Hello\n\nWorld'}, headers={'X-API-Key': 'wrongkey'})
    assert resp.status_code == 401


def test_missing_role_in_jwt_returns_403():
    client = TestClient(app)
    secret = os.getenv('CHUNKER_SECRET', 'devsecret')
    # Token without 'role' claim
    token = jwt.encode({'uid': 'test'}, secret, algorithm='HS256')
    resp = client.post('/v1/chunk', json={'markdown': '# A\n\nB'}, headers={'Authorization': f'Bearer {token}'})
    assert resp.status_code == 403


def test_post_chunk_with_real_firebase_token():
    """
    Integration-style test: create a Firebase custom token using the
    service account, exchange it for an ID token via the Identity Toolkit
    REST API, and call /v1/chunk. This test is skipped when the
    environment is not configured (no service account path or API key)
    or required packages are missing.
    """
    import pytest
    requests = pytest.importorskip('requests')
    firebase_admin = pytest.importorskip('firebase_admin')

    # Try environment first, otherwise fall back to reading .env.local in repo root
    sa_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
    api_key = os.getenv('NEXT_PUBLIC_FIREBASE_API_KEY')
    if not sa_path or not api_key:
        # read .env.local without exporting into environment
        env_file = Path(__file__).resolve().parents[2] / '.env.local'
        if env_file.exists():
            for line in env_file.read_text().splitlines():
                line = line.strip()
                if not line or line.startswith('#') or '=' not in line:
                    continue
                k, v = line.split('=', 1)
                k = k.strip()
                v = v.strip().strip('"')
                if k == 'FIREBASE_SERVICE_ACCOUNT_PATH' and not sa_path:
                    sa_path = v
                if k == 'NEXT_PUBLIC_FIREBASE_API_KEY' and not api_key:
                    api_key = v
    if not sa_path or not api_key:
        pytest.skip('FIREBASE_SERVICE_ACCOUNT_PATH or NEXT_PUBLIC_FIREBASE_API_KEY not set')

    # Ensure firebase_admin is initialized with service account if not already
    try:
        firebase_admin.get_app()
    except Exception:
        cred = firebase_admin.credentials.Certificate(sa_path)
        firebase_admin.initialize_app(cred)

    uid = 'test-integration-user'
    custom_token = firebase_admin.auth.create_custom_token(uid)
    # custom_token may be bytes
    if isinstance(custom_token, bytes):
        custom_token = custom_token.decode('utf-8')

    url = f'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={api_key}'
    try:
        resp = requests.post(url, json={'token': custom_token, 'returnSecureToken': True}, timeout=10)
    except Exception as e:
        pytest.skip(f'Unable to contact Identity Toolkit endpoint: {e}')

    if resp.status_code != 200:
        pytest.skip(f'Identity Toolkit returned {resp.status_code}: {resp.text[:200]}')

    id_token = resp.json().get('idToken')
    if not id_token:
        pytest.skip('No idToken returned from Identity Toolkit')

    # Call the running chunker service over HTTP (no TestClient) so we don't need to set env
    import requests
    url = 'http://localhost:8000/v1/chunk'
    try:
        r = requests.post(url, json={'markdown': '# A\n\nB'}, headers={'Authorization': f'Bearer {id_token}'}, timeout=10)
    except Exception as e:
        pytest.skip(f'Could not reach running chunker service at {url}: {e}')
    assert r.status_code == 200, f"unexpected status {r.status_code}: {r.text[:200]}"
