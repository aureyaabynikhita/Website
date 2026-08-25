import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { initializeApp, getApps, cert } from "firebase-admin/app";
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

const db = getFirestore();

async function run() {
  const productId = "prod-mooh-grey";
  const targetSize = "XXL";

  const ref = db.collection("products").doc(productId);
  const snap = await ref.get();

  if (!snap.exists) {
    console.log("❌ Product not found:", productId);
    return;
  }

  const data = snap.data()!;
  const variants = data.variants ?? [];

  console.log("Current variants:");
  variants.forEach((v: any) => console.log(`  size=${v.size}  stock=${v.stock}`));

  const updated = variants.map((v: any) => {
    if (v.size?.toUpperCase() === targetSize) {
      console.log(`\n✅ Setting ${targetSize} stock: ${v.stock} → 0`);
      return { ...v, stock: 0 };
    }
    return v;
  });

  await ref.update({ variants: updated, updatedAt: FieldValue.serverTimestamp() });
  console.log("\n✅ Done! Mooh Grey XXL is now OUT OF STOCK in Firestore.");
}

run().catch(console.error);
