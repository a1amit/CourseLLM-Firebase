# Post-Migration Steps

## IDE/Editor Cache Issues

After the monorepo restructuring, your IDE may still reference old file paths. **The `src` directory has been moved to `apps/web/src`.**

### To Fix TypeScript Errors:

1. **Close all open files** in your editor
2. **Reload/Restart your IDE or VS Code window**
   - VS Code: Press `Ctrl+Shift+P` → Type "Reload Window" → Press Enter
   - Or completely close and reopen your editor

3. **Verify you're working in the correct directory:**
   - Old paths:
     - `d:\Projects\Web Projects\CourseLLM-Firebase\src\...`
     - `d:\Projects\Web Projects\CourseLLM-Firebase\tests\...`
   - **New paths:**
     - `d:\Projects\Web Projects\CourseLLM-Firebase\apps\web\src\...`
     - `d:\Projects\Web Projects\CourseLLM-Firebase\apps\web\tests\...`

4. **If you're opening files from Git, make sure to:**
   - Pull latest changes
   - Open the workspace from the ROOT directory: `d:\Projects\Web Projects\CourseLLM-Firebase`
   - NOT from `apps/web` subdirectory

### Why This Happened

During monorepo migration:
- Moved entire `src/` directory → `apps/web/src/`
- Moved `tests/` directory → `apps/web/tests/`
- Moved `package.json`, `tsconfig.json`, etc. → `apps/web/`
- **`.env.local` needs to be in `apps/web/.env.local`** (Next.js reads env from its own directory)
- Your IDE's TypeScript server may still have cached the old structure

### Verifying the Fix

After reloading, check that:
- ✅ No TypeScript errors about missing modules (`next/server`, `fs`, `path`, `firebase-admin`)
- ✅ `@types/node` is recognized (already installed in `apps/web/package.json`)
- ✅ File paths show `apps/web/src/...` instead of just `src/...`

### Still Having Issues?

Run from the `apps/web` directory:
```bash
cd apps/web
pnpm install
```

Then reload your IDE again.
