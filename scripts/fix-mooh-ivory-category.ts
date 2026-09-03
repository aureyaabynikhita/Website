/**
 * Script: fix-mooh-ivory-category.ts
 * Run with: npx tsx scripts/fix-mooh-ivory-category.ts
 * 
 * 1. Creates 'cat-indo-western' category if it doesn't exist
 * 2. Updates Mooh Ivory's categoryId from 'cat-coords' to 'cat-indo-western'
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { adminDb } from "../src/firebase/admin";
import { COLLECTIONS } from "../src/types/firestore";
import { FieldValue } from "firebase-admin/firestore";

async function main() {
  console.log("=== Fix Mooh Ivory Category ===\n");

  // 1. Create 'cat-indo-western' category if it doesn't exist
  const catRef = adminDb.collection(COLLECTIONS.categories).doc("cat-indo-western");
  const catSnap = await catRef.get();

  if (!catSnap.exists) {
    console.log("Creating 'cat-indo-western' category...");
    await catRef.set({
      id: "cat-indo-western",
      slug: "indo-western",
      name: "Indo-Western",
      image: "/images/products/prod-mooh-ivory/prod-mooh-ivory-01.png",
      order: 6,
      parentId: null,
      seo: {
        metaTitle: "Indo-Western Collection | AUREYAA",
        metaDescription: "Discover AUREYAA's Indo-Western collection — contemporary silhouettes that blend traditional Indian artistry with modern luxury.",
      },
    });
    console.log("✅ Category 'cat-indo-western' created.\n");
  } else {
    console.log("ℹ Category 'cat-indo-western' already exists.\n");
  }

  // 2. Update Mooh Ivory product
  const productId = "prod-mooh-ivory";
  const prodRef = adminDb.collection(COLLECTIONS.products).doc(productId);
  const prodSnap = await prodRef.get();

  if (!prodSnap.exists) {
    console.error(`Product "${productId}" not found in Firestore.`);
    process.exit(1);
  }

  const currentCategoryId = prodSnap.data()?.categoryId;
  console.log(`Current categoryId: "${currentCategoryId}"`);

  await prodRef.update({
    categoryId: "cat-indo-western",
    updatedAt: FieldValue.serverTimestamp(),
  });

  console.log(`✅ Updated "${productId}" categoryId: "${currentCategoryId}" → "cat-indo-western"`);
}

main().catch(console.error);
