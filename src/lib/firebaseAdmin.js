import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/**
 * Server-only Firestore via the Admin SDK.
 * The Admin SDK bypasses security rules, so the rules can deny all client writes
 * while these API routes keep working.
 *
 * FIREBASE_SERVICE_ACCOUNT must hold the service account JSON, either raw or base64-encoded.
 */
function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not set. Paste the service account JSON (or its base64) into the environment.");
  }
  const text = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
  const json = JSON.parse(text);
  // Env tooling often turns newlines in the private key into literal "\n"
  if (json.private_key) json.private_key = json.private_key.replace(/\\n/g, "\n");
  return json;
}

function getAdminApp() {
  if (getApps().length) return getApps()[0];
  const serviceAccount = loadServiceAccount();
  return initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

export function adminDb() {
  return getFirestore(getAdminApp());
}
