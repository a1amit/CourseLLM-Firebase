# Using Vertex AI Embeddings

## Setup Instructions

To use Vertex AI embeddings (Google's production embedding service), follow these steps:

### 1. Install Dependencies

Already installed:
```bash
pip install google-genai
```

### 2. Set Environment Variables

You need to configure the google-genai SDK to use Vertex AI:

**Windows (PowerShell):**
```powershell
$env:GOOGLE_CLOUD_PROJECT = "your-gcp-project-id"
$env:GOOGLE_CLOUD_LOCATION = "global"
$env:GOOGLE_GENAI_USE_VERTEXAI = "True"
```

**Linux/Mac:**
```bash
export GOOGLE_CLOUD_PROJECT="your-gcp-project-id"
export GOOGLE_CLOUD_LOCATION="global"
export GOOGLE_GENAI_USE_VERTEXAI=True
```

### 3. Authenticate

**Option A: Application Default Credentials (Recommended)**
```bash
gcloud auth application-default login
```

**Option B: Service Account**
```bash
$env:GOOGLE_APPLICATION_CREDENTIALS = "path/to/service-account-key.json"
```

### 4. Enable Vertex AI API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Enable **Vertex AI API**

---

## Testing Vertex AI Embeddings

### Via API Request

```bash
curl -X POST http://localhost:8000/v1/chunk \
  -H "Content-Type: application/json" \
  -d '{
    "markdown": "Machine learning is amazing!",
    "generate_embeddings": true,
    "embedding_provider": "vertex-ai"
  }'
```

### Via Frontend

1. Go to `http://localhost:9002/debug/chunking`
2. Check "Generate embeddings"
3. In the request, you can't currently select the provider from UI (defaults to sentence-transformers)

**Note:** To test Vertex AI from the UI, you'd need to add a dropdown for provider selection.

---

## Model Comparison

| Provider | Model | Dimensions | Cost | Setup |
|----------|-------|-----------|------|-------|
| **sentence-transformers** | all-MiniLM-L6-v2 | 384 | Free | ✅ None |
| **Vertex AI** | gemini-embedding-001 | 768* | ~$0.025/1K | Cloud setup required |

*configurable from 256-3072

---

## Using in Production

For production, use Vertex AI:

```python
# In your API request
{
  "markdown": "...",
  "generate_embeddings": true,
  "embedding_provider": "vertex-ai",
  "embedding_model": "gemini-embedding-001"
}
```

The API will automatically use 768 dimensions for storage efficiency. You can change this by modifying the code to accept `output_dimensionality` parameter.

---

## Troubleshooting

**Error: "google-genai not installed"**
- Run: `pip install google-genai`

**Error: "Could not authenticate"**
- Run: `gcloud auth application-default login`
- Or set `GOOGLE_APPLICATION_CREDENTIALS`

**Error: "Project ID not found"**
- Set `GOOGLE_CLOUD_PROJECT` environment variable

**Error: "Vertex AI API not enabled"**
- Enable it in Google Cloud Console

---

## Next Steps

To make this production-ready:
1. Add UI dropdown to select provider
2. Store environment variables in `.env` file
2.1 update the .env.example file accordingly
3. Add retry logic for API failures
4. Implement cost monitoring
