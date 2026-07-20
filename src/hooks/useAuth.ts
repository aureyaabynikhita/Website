"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/firebase/client";
import { COLLECTIONS, type UserDoc } from "@/types/firestore";
import { useAuthStore } from "@/store/authStore";

/**
 * Mount this once near the app root (see AuthProvider). Components elsewhere
 * should just read `useAuthStore()` directly rather than re-subscribing.
 */
export function useAuthListener() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribeProfile?.();

      if (!firebaseUser) {
        clear();
        return;
      }

      const ref = doc(db, COLLECTIONS.users, firebaseUser.uid);
      unsubscribeProfile = onSnapshot(ref, (snapshot) => {
        setAuth(firebaseUser.uid, (snapshot.data() as UserDoc) ?? null);
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProfile?.();
    };
  }, [setAuth, clear]);
}

/** Convenience hook for reading auth state in components. */
export function useAuth() {
  return useAuthStore();
}
