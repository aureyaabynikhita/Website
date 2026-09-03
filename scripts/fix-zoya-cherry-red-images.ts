/**
 * Script: fix-zoya-cherry-red-images.ts
 * Run with: npx tsx scripts/fix-zoya-cherry-red-images.ts
 * 
 * Updates Firestore to remove photos 3 and 4 from Zoya Cherry Red
 * and set the correct 5-image sequence.
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { adminDb } from "../src/firebase/admin";
import { COLLECTIONS } from "../src/types/firestore";
import { FieldValue } from "firebase-admin/firestore";

async function main() {
  const productId = "prod-zoya-cherry-red";
  const newImages = [
    "/images/products/prod-zoya-cherry-red/prod-zoya-cherry-red-01.png",
    "/images/products/prod-zoya-cherry-red/prod-zoya-cherry-red-02.png",
    "/images/products/prod-zoya-cherry-red/prod-zoya-cherry-red-03.png",
    "/images/products/prod-zoya-cherry-red/prod-zoya-cherry-red-04.png",
    "/images/products/prod-zoya-cherry-red/prod-zoya-cherry-red-05.png",
  ];

  const ref = adminDb.collection(COLLECTIONS.products).doc(productId);
  const snap = await ref.get();

  if (!snap.exists) {
    console.error(`Product "${productId}" not found in Firestore.`);
    process.exit(1);
  }

  const oldImages = snap.data()?.images || [];
  console.log(`Old images (${oldImages.length}):`, oldImages);
  console.log(`\nNew images (${newImages.length}):`, newImages);

  await ref.update({
    images: newImages,
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log(`\n✅ Firestore updated for "${productId}" — ${newImages.length} images set.`);
}

main().catch(console.error);
