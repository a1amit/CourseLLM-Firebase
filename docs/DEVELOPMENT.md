# CourseLLM Development Guide

Complete guide for setting up and running the CourseLLM application locally and in production.

---

## Table of Contents

1. [Quick Start (Local with Emulators)](#quick-start-local-with-emulators)
2. [Production Setup (Real Firebase)](#production-setup-real-firebase)
3. [Environment Variables Reference](#environment-variables-reference)
4. [Available Commands](#available-commands)
5. [API Endpoints](#api-endpoints)
6. [Authentication](#authentication)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)
9. [Project Structure](#project-structure)

---

## Quick Start (Local with Emulators)

**Best for**: Development, testing, learning the codebase.

**Requirements**: Node.js 18+, Java 11+ (for emulators)

**No Firebase project needed!**

### Setup

```bash
# 1. Clone and install
git clone <repository-url>
cd CourseLLM-Firebase
npm install

# 2. Start everything
npm run dev:local
```

### What's Running

| Service | URL | Description |
|---------|-----|-------------|
| App | http://localhost:9002 | Your Next.js application |
| Emulator UI | http://localhost:4000 | Firebase Emulator dashboard |
| Auth Emulator | localhost:9099 | Local authentication |
| Firestore Emulator | localhost:8080 | Local database |

### How It Works

- **No API keys needed** - Emulators run completely locally
- **No Firebase project needed** - Uses `demo-project` automatically
- **Data resets on restart** - Great for testing
- **Works offline** - No internet required

### Adding AI Features (Optional)

To use AI chat and assessments, you still need a Google AI API key:

```bash
# Create .env.local
echo "GOOGLE_API_KEY=your-api-key" > .env.local
```

Get a key from: https://aistudio.google.com/apikey

---

## Production Setup (Real Firebase)

**Best for**: Deploying to production, using real Google OAuth.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter a project name
4. Click **"Create project"**

### Step 2: Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your project support email
4. Save

### Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"**
4. Choose a location (e.g., `us-central1`)
5. Click **"Enable"**

### Step 4: Deploy Security Rules

1. Go to **Firestore Database** → **Rules**
2. Paste the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /courses/{courseId} {
      allow read: if true;
      allow write: if false;
    }

    match /departments/{deptId} {
      allow read: if true;
      allow write: if false;
    }

    match /users/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId && isValidUserProfile(request.resource.data);
      allow read: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId && isValidUserProfile(request.resource.data);
      allow delete: if false;
    }

    function isValidUserProfile(data) {
      return data.uid == request.auth.uid
        && data.email is string
        && (data.role == "student" || data.role == "teacher")
        && (data.department is string)
        && (data.courses is list)
        && data.courses.size() >= 0;
    }
  }
}
```

3. Click **"Publish"**

### Step 5: Enable Google Cloud APIs

Enable these APIs (replace `YOUR_PROJECT_ID`):

- **Firestore API**: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=YOUR_PROJECT_ID
- **Identity Toolkit API**: https://console.developers.google.com/apis/api/identitytoolkit.googleapis.com/overview?project=YOUR_PROJECT_ID

### Step 6: Get Configuration

#### Client SDK Config

1. Go to **Project settings** → **General** → **Your apps**
2. Click **Web** icon (`</>`)
3. Register app and copy the config values

#### Admin SDK Service Account

1. Go to **Project settings** → **Service accounts**
2. Click **"Generate new private key"**
3. Save as `secrets/firebase-admin.json`

### Step 7: Create Environment File

Create `.env.local`:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-admin.json

# Google AI (for AI features)
GOOGLE_API_KEY=your-google-ai-key

# Optional: Enable test authentication
ENABLE_TEST_AUTH=false
```

### Step 8: Run

```bash
npm run dev
```

Open http://localhost:9002

---

## Environment Variables Reference

### Client-Side Variables (NEXT_PUBLIC_*)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Production | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Production | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Production | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Production | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Production | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Production | Firebase app ID |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATORS` | No | Set to `true` to use emulators |

### Server-Side Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Production* | Path to service account JSON |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Production* | Service account as JSON string |
| `GOOGLE_API_KEY` | For AI features | Google AI API key |
| `ENABLE_TEST_AUTH` | No | Enable `/api/test-token` endpoint |

*Not required when using emulators (`NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`)

---

## Available Commands

### Development

| Command | Description |
|---------|-------------|
| `npm run dev:local` | 🚀 **Recommended** - Start emulators + dev server |
| `npm run dev` | Start dev server only (production Firebase) |
| `npm run dev:emulators` | Start dev server in emulator mode |
| `npm run emulators` | Start only Firebase emulators |

### Building & Production

| Command | Description |
|---------|-------------|
| `npm run build` | Create production build |
| `npm run start` | Start production server |

### Testing & Quality

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run typecheck` | TypeScript type checking |
| `npm run lint` | ESLint |

### AI Development

| Command | Description |
|---------|-------------|
| `npm run genkit:dev` | Start Genkit AI dev server |
| `npm run genkit:watch` | Genkit with file watching |

---

## API Endpoints

### Protected Endpoints

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/api/chat/socratic` | POST | Student | Socratic tutoring chat |
| `/api/assessment/personalized` | POST | Student | Generate personalized assessment |
| `/api/indexing/course-material` | POST | Teacher | Index course material |

### Test Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/test-token` | GET | Generate test auth token (dev only) |

### Example: Making an Authenticated Request

```javascript
// Client-side
import { auth } from '@/lib/firebase';

const idToken = await auth.currentUser.getIdToken();

const response = await fetch('/api/chat/socratic', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    courseMaterial: 'Your course content...',
    studentQuestion: 'What is machine learning?',
  }),
});
```

Or use the built-in API client:

```javascript
import { chatApi } from '@/lib/api-client';

const result = await chatApi.sendMessage(courseMaterial, question);
```

---

## Authentication

### User Roles

| Role | Access |
|------|--------|
| **Student** | Chat, assessments, courses |
| **Teacher** | Course management, indexing, analytics |

### Authentication Flow

1. User clicks "Sign in with Google"
2. Firebase handles OAuth flow
3. On first login → Redirect to onboarding
4. User selects role (student/teacher)
5. Profile saved to Firestore
6. Redirect to appropriate dashboard

### Security

- All API endpoints verify Firebase ID tokens
- Role-based access control (RBAC)
- Firestore security rules protect data
- Server-side token verification using Admin SDK

---

## Testing

### E2E Tests (Playwright)

```bash
# Install browsers (first time)
npx playwright install

# Terminal 1: Start server
npm run dev:local

# Terminal 2: Run tests
npm run test:e2e
```

### Test Authentication

For testing with custom tokens:

**PowerShell:**
```powershell
$env:ENABLE_TEST_AUTH="true"
$env:FIREBASE_SERVICE_ACCOUNT_PATH="./secrets/firebase-admin.json"
npm run dev
```

**Bash:**
```bash
ENABLE_TEST_AUTH=true FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-admin.json npm run dev
```

Then get a test token:
```bash
curl "http://localhost:9002/api/test-token?uid=test-student&role=student"
```

### Using Emulators for Tests

The recommended approach for testing:

```bash
npm run dev:local
```

Benefits:
- No real Firebase credentials needed
- Data resets on restart
- Can create users via Emulator UI (http://localhost:4000)

---

## Troubleshooting

### Common Issues

#### "Missing or insufficient permissions"

**Cause**: Firestore security rules not deployed.

**Fix**: 
1. Go to Firebase Console → Firestore → Rules
2. Publish the rules from the [Security Rules](#step-4-deploy-security-rules) section

#### "Cloud Firestore API has not been used"

**Cause**: API not enabled in Google Cloud.

**Fix**: Click the link in the error message and enable the API.

#### "401 Unauthorized" on API calls

**Cause**: Missing or invalid authentication token.

**Fix**:
- Ensure user is signed in
- Token may be expired - sign in again
- Check Authorization header format: `Bearer <token>`

#### "403 Forbidden" on API calls

**Cause**: User doesn't have the required role.

**Fix**: Check user's role in Firestore (`users/{uid}.role`)

#### Firebase Admin SDK errors

**Cause**: Service account not configured.

**Fix**:
- For emulators: Set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true`
- For production: Verify `secrets/firebase-admin.json` exists

#### Java not found (emulators)

**Cause**: Firebase Emulators require Java.

**Fix**: Install Java 11+:
- Windows: https://adoptium.net/
- Mac: `brew install openjdk@11`
- Linux: `sudo apt install openjdk-11-jdk`

#### Port already in use

**Fix**: Kill the process using the port:

```bash
# Windows
netstat -ano | findstr :9002
taskkill /PID <pid> /F

# Mac/Linux
lsof -i :9002
kill -9 <pid>
```

---

## Project Structure

```
CourseLLM-Firebase/
├── .env.local                    # Environment variables (create this)
├── secrets/
│   └── firebase-admin.json       # Service account (create this)
├── src/
│   ├── app/
│   │   ├── api/                  # API routes
│   │   │   ├── chat/socratic/    # Socratic chat endpoint
│   │   │   ├── assessment/       # Assessment endpoint
│   │   │   ├── indexing/         # Indexing endpoint
│   │   │   └── test-token/       # Test auth endpoint
│   │   ├── login/                # Login page
│   │   ├── onboarding/           # Onboarding page
│   │   ├── student/              # Student dashboard & pages
│   │   └── teacher/              # Teacher dashboard & pages
│   ├── components/
│   │   ├── AuthProviderClient.tsx    # Auth context provider
│   │   ├── RoleGuardClient.tsx       # Role-based route protection
│   │   └── ui/                       # UI components (shadcn)
│   ├── lib/
│   │   ├── api-client.ts         # Authenticated API client
│   │   ├── authService.ts        # Client auth helpers
│   │   ├── firebase.ts           # Firebase client initialization
│   │   ├── server-auth.ts        # Server token verification
│   │   └── types.ts              # TypeScript types
│   └── ai/
│       ├── genkit.ts             # Genkit AI configuration
│       └── flows/                # AI flows
│           ├── socratic-course-chat.ts
│           ├── personalized-learning-assessment.ts
│           └── optimized-indexing.ts
├── docs/
│   ├── DEVELOPMENT.md            # This file
│   ├── setup-guide.md            # Detailed production setup
│   ├── quick-start-local.md      # Quick local setup
│   └── microservices-architecture.md
├── infrastructure/
│   ├── docker-compose.yml        # Docker setup
│   ├── Dockerfile                # Production container
│   └── openapi.yaml              # API specification
├── tests/
│   ├── auth.spec.ts              # Playwright auth tests
│   └── playwright.config.ts
├── firebase.json                 # Firebase configuration
├── firestore.rules               # Firestore security rules
└── package.json
```

---

## Quick Reference

### Development Modes

| Mode | Command | Use Case |
|------|---------|----------|
| **Local (Emulators)** | `npm run dev:local` | Development, testing |
| **Production Firebase** | `npm run dev` | Testing with real data |
| **Build** | `npm run build` | Deployment |

### Ports Used

| Port | Service |
|------|---------|
| 9002 | Next.js App |
| 4000 | Firebase Emulator UI |
| 9099 | Auth Emulator |
| 8080 | Firestore Emulator |
| 4400 | Emulator Hub |

### Key Files

| File | Purpose |
|------|---------|
| `.env.local` | Environment variables |
| `secrets/firebase-admin.json` | Service account credentials |
| `firebase.json` | Emulator configuration |
| `firestore.rules` | Database security rules |

---

## Getting Help

- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Genkit Docs**: https://firebase.google.com/docs/genkit
- **Playwright Docs**: https://playwright.dev/docs

