import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import fs from "fs";
import path from "path";
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

async function diagnose() {
  const snap = await db.collection("products").get();
  console.log(`\n=== Total Firestore Products: ${snap.size} ===\n`);

  for (const doc of snap.docs) {
    const data = doc.data();
    const images: string[] = data.images || [];
    const firstImg = images[0] || "NO_IMAGES";
    let exists = false;
    if (firstImg.startsWith("/")) {
      exists = fs.existsSync(path.join(process.cwd(), "public", firstImg));
    }
    console.log(`${doc.id.padEnd(26)} | ${data.title.padEnd(24)} | Imgs: ${images.length} | First: ${firstImg} (Exists: ${exists}) | Status: ${data.status}`);
  }

  // Also check category images
  console.log("\n=== Categories ===");
  const catSnap = await db.collection("categories").get();
  for (const doc of catSnap.docs) {
    const data = doc.data();
    const img = data.image || "NO_IMAGE";
    let exists = false;
    if (img.startsWith("/")) {
      exists = fs.existsSync(path.join(process.cwd(), "public", img));
    }
    console.log(`${doc.id.padEnd(20)} | ${data.name.padEnd(16)} | Img: ${img} (Exists: ${exists})`);
  }
}

diagnose().catch(console.error);
