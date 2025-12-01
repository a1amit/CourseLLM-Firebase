# Change: Implement Emulator-First Development Environment

## Why

To prevent accidental secret leakage and ensure reliable offline development capability. Currently, the Firebase client SDK connects directly to production services without environment-aware switching. This creates risk of developers accidentally modifying production data and makes local development dependent on network connectivity and valid credentials.

## What Changes

- **Infrastructure**: Update `firebase.json` to standardize emulator ports and add Emulator UI port (4000); update `.gitignore` to exclude local emulator data directories
- **Frontend**: Create validated environment configuration (`src/lib/env.ts`) using Zod schema; refactor `src/lib/firebase.ts` to conditionally connect to emulators in development mode
- **Backend (Python)**: *(If applicable)* Install `pydantic-settings` and create `config.py` with environment-aware Firebase Admin initialization
- **Documentation**: Update `README.md` with instructions for running Firebase emulators locally

## Impact

- **Affected specs**: `infrastructure/spec.md` (new capability)
- **Affected code**:
  - `firebase.json` - emulator port configuration
  - `.gitignore` - exclude emulator data
  - `src/lib/firebase.ts` - conditional emulator connection
  - `src/lib/env.ts` - new validated environment configuration
  - `README.md` - developer documentation
- **Breaking changes**: None. Existing production behavior unchanged when `NODE_ENV !== 'development'`
- **Developer workflow**: Developers MUST run `firebase emulators:start` before `npm run dev` for local testing
