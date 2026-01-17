# Cloud Deployment: Secret Manager Setup

This guide explains how to configure Google Cloud Secret Manager for production deployments.

## Overview

| Environment | Secrets Location | How Accessed |
|-------------|------------------|--------------|
| **Local Dev** | `.env.local` file | Loaded by Next.js |
| **Production** | Google Secret Manager | Injected as env vars by Cloud Run / App Hosting |

## Prerequisites

1. [Install Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
2. Initialize and authenticate:
   ```bash
   gcloud init
   gcloud auth login
   ```

## Step 1: Enable Secret Manager API

```bash
gcloud services enable secretmanager.googleapis.com
```

## Step 2: Create Secrets

### GOOGLE_API_KEY (for Gemini/Genkit)

```bash
# Option 1: From command line (interactive)
read -s API_KEY  # Type your key, press Enter
echo -n "$API_KEY" | gcloud secrets create google-api-key --data-file=-

# Option 2: From a file
echo -n "your-api-key-here" > /tmp/api-key.txt
gcloud secrets create google-api-key --data-file=/tmp/api-key.txt
rm /tmp/api-key.txt  # Clean up!

# PowerShell equivalent
$apiKey = Read-Host -AsSecureString "Enter API Key"
[Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)) | gcloud secrets create google-api-key --data-file=-
```

### Firebase Service Account (if needed)

```bash
gcloud secrets create firebase-service-account --data-file=path/to/service-account.json
```

## Step 3: Grant Cloud Run Access

```bash
# Get your project number
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

# Grant access to the default compute service account
gcloud secrets add-iam-policy-binding google-api-key \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Step 4: Configure App Hosting

The `apphosting.yaml` is already configured to use Secret Manager:

```yaml
env:
  # Secrets from Google Secret Manager
  - variable: GOOGLE_API_KEY
    secret: google-api-key
```

Firebase App Hosting automatically:
1. Reads the secret from Secret Manager at deploy time
2. Injects it as an environment variable into your app

## Step 5: Deploy

```bash
# Deploy to Firebase App Hosting
firebase apphosting:backends:create

# Or if already set up
firebase deploy --only hosting
```

## Managing Secrets

### View existing secrets
```bash
gcloud secrets list
```

### View secret versions
```bash
gcloud secrets versions list google-api-key
```

### Update a secret (add new version)
```bash
echo -n "new-api-key-value" | gcloud secrets versions add google-api-key --data-file=-
```

### Access a secret value (for debugging)
```bash
gcloud secrets versions access latest --secret=google-api-key
```

### Delete a secret
```bash
gcloud secrets delete google-api-key
```

## Security Best Practices

1. **Never commit secrets** to Git (`.env.local` is gitignored)
2. **Use IAM** instead of API keys when possible (e.g., Vertex AI)
3. **Rotate secrets** regularly using Secret Manager versions
4. **Limit access** - only grant `secretAccessor` to services that need it
5. **Audit access** - Secret Manager logs all access in Cloud Audit Logs

## Troubleshooting

### "Permission denied" accessing secret
```bash
# Check IAM policy
gcloud secrets get-iam-policy google-api-key

# Grant access
gcloud secrets add-iam-policy-binding google-api-key \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"
```

### Secret not available in Cloud Run
- Verify the secret exists: `gcloud secrets describe google-api-key`
- Check service account has access (see above)
- Ensure `apphosting.yaml` references the correct secret name

## Environment-Specific Config Summary

| Variable | Local Dev | Production |
|----------|-----------|------------|
| `NEXT_PUBLIC_USE_FIREBASE_EMULATORS` | `true` | `false` |
| `GOOGLE_API_KEY` | `.env.local` | Secret Manager |
| `NEXT_PUBLIC_FIREBASE_*` | `.env.local` | `apphosting.yaml` env |
