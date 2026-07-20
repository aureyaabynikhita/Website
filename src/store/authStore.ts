import { create } from "zustand";
import type { UserDoc } from "@/types/firestore";

interface AuthState {
  firebaseUid: string | null;
  profile: UserDoc | null;
  isLoading: boolean;
  setAuth: (uid: string | null, profile: UserDoc | null) => void;
  setLoading: (loading: boolean) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUid: null,
  profile: null,
  isLoading: true,
  setAuth: (uid, profile) => set({ firebaseUid: uid, profile, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clear: () => set({ firebaseUid: null, profile: null, isLoading: false }),
}));
