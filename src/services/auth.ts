import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/client";
import { COLLECTIONS } from "@/types/firestore";
import type { UserDoc } from "@/types/firestore";

const googleProvider = new GoogleAuthProvider();

/** Creates the Firestore user doc on first login (any method). No-op if it already exists. */
async function ensureUserDoc(user: FirebaseUser): Promise<void> {
  const ref = doc(db, COLLECTIONS.users, user.uid);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return;

  const newUser: Omit<UserDoc, "createdAt" | "updatedAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>;
    updatedAt: ReturnType<typeof serverTimestamp>;
  } = {
    uid: user.uid,
    email: user.email ?? "",
    phone: user.phoneNumber ?? undefined,
    displayName: user.displayName ?? "AUREYAA Customer",
    role: "customer",
    addresses: [],
    rewardPoints: 0,
    storeCredits: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, newUser);
}

/** POSTs the Firebase ID token to our API route, which mints an httpOnly session cookie. */
async function establishServerSession(user: FirebaseUser): Promise<void> {
  const idToken = await user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
}

export async function signInWithGoogle(): Promise<FirebaseUser> {
  const result = await signInWithPopup(auth, googleProvider);
  await ensureUserDoc(result.user);
  await establishServerSession(result.user);
  return result.user;
}

export async function signInWithEmail(email: string, password: string): Promise<FirebaseUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(result.user);
  await establishServerSession(result.user);
  return result.user;
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<FirebaseUser> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });
  await ensureUserDoc(result.user);
  await establishServerSession(result.user);
  return result.user;
}

/**
 * Phone/OTP login — two-step:
 * 1. setUpRecaptcha() once (invisible widget bound to a DOM container)
 * 2. sendOtp(phoneNumber) -> returns a ConfirmationResult
 * 3. confirmOtp(confirmationResult, code) -> signs the user in
 */
export function setUpRecaptcha(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, { size: "invisible" });
}

export async function sendOtp(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  // Indian numbers — service assumes a 10-digit input and prefixes +91.
  const formatted = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
  return signInWithPhoneNumber(auth, formatted, recaptchaVerifier);
}

export async function confirmOtp(
  confirmationResult: ConfirmationResult,
  code: string
): Promise<FirebaseUser> {
  const result = await confirmationResult.confirm(code);
  await ensureUserDoc(result.user);
  await establishServerSession(result.user);
  return result.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
  await fetch("/api/auth/session", { method: "DELETE" });
}
