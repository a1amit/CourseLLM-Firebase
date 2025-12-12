import { z } from "zod";

/**
 * Environment variable schema with Zod validation.
 * 
 * This module validates environment variables at import time to ensure
 * the application fails fast with descriptive errors if configuration is missing.
 * 
 * In development mode with emulators, Firebase credentials are optional.
 * In production mode, all Firebase credentials are required.
 */

const isServer = typeof window === "undefined";
const isDevelopment = process.env.NODE_ENV === "development";
const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

/**
 * Client-side environment variables (exposed to browser via NEXT_PUBLIC_ prefix)
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, "Firebase API key is required"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, "Firebase Auth domain is required"),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, "Firebase Project ID is required"),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, "Firebase Storage bucket is required"),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, "Firebase Messaging Sender ID is required"),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, "Firebase App ID is required"),
});

/**
 * Server-side only environment variables (never exposed to browser)
 */
const serverEnvSchema = z.object({
  GOOGLE_API_KEY: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_JSON: z.string().optional(),
  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().optional(),
  ENABLE_TEST_AUTH: z.enum(["true", "false"]).optional().default("false"),
});

/**
 * Emulator configuration
 * Note: NEXT_PUBLIC_ prefix is required for client-side access in Next.js
 */
const emulatorEnvSchema = z.object({
  NEXT_PUBLIC_USE_FIREBASE_EMULATORS: z.enum(["true", "false"]).optional().default("false"),
  FIREBASE_AUTH_EMULATOR_HOST: z.string().optional(),
  FIRESTORE_EMULATOR_HOST: z.string().optional(),
  FIREBASE_STORAGE_EMULATOR_HOST: z.string().optional(),
});

/**
 * Emulator port configuration (used when connecting to emulators)
 */
export const EMULATOR_CONFIG = {
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
 * Raw environment variable access for client-side
 */
const clientEnvRaw = {
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Parse and validate environment variables with helpful error messages
 */
function parseEnv<T extends z.ZodTypeAny>(
  schema: T,
  env: Record<string, string | undefined>,
  context: string
): z.infer<T> {
  const result = schema.safeParse(env);

  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `  - ${e.path.join(".")}: ${e.message}`)
      .join("\n");

    throw new Error(
      `❌ Invalid ${context} environment variables:\n${errors}\n\n` +
      `Please check your .env.local file. See .env.local.example for reference.`
    );
  }

  return result.data;
}

/**
 * Validated client environment variables
 * 
 * In development mode with emulators, we use permissive defaults.
 * In production, all values are strictly required.
 */
function getClientEnv() {
  // In development with emulators, allow placeholder values for easier local setup
  if (isDevelopment && useEmulators) {
    const permissiveSchema = z.object({
      NEXT_PUBLIC_FIREBASE_API_KEY: z.string().default("demo-api-key"),
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().default("demo-project.firebaseapp.com"),
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().default("demo-project"),
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().default("demo-project.appspot.com"),
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().default("000000000000"),
      NEXT_PUBLIC_FIREBASE_APP_ID: z.string().default("1:000000000000:web:0000000000000000"),
    });
    return parseEnv(permissiveSchema, clientEnvRaw, "client");
  }

  return parseEnv(clientEnvSchema, clientEnvRaw, "client");
}

/**
 * Validated server environment variables (only available on server)
 */
function getServerEnv() {
  if (!isServer) {
    throw new Error("Server environment variables cannot be accessed on the client");
  }

  return parseEnv(serverEnvSchema, {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
    FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    ENABLE_TEST_AUTH: process.env.ENABLE_TEST_AUTH,
  }, "server");
}

/**
 * Validated emulator environment configuration
 */
function getEmulatorEnv() {
  return parseEnv(emulatorEnvSchema, {
    NEXT_PUBLIC_USE_FIREBASE_EMULATORS: process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS,
    FIREBASE_AUTH_EMULATOR_HOST: process.env.FIREBASE_AUTH_EMULATOR_HOST,
    FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST,
    FIREBASE_STORAGE_EMULATOR_HOST: process.env.FIREBASE_STORAGE_EMULATOR_HOST,
  }, "emulator");
}

// Export validated environment
export const clientEnv = getClientEnv();
export const emulatorEnv = getEmulatorEnv();

// Server env is lazily evaluated to avoid errors on client
export const serverEnv = isServer ? getServerEnv() : null;

/**
 * Helper to check if emulators should be used
 */
export function shouldUseEmulators(): boolean {
  return isDevelopment && emulatorEnv.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";
}

/**
 * Get emulator URL for a specific service
 */
export function getEmulatorUrl(service: keyof typeof EMULATOR_CONFIG): string {
  const config = EMULATOR_CONFIG[service];
  return `http://${config.host}:${config.port}`;
}
