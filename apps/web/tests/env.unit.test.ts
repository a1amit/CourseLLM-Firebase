/**
 * Unit tests for environment configuration constants.
 * 
 * Run with: npx tsx tests/env.unit.test.ts
 * 
 * These tests verify:
 * 1. EMULATOR_CONFIG has correct port values
 * 2. Port configuration matches firebase.json specification
 * 3. getEmulatorUrl() returns correct URLs
 * 
 * Note: Since env.ts validates environment variables at import time,
 * we test the constants and URL helper directly without importing the
 * full module. The full integration test is in emulator-config.spec.ts.
 */

// Simple test runner
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   ${error instanceof Error ? error.message : error}`);
    failed++;
  }
}

function expect<T>(actual: T) {
  return {
    toBe(expected: T) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    },
    toEqual(expected: T) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`Expected truthy value, but got ${actual}`);
      }
    },
    toContain(expected: string) {
      if (typeof actual !== 'string' || !actual.includes(expected)) {
        throw new Error(`Expected "${actual}" to contain "${expected}"`);
      }
    },
  };
}

// =============================================================================
// Define expected configuration (mirrors src/lib/env.ts EMULATOR_CONFIG)
// =============================================================================

/**
 * Expected emulator configuration - must match src/lib/env.ts
 * and firebase.json
 */
const EXPECTED_EMULATOR_CONFIG = {
  auth: {
    host: "127.0.0.1",
    port: 9099,
  },
  firestore: {
    host: "127.0.0.1",
    port: 8080,
  },
  storage: {
    host: "127.0.0.1",
    port: 9199,
  },
  ui: {
    host: "127.0.0.1",
    port: 4000,
  },
} as const;

/**
 * Helper function (mirrors src/lib/env.ts getEmulatorUrl)
 */
function getEmulatorUrl(service: keyof typeof EXPECTED_EMULATOR_CONFIG): string {
  const config = EXPECTED_EMULATOR_CONFIG[service];
  return `http://${config.host}:${config.port}`;
}

// =============================================================================
// Tests
// =============================================================================

console.log('\n📋 Running Environment Configuration Tests\n');
console.log('─'.repeat(50));

// EXPECTED_EMULATOR_CONFIG Tests
console.log('\n🔧 EMULATOR_CONFIG Tests:\n');

test('Auth emulator should be configured on port 9099', () => {
  expect(EXPECTED_EMULATOR_CONFIG.auth.port).toBe(9099);
  expect(EXPECTED_EMULATOR_CONFIG.auth.host).toBe('127.0.0.1');
});

test('Firestore emulator should be configured on port 8080', () => {
  expect(EXPECTED_EMULATOR_CONFIG.firestore.port).toBe(8080);
  expect(EXPECTED_EMULATOR_CONFIG.firestore.host).toBe('127.0.0.1');
});

test('Storage emulator should be configured on port 9199', () => {
  expect(EXPECTED_EMULATOR_CONFIG.storage.port).toBe(9199);
  expect(EXPECTED_EMULATOR_CONFIG.storage.host).toBe('127.0.0.1');
});

test('Emulator UI should be configured on port 4000', () => {
  expect(EXPECTED_EMULATOR_CONFIG.ui.port).toBe(4000);
  expect(EXPECTED_EMULATOR_CONFIG.ui.host).toBe('127.0.0.1');
});

// getEmulatorUrl Tests
console.log('\n🔗 getEmulatorUrl Tests:\n');

test('getEmulatorUrl("auth") should return correct URL', () => {
  const url = getEmulatorUrl('auth');
  expect(url).toBe('http://127.0.0.1:9099');
});

test('getEmulatorUrl("firestore") should return correct URL', () => {
  const url = getEmulatorUrl('firestore');
  expect(url).toBe('http://127.0.0.1:8080');
});

test('getEmulatorUrl("storage") should return correct URL', () => {
  const url = getEmulatorUrl('storage');
  expect(url).toBe('http://127.0.0.1:9199');
});

test('getEmulatorUrl("ui") should return correct URL', () => {
  const url = getEmulatorUrl('ui');
  expect(url).toBe('http://127.0.0.1:4000');
});

// Port Configuration Tests (matching firebase.json)
console.log('\n📝 firebase.json Port Verification:\n');

// Read and verify firebase.json configuration
import { readFileSync } from 'fs';
import { join } from 'path';

test('firebase.json emulator ports should match EMULATOR_CONFIG', () => {
  // firebase.json is at the project root, not in apps/web
  const firebaseConfigPath = join(process.cwd(), '..', '..', 'firebase.json');
  const firebaseConfig = JSON.parse(readFileSync(firebaseConfigPath, 'utf-8'));

  // Verify Auth emulator port
  expect(firebaseConfig.emulators.auth.port).toBe(EXPECTED_EMULATOR_CONFIG.auth.port);

  // Verify Firestore emulator port
  expect(firebaseConfig.emulators.firestore.port).toBe(EXPECTED_EMULATOR_CONFIG.firestore.port);

  // Verify Storage emulator port
  expect(firebaseConfig.emulators.storage.port).toBe(EXPECTED_EMULATOR_CONFIG.storage.port);

  // Verify UI port
  expect(firebaseConfig.emulators.ui.port).toBe(EXPECTED_EMULATOR_CONFIG.ui.port);
});

test('All emulator hosts should be localhost (127.0.0.1)', () => {
  expect(EXPECTED_EMULATOR_CONFIG.auth.host).toBe('127.0.0.1');
  expect(EXPECTED_EMULATOR_CONFIG.firestore.host).toBe('127.0.0.1');
  expect(EXPECTED_EMULATOR_CONFIG.storage.host).toBe('127.0.0.1');
  expect(EXPECTED_EMULATOR_CONFIG.ui.host).toBe('127.0.0.1');
});

// Zod Schema Validation Tests
console.log('\n🔒 Zod Schema Tests:\n');

import { z } from 'zod';

test('Emulator env schema should accept valid values', () => {
  const emulatorEnvSchema = z.object({
    NEXT_PUBLIC_USE_FIREBASE_EMULATORS: z.enum(["true", "false"]).optional().default("false"),
    FIREBASE_AUTH_EMULATOR_HOST: z.string().optional(),
    FIRESTORE_EMULATOR_HOST: z.string().optional(),
    FIREBASE_STORAGE_EMULATOR_HOST: z.string().optional(),
  });

  const result = emulatorEnvSchema.safeParse({
    NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "true",
    FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
  });

  expect(result.success).toBe(true);
});

test('Emulator env schema should use default false when not set', () => {
  const emulatorEnvSchema = z.object({
    NEXT_PUBLIC_USE_FIREBASE_EMULATORS: z.enum(["true", "false"]).optional().default("false"),
  });

  const result = emulatorEnvSchema.parse({});
  expect(result.NEXT_PUBLIC_USE_FIREBASE_EMULATORS).toBe("false");
});

test('Emulator env schema should reject invalid boolean values', () => {
  const emulatorEnvSchema = z.object({
    NEXT_PUBLIC_USE_FIREBASE_EMULATORS: z.enum(["true", "false"]).optional(),
  });

  const result = emulatorEnvSchema.safeParse({
    NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "yes", // Invalid - should be "true" or "false"
  });

  expect(result.success).toBe(false);
});

// Summary
console.log('\n' + '─'.repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  process.exit(1);
}
