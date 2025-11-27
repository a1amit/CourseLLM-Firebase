# Microservices Architecture Guide

This document describes the microservices architecture implementation for CourseLLM and how authentication is integrated across services.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Frontend Layer                            │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    Next.js Web Application                       ││
│  │         (Firebase Hosting / Vercel / Cloud Run)                  ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼ (Bearer Token)
┌─────────────────────────────────────────────────────────────────────┐
│                         API Gateway Layer                           │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    Next.js API Routes                            ││
│  │  (Authentication Middleware + Request Routing)                   ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Microservices Layer                            │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────────────┐│
│  │ Socratic  │ │Assessment │ │ Indexing  │ │ Future Services...    ││
│  │ Chat API  │ │   API     │ │   API     │ │ (Search, Analytics)   ││
│  │/api/chat/ │ │/api/      │ │/api/      │ │                       ││
│  │ socratic  │ │assessment/│ │indexing/  │ │                       ││
│  └───────────┘ └───────────┘ └───────────┘ └───────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Data & AI Layer                              │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                          │
│  │ Firestore │ │Google AI  │ │ Firebase  │                          │
│  │ Database  │ │(Gemini)   │ │   Auth    │                          │
│  └───────────┘ └───────────┘ └───────────┘                          │
└─────────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

### 1. Client-Side Authentication (Firebase Auth)

Users authenticate using Firebase Authentication on the client side:

```typescript
// src/lib/firebase.ts
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

### 2. Authenticated API Calls

The client uses the `api-client.ts` utility to make authenticated requests:

```typescript
// src/lib/api-client.ts
export async function authenticatedFetch(endpoint: string, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  
  const idToken = await user.getIdToken();
  
  return fetch(endpoint, {
    ...options,
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
  });
}
```

### 3. Server-Side Token Verification

API routes verify the Firebase ID token using the Admin SDK:

```typescript
// src/lib/server-auth.ts
export async function verifyAuthToken(idToken: string) {
  const adm = getFirebaseAdmin();
  const decodedToken = await adm.auth().verifyIdToken(idToken);
  
  // Fetch user profile for role-based authorization
  const db = adm.firestore();
  const userDoc = await db.doc(`users/${decodedToken.uid}`).get();
  const userData = userDoc.data();
  
  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    role: userData?.role,
    displayName: decodedToken.name || userData?.displayName,
  };
}
```

## API Endpoints

### Chat Service - Socratic Tutor

**Endpoint:** `POST /api/chat/socratic`

**Authorization:** Students only

**Request:**
```json
{
  "courseMaterial": "string - The course content",
  "studentQuestion": "string - The student's question"
}
```

**Response:**
```json
{
  "response": "string - The AI-generated Socratic response"
}
```

### Assessment Service - Personalized Learning

**Endpoint:** `POST /api/assessment/personalized`

**Authorization:** Students only

**Request:**
```json
{
  "studentLearningPath": "string",
  "courseContent": "string",
  "studentQuestionsAndAnswers": "string",
  "learningObjectives": "string"
}
```

**Response:**
```json
{
  "assessment": "string",
  "suggestedAreasForImprovement": "string"
}
```

### Indexing Service - Course Material

**Endpoint:** `POST /api/indexing/course-material`

**Authorization:** Teachers only

**Request:**
```json
{
  "courseId": "string",
  "documentTitle": "string",
  "markdownContent": "string"
}
```

**Response:**
```json
{
  "chunksCreated": "number",
  "enrichedChunks": [
    {
      "id": "string",
      "content": "string",
      "embedding": "number[]",
      "metadata": {
        "headerPath": "string[]",
        "summary": "string",
        "keywords": "string[]",
        "questions": "string[]"
      }
    }
  ]
}
```

## Environment Variables

### Required for Production

```env
# Firebase Client SDK (exposed to browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server-side only)
# Option 1: JSON string
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
# Option 2: File path
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-admin.json

# Google AI API Key
GOOGLE_API_KEY=
```

### Test-Only Variables

```env
# Enable test authentication (NEVER in production!)
ENABLE_TEST_AUTH=false
```

## Role-Based Access Control

| Service | Students | Teachers |
|---------|----------|----------|
| Socratic Chat | ✅ | ❌ |
| Personalized Assessment | ✅ | ❌ |
| Course Material Indexing | ❌ | ✅ |

## Error Handling

All API endpoints return consistent error responses:

| Status Code | Error Type |
|-------------|------------|
| 401 | Missing/invalid/expired token |
| 403 | Insufficient permissions (role) |
| 400 | Invalid request body |
| 500 | Internal server error |

Example error response:
```json
{
  "error": "Access denied. Required role: teacher"
}
```

## Future Microservices Expansion

When you need to scale individual services independently, you can extract them into separate deployable units:

### Recommended Service Boundaries

1. **Auth Service** - User authentication, profile management
2. **Chat Service** - Socratic tutoring, conversation management
3. **Assessment Service** - Quiz generation, personalized assessments
4. **Indexing Service** - Content chunking, embedding generation
5. **Search Service** - Full-text and semantic search
6. **Analytics Service** - Usage tracking, learning analytics

### Deployment Options

- **Google Cloud Run** - Containerized microservices with auto-scaling
- **Firebase Functions** - Serverless functions for lighter workloads
- **Kubernetes (GKE)** - Full orchestration for complex deployments

### Service-to-Service Authentication

For internal service communication, use:
- Google Cloud IAM for Cloud Run
- Service account tokens for Firebase Functions
- Kubernetes service accounts for GKE

## Local Development

1. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Firebase config
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Test authentication:
   ```bash
   # Enable test auth for development
   ENABLE_TEST_AUTH=true npm run dev
   ```

## Testing Authentication

Use the test token endpoint for E2E tests:

```typescript
// Get a test token for a student
const response = await fetch('/api/test-token?uid=test-student&role=student');
const { token } = await response.json();

// Sign in with the custom token
await signInWithCustomToken(auth, token);
```

