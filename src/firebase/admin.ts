import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;
let cachedAuth: Auth | null = null;

function getAdminApp(): App {
  if (cachedApp) return cachedApp;

  if (getApps().length) {
    cachedApp = getApps()[0]!;
    return cachedApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin credentials are not set. Please define FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY."
    );
  }

  cachedApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
  return cachedApp;
}

export const adminDb = new Proxy({} as Firestore, {
  get(target, prop, receiver) {
    const db = cachedDb || (cachedDb = getFirestore(getAdminApp()));
    const value = Reflect.get(db, prop);
    if (typeof value === "function") {
      return value.bind(db);
    }
    return value;
  },
});

export const adminAuth = new Proxy({} as Auth, {
  get(target, prop, receiver) {
    const auth = cachedAuth || (cachedAuth = getAuth(getAdminApp()));
    const value = Reflect.get(auth, prop);
    if (typeof value === "function") {
      return value.bind(auth);
    }
    return value;
  },
});
