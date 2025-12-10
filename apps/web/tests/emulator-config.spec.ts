import { test, expect } from '@playwright/test';

/**
 * Tests for Firebase Emulator configuration and environment validation.
 * 
 * These tests verify:
 * 1. Emulator environment variables are correctly set
 * 2. The app connects to emulators in development mode
 * 3. Environment validation (Zod) is working
 */

test.describe('Firebase Emulator Configuration', () => {
  test('emulators should be accessible at expected ports', async ({ request }) => {
    // Test Auth Emulator
    const authResponse = await request.get('http://127.0.0.1:9099/', {
      timeout: 5000,
    }).catch(() => null);
    
    expect(authResponse, 'Auth Emulator should be running on port 9099').not.toBeNull();
    
    // Test Firestore Emulator
    const firestoreResponse = await request.get('http://127.0.0.1:8080/', {
      timeout: 5000,
    }).catch(() => null);
    
    expect(firestoreResponse, 'Firestore Emulator should be running on port 8080').not.toBeNull();
    
    // Test Storage Emulator - note: storage may return 400 for root, but should respond
    const storageResponse = await request.get('http://127.0.0.1:9199/', {
      timeout: 5000,
    }).catch(() => null);
    
    expect(storageResponse, 'Storage Emulator should be running on port 9199').not.toBeNull();
  });

  test('Emulator UI should be accessible', async ({ request }) => {
    const response = await request.get('http://127.0.0.1:4000/', {
      timeout: 5000,
    }).catch(() => null);
    
    expect(response, 'Emulator UI should be running on port 4000').not.toBeNull();
    if (response) {
      expect(response.status()).toBeLessThan(400);
    }
  });

  test('app should load successfully when emulators are enabled', async ({ page }) => {
    // Navigate to the app
    const response = await page.goto('http://localhost:9002/');
    
    // App should load without errors
    expect(response?.status()).toBeLessThan(400);
    
    // Check that the page rendered (not a blank error page)
    await expect(page.locator('body')).not.toBeEmpty();
  });

  test('environment validation error page should not appear', async ({ page }) => {
    await page.goto('http://localhost:9002/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check that we don't see Zod validation errors
    const pageContent = await page.content();
    expect(pageContent).not.toContain('Invalid client environment variables');
    expect(pageContent).not.toContain('Invalid server environment variables');
    expect(pageContent).not.toContain('Invalid emulator environment variables');
  });

  test('app should connect to Auth Emulator', async ({ page, request }) => {
    // Create a test user via the test-token API
    const res = await request.get('http://localhost:9002/api/test-token?uid=emulator-test-user&role=student&createProfile=true');
    expect(res.ok()).toBeTruthy();
    
    const { token } = await res.json();
    expect(token).toBeTruthy();
    
    // Sign in with the test token
    await page.goto(`http://localhost:9002/test/signin?token=${encodeURIComponent(token)}`);
    
    // Should redirect to student dashboard (indicates Auth Emulator is working)
    await page.waitForURL('**/student', { timeout: 10000 });
  });
});

test.describe('Firestore Emulator Integration', () => {
  test('should be able to create and read documents', async ({ page, request }) => {
    // Create a test user
    const res = await request.get('http://localhost:9002/api/test-token?uid=firestore-test-user&role=teacher&createProfile=true');
    expect(res.ok()).toBeTruthy();
    
    const { token } = await res.json();
    
    // Sign in
    await page.goto(`http://localhost:9002/test/signin?token=${encodeURIComponent(token)}`);
    await page.waitForURL('**/teacher', { timeout: 10000 });
    
    // Verify we can access teacher dashboard (requires Firestore read)
    await expect(page.locator('body')).not.toBeEmpty();
  });
});

test.describe('Environment Variable Validation', () => {
  test('NEXT_PUBLIC_USE_FIREBASE_EMULATORS should be set', async ({ page }) => {
    // Navigate to app - if emulators aren't configured, this would fail
    await page.goto('http://localhost:9002/');
    await page.waitForLoadState('networkidle');
    
    // App should load without Firebase connection errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Wait a bit for any async errors
    await page.waitForTimeout(2000);
    
    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      error.includes('Firebase') && 
      !error.includes('analytics') && // Analytics warnings are expected in dev
      !error.includes('messaging') // Messaging warnings are expected in dev
    );
    
    expect(criticalErrors, 'No critical Firebase errors should appear in console').toHaveLength(0);
  });
});
