# Tasks: Implement Local Emulators

## 1. Infrastructure Setup

- [x] 1.1 Update `firebase.json` to set explicit Emulator UI port (4000)
- [x] 1.2 Update `.gitignore` to exclude emulator data directories (`dataconnect/.dataconnect/`, `.firebase/`)
- [x] 1.3 Create `.env.local.example` template with emulator environment variables

## 2. Frontend Environment Configuration

- [x] 2.1 Install `zod` package for environment validation (`pnpm add zod`)
- [x] 2.2 Create `src/lib/env.ts` with Zod schema for environment variable validation
- [x] 2.3 Refactor `src/lib/firebase.ts` to conditionally connect to emulators when `NODE_ENV === 'development'`
- [x] 2.4 Add emulator connection for Auth (`connectAuthEmulator`)
- [x] 2.5 Add emulator connection for Firestore (`connectFirestoreEmulator`)
- [x] 2.6 Add emulator connection for Storage (`connectStorageEmulator`)

## 3. Backend Configuration (Optional - Python)

- [ ] 3.1 Install `pydantic-settings` if Python backend exists — *Skipped: No Python backend in this project*
- [ ] 3.2 Create `config.py` with Pydantic settings class — *Skipped: No Python backend in this project*
- [ ] 3.3 Implement conditional Firebase Admin initialization — *Skipped: No Python backend in this project*

## 4. Documentation

- [x] 4.1 Update `README.md` with "Local Development" section
- [x] 4.2 Document required environment variables for emulator mode
- [x] 4.3 Add commands: `firebase emulators:start` and expected ports
- [x] 4.4 Document how to access Emulator UI at `http://localhost:4000`

## 5. Validation

- [ ] 5.1 Test that `npm run dev` connects to emulators when running
- [ ] 5.2 Test that production build does NOT connect to emulators
- [ ] 5.3 Verify Zod validation fails startup if required production vars are missing (non-emulator mode)
