import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

const auth = getAuth();
const db = getFirestore();

async function setupAdmin() {
  const email = "aureyaabynikhita@gmail.com";
  const password = "Nikhita@2026";
  const displayName = "Nikhita Matania (Admin)";

  console.log(`Setting up Admin Account for: ${email}...`);

  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
    console.log(`Found existing user (UID: ${userRecord.uid}). Updating password and details...`);
    userRecord = await auth.updateUser(userRecord.uid, {
      password,
      displayName,
      emailVerified: true,
    });
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      console.log("User not found. Creating new Firebase Auth user...");
      userRecord = await auth.createUser({
        email,
        password,
        displayName,
        emailVerified: true,
      });
    } else {
      throw error;
    }
  }

  // Set Custom Claims for Admin
  await auth.setCustomUserClaims(userRecord.uid, {
    admin: true,
    role: "admin",
  });
  console.log(`✓ Custom claims set (admin: true) on UID: ${userRecord.uid}`);

  // Create or update Firestore users document
  const userDocRef = db.collection("users").doc(userRecord.uid);
  await userDocRef.set(
    {
      id: userRecord.uid,
      email,
      displayName,
      role: "admin",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  console.log(`✓ Firestore document updated in "users" collection with role="admin"`);

  // Also ensure admin collection reference exists if any legacy checks exist
  const adminDocRef = db.collection("admin").doc(userRecord.uid);
  await adminDocRef.set(
    {
      uid: userRecord.uid,
      email,
      role: "admin",
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log("\n==================================================");
  console.log("🎉 ADMIN ACCOUNT SUCCESSFULLY CONFIGURED!");
  console.log(`📧 Email   : ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`🛡️ Role    : admin`);
  console.log(`🔗 Login at: http://localhost:3000/login -> /admin/dashboard`);
  console.log("==================================================\n");
}

setupAdmin().catch(console.error);
