import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { clientEnv, shouldUseEmulators, EMULATOR_CONFIG } from "./env";

const firebaseConfig = {
  apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app (singleton pattern for hot reloading)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Track emulator connection status to prevent multiple connections
let emulatorsConnected = false;

/**
 * Connect to Firebase Emulators in development mode.
 * This function is idempotent - safe to call multiple times.
 */
function connectToEmulators() {
  if (emulatorsConnected) return;
  if (!shouldUseEmulators()) return;

  try {
    // Connect Auth emulator
    connectAuthEmulator(auth, `http://${EMULATOR_CONFIG.auth.host}:${EMULATOR_CONFIG.auth.port}`, {
      disableWarnings: true,
    });

    // Connect Firestore emulator
    connectFirestoreEmulator(
      db,
      EMULATOR_CONFIG.firestore.host,
      EMULATOR_CONFIG.firestore.port
    );

    // Connect Storage emulator
    connectStorageEmulator(
      storage,
      EMULATOR_CONFIG.storage.host,
      EMULATOR_CONFIG.storage.port
    );

    emulatorsConnected = true;
    console.log("🔧 Firebase Emulators connected:", {
      auth: `${EMULATOR_CONFIG.auth.host}:${EMULATOR_CONFIG.auth.port}`,
      firestore: `${EMULATOR_CONFIG.firestore.host}:${EMULATOR_CONFIG.firestore.port}`,
      storage: `${EMULATOR_CONFIG.storage.host}:${EMULATOR_CONFIG.storage.port}`,
      ui: `http://${EMULATOR_CONFIG.ui.host}:${EMULATOR_CONFIG.ui.port}`,
    });
  } catch (error) {
    // Emulator connection can fail if already connected (e.g., hot reload)
    console.warn("Emulator connection warning:", error);
    emulatorsConnected = true;
  }
}

// Connect to emulators on module load (development only)
if (typeof window !== "undefined") {
  connectToEmulators();
}

export const googleProvider = new GoogleAuthProvider();

export default app;
