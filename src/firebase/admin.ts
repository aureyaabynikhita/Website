import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

/**
 * Server-only Firebase Admin instance.
 * Used inside API routes / Server Actions / Cloud Functions — NEVER import
 * this file from a "use client" component (it needs the service account key).
 *
 * Required env vars (server-side only, no NEXT_PUBLIC_ prefix):
 *   FIREBASE_PROJECT_ID
 *   FIREBASE_CLIENT_EMAIL
 *   FIREBASE_PRIVATE_KEY   (keep the \n escapes — see .env.example)
 */



const adminApp = getAdminApp();
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
