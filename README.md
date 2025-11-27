# CourseLLM - AI-Powered Learning Platform

An intelligent learning platform that uses AI to provide Socratic tutoring, personalized assessments, and course material management.

## 🚀 Quick Start (Local Development)

The fastest way to get started - **no Firebase project needed!**

### Prerequisites
- Node.js 18+
- Java 11+ (for Firebase Emulators)

### Setup

```bash
# 1. Clone and install
git clone <repository-url>
cd CourseLLM-Firebase
npm install

# 2. Install Firebase CLI (one-time)
npm install -g firebase-tools

# 3. Start everything!
npm run dev:local
```

Open http://localhost:9002 - that's it! 🎉

📖 **See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for complete guide**

---

## 🚀 Production Setup

For deploying to real Firebase, see the **Production Setup** section in:

📖 **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)**

---

## 🏗️ Architecture

This project follows a microservices architecture pattern with authenticated API endpoints.

### API Endpoints

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/api/chat/socratic` | POST | Student | AI Socratic tutoring |
| `/api/assessment/personalized` | POST | Student | Personalized assessments |
| `/api/indexing/course-material` | POST | Teacher | Index course content |

All endpoints require Firebase Authentication via Bearer token.

📖 **See [docs/microservices-architecture.md](docs/microservices-architecture.md) for architecture details**

---

## 🧠 AI Features

### Socratic Course Chat
Students can chat with course materials using a Socratic teaching method. The AI guides students through questions rather than giving direct answers.

### Personalized Assessments
Based on student learning paths and interactions, the AI generates personalized assessments highlighting strengths and areas for improvement.

### Context-Aware RAG Pipeline

We have implemented an optimized Retrieval-Augmented Generation (RAG) pipeline designed for course materials.

**Our Solution:**
1. **Hierarchical Chunking:** Parses Markdown headers to track the full path of every text chunk
2. **AI Enrichment:** Uses Gemini to generate metadata (summary, keywords, hypothetical questions)
3. **Smart Embedding:** Embeds rich context (Title + Path + Summary + Content)

### 🧪 Testing the AI Pipeline

**1. Test Chunking Logic:**
```bash
npx tsx scripts/test-chunking.ts
```

**2. Test Full AI Pipeline (Genkit UI):**
```bash
npm run genkit:dev
```
Open http://localhost:4000 → Flows → `optimizedIndexingFlow`

---

## 🔐 Authentication

The app uses Firebase Authentication with Google OAuth. Server-side API routes verify Firebase ID tokens using the Admin SDK.

### User Roles
- **Student**: Access to chat and assessment features
- **Teacher**: Access to course management and indexing

### Security
- All API endpoints verify authentication
- Role-based access control (RBAC)
- Firestore security rules protect user data

---

## 🧪 Testing

### Run E2E Tests
```bash
# Install Playwright (first time)
npx playwright install

# Run tests
npm run test:e2e
```

### Enable Test Authentication
For local testing with custom tokens:

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

---

## 📁 Project Structure

```
CourseLLM-Firebase/
├── src/
│   ├── app/              # Next.js pages and API routes
│   │   ├── api/          # Authenticated API endpoints
│   │   ├── student/      # Student dashboard
│   │   └── teacher/      # Teacher dashboard
│   ├── lib/              # Utilities and services
│   │   ├── api-client.ts # Frontend authenticated API client
│   │   └── server-auth.ts# Server-side token verification
│   └── ai/               # Genkit AI flows
├── docs/                 # Documentation
├── infrastructure/       # Docker & deployment configs
├── secrets/              # Service account keys (gitignored)
└── tests/                # Playwright E2E tests
```

---

## 📚 Documentation

- **[DEVELOPMENT.md](docs/DEVELOPMENT.md)** - 📖 Complete development guide (start here!)
- [Microservices Architecture](docs/microservices-architecture.md) - Architecture overview
- [Authentication PRD](docs/Auth/Authentication%20PRD.md) - Auth requirements
- [Auth Implementation](docs/Auth/auth-implementation.md) - Auth technical details

---

## 🛠️ Scripts

```bash
npm run dev          # Start development server (port 9002)
npm run build        # Production build
npm run start        # Start production server
npm run test:e2e     # Run Playwright tests
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run genkit:dev   # Start Genkit AI dev server
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test:e2e`
5. Submit a pull request

---

## 📄 License

[MIT License](LICENSE)
