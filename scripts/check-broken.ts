import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

async function check() {
  const ids = ["prod-nazakat-black", "prod-sitara-royal-blue", "prod-zoya-cherry-red", "prod-zoya-jacket-black"];
  for (const id of ids) {
    const doc = await db.collection("products").doc(id).get();
    console.log(id, "->", doc.data()?.images);
  }
}
check().catch(console.error);
