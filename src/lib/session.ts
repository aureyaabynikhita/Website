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
    const userDocRef = adminDb.collection(COLLECTIONS.users).doc(decoded.uid);
    const userSnap = await userDocRef.get();
    
    const isAdminEmail = decoded.email?.toLowerCase().trim() === "aureyaabynikhita@gmail.com";
    let profile: UserDoc;

    if (userSnap.exists) {
      profile = userSnap.data() as UserDoc;
      if (isAdminEmail && profile.role !== "admin") {
        profile.role = "admin";
        await userDocRef.update({ role: "admin" }).catch(() => {});
      }
    } else {
      profile = {
        uid: decoded.uid,
        email: decoded.email ?? "",
        phone: decoded.phone_number ?? "",
        displayName: decoded.name ?? (isAdminEmail ? "Nikhita Matania" : "AUREYAA Member"),
        role: isAdminEmail ? "admin" : "customer",
        addresses: [],
        rewardPoints: 0,
        storeCredits: 0,
        createdAt: new Date() as any,
        updatedAt: new Date() as any,
      };
      await userDocRef.set(profile, { merge: true }).catch(() => {});
    }

    return { uid: decoded.uid, profile };
  } catch (err) {
    console.error("getServerSession verification failed:", err);
    return null;
  }
}

/** For API route handlers — throws-free guard returning null if the caller isn't an admin. */
export async function requireAdmin(): Promise<{ uid: string; profile: UserDoc } | null> {
  const session = await getServerSession();
  if (!session || session.profile?.role !== "admin") return null;
  return { uid: session.uid, profile: session.profile };
}

