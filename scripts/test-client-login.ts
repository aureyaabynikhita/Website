import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testLogin(email: string, pass: string) {
  console.log(`\nTesting client login with: ${email} | Pass: "${pass}"`);
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    console.log(`✅ SUCCESS! Logged in as: ${cred.user.email} (UID: ${cred.user.uid})`);
  } catch (err: any) {
    console.log(`❌ FAILED with error code: [${err.code}] - ${err.message}`);
  }
}

async function run() {
  await testLogin("aureyaabynikhita@gmail.com", "Nikhita@2026");
  await testLogin("aureyaabynikhita@gmail.com", "nikhita@2026");
}

run().catch(console.error);
