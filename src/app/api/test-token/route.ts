import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import admin from "firebase-admin";

// Guard this route so it's only available during test runs.
const ENABLED = process.env.ENABLE_TEST_AUTH === "true";

// Check if we should use emulators
const USE_EMULATORS = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

// Configure emulator hosts BEFORE importing/initializing Admin SDK
if (USE_EMULATORS) {
  // These environment variables are read by the Firebase Admin SDK
  process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || "127.0.0.1:9099";
}

function initAdmin() {
  if (admin.apps.length) return admin;

  let serviceAccount: any = null;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON", e);
    }
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    try {
      const p = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      const raw = fs.readFileSync(p, "utf8");
      serviceAccount = JSON.parse(raw);
    } catch (e) {
      console.error("Failed to read service account file", e);
    }
  }

  if (!serviceAccount) {
    throw new Error("Service account not provided in FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH");
  }

  // Initialize with projectId for emulator compatibility
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });

  if (USE_EMULATORS) {
    console.log("🔧 Admin SDK using emulators:", {
      firestore: process.env.FIRESTORE_EMULATOR_HOST,
      auth: process.env.FIREBASE_AUTH_EMULATOR_HOST,
    });
  }

  return admin;
}

export async function GET(req: Request) {
  if (!ENABLED) return NextResponse.json({ error: "test auth disabled" }, { status: 403 });

  const url = new URL(req.url);
  const uid = url.searchParams.get("uid") || `test-${Math.random().toString(36).slice(2, 8)}`;
  const role = url.searchParams.get("role"); // 'student' | 'teacher'
  const createProfile = url.searchParams.get("createProfile") !== "false"; // default true

  try {
    const adm = initAdmin();

    // Optionally write a user profile to Firestore so tests can simulate existing users.
    if (createProfile && role) {
      const db = adm.firestore();
      await db.doc(`users/${uid}`).set(
        {
          uid,
          email: `${uid}@example.test`,
          displayName: uid,
          role,
          department: "Test Dept",
          courses: ["TST101"],
          profileComplete: true,
          createdAt: adm.firestore.FieldValue.serverTimestamp(),
          updatedAt: adm.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    }

    const token = await adm.auth().createCustomToken(uid);
    return NextResponse.json({ token });
  } catch (err: any) {
    console.error("test-token error", err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
