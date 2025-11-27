import admin from 'firebase-admin';

// Check if we should use emulators
const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

// Initialize Firebase Admin SDK (singleton pattern)
function getFirebaseAdmin() {
  if (admin.apps.length) return admin;

  // Emulator mode - no credentials needed
  if (useEmulators) {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";
    process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
    
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
    });
    console.log("🔧 Firebase Admin connected to emulators");
    return admin;
  }

  // Production mode - requires service account
  let serviceAccount: admin.ServiceAccount | null = null;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON", e);
    }
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    try {
      const fs = require('fs');
      const path = require('path');
      const p = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      const raw = fs.readFileSync(p, "utf8");
      serviceAccount = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to read service account file", e);
    }
  }

  if (!serviceAccount) {
    throw new Error(
      "Firebase Admin SDK not configured.\n" +
      "For local development: Set NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true\n" +
      "For production: Set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH"
    );
  }

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  return admin;
}

export type AuthenticatedUser = {
  uid: string;
  email?: string;
  role?: 'student' | 'teacher';
  displayName?: string;
};

/**
 * Verifies a Firebase ID token and returns the decoded user info.
 * Also fetches the user's role from Firestore if available.
 */
export async function verifyAuthToken(idToken: string): Promise<AuthenticatedUser> {
  const adm = getFirebaseAdmin();
  
  // Verify the ID token
  const decodedToken = await adm.auth().verifyIdToken(idToken);
  
  // Fetch user profile from Firestore to get role
  const db = adm.firestore();
  const userDoc = await db.doc(`users/${decodedToken.uid}`).get();
  const userData = userDoc.data();
  
  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    role: userData?.role as 'student' | 'teacher' | undefined,
    displayName: decodedToken.name || userData?.displayName,
  };
}

/**
 * Verifies that the user has the required role.
 * Throws an error if the user doesn't have the required role.
 */
export function requireRole(user: AuthenticatedUser, requiredRoles: ('student' | 'teacher')[]): void {
  if (!user.role || !requiredRoles.includes(user.role)) {
    throw new Error(`Access denied. Required role: ${requiredRoles.join(' or ')}`);
  }
}

/**
 * Extract bearer token from authorization header
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export { getFirebaseAdmin };
