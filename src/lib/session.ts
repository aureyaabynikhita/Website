import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/firebase/admin";
import { COLLECTIONS, type UserDoc } from "@/types/firestore";

export const SESSION_COOKIE_NAME = "aureyaa_session";

/** Verifies the session cookie server-side. Returns null if missing/invalid/expired. */
export async function getServerSession(): Promise<{ uid: string; profile: UserDoc | null } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userSnap = await adminDb.collection(COLLECTIONS.users).doc(decoded.uid).get();
    return { uid: decoded.uid, profile: (userSnap.data() as UserDoc) ?? null };
  } catch {
    return null;
  }
}

/** For API route handlers — throws-free guard returning null if the caller isn't an admin. */
export async function requireAdmin(): Promise<{ uid: string; profile: UserDoc } | null> {
  const session = await getServerSession();
  if (!session || session.profile?.role !== "admin") return null;
  return { uid: session.uid, profile: session.profile };
}
