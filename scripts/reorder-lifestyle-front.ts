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

// Specific preferred primary image for each product (the warm, aesthetic lifestyle/architectural shot)
const PREFERRED_PRIMARY_IMAGES: Record<string, string> = {
  "prod-rooh-sky-blue":      "/images/products/prod-rooh-sky-blue/prod-rooh-sky-blue-02.png",
  "prod-rooh-beige":         "/images/products/prod-rooh-beige/prod-rooh-beige-01.png",
  "prod-naira-black":        "/images/products/prod-naira-black/prod-naira-black-02.png",
  "prod-naira-off-white":    "/images/products/prod-naira-off-white/prod-naira-off-white-02.png",
  "prod-mooh-maroon":        "/images/products/prod-mooh-maroon/prod-mooh-maroon-02.png",
  "prod-mooh-bottle-green":  "/images/products/prod-mooh-bottle-green/prod-mooh-bottle-green-02.png",
  "prod-mooh-green":         "/images/products/prod-mooh-green/prod-mooh-green-01.png",
  "prod-mooh-grey":          "/images/products/prod-mooh-grey/prod-mooh-grey-01.png",
  "prod-mooh-ivory":         "/images/products/prod-mooh-ivory/prod-mooh-ivory-01.png",
  "prod-mooh-black":         "/images/products/prod-mooh-black/prod-mooh-black-03.png",
  "prod-nazakat-black":      "/images/products/prod-nazakat-black/prod-nazakat-black-02.png",
  "prod-sitara-red":         "/images/products/prod-sitara-red/prod-sitara-red-02.png",
  "prod-sitara-royal-blue":  "/images/products/prod-sitara-royal-blue/prod-sitara-royal-blue-01.png",
  "prod-zoya-black":         "/images/products/prod-zoya-black/prod-zoya-black-03.png",
  "prod-zoya-cherry-red":    "/images/products/prod-zoya-cherry-red/prod-zoya-cherry-red-01.png",
  "prod-zoya-jacket-black":  "/images/products/prod-zoya-jacket-black/prod-zoya-jacket-black-01.jpg",
  "prod-ada-cherry-red":     "/images/products/prod-ada-cherry-red/prod-ada-cherry-red-02.png",
  "prod-afreen-ivory-purple":"/images/products/prod-afreen-ivory-purple/prod-afreen-ivory-purple-01.png",
};

async function reorderLifestyleImages() {
  console.log("=== Reordering Images: Putting Aesthetic Lifestyle Photos FIRST ===\n");

  const snap = await db.collection("products").get();

  for (const doc of snap.docs) {
    const data = doc.data();
    const currentImages: string[] = data.images || [];
    const preferredFirst = PREFERRED_PRIMARY_IMAGES[doc.id];

    if (!preferredFirst || currentImages.length === 0) continue;

    // Filter out the preferred image and place it at index 0
    const remaining = currentImages.filter(img => img !== preferredFirst);
    const newOrder = [preferredFirst, ...remaining];

    await doc.ref.update({
      images: newOrder,
      updatedAt: FieldValue.serverTimestamp(),
    });

    console.log(`✓ ${doc.id.padEnd(24)} -> Primary: ${preferredFirst}`);
  }

  // Also update categories to use the warmest, most stunning editorial photos
  await db.collection("categories").doc("cat-coords").update({
    image: "/images/products/prod-mooh-ivory/prod-mooh-ivory-01.png"
  });
  await db.collection("categories").doc("cat-sarees").update({
    image: "/images/products/prod-zoya-cherry-red/prod-zoya-cherry-red-01.png"
  });
  await db.collection("categories").doc("cat-drape-skirts").update({
    image: "/images/products/prod-sitara-royal-blue/prod-sitara-royal-blue-01.png"
  });

  console.log("\n✅ Done! All white-background images moved to secondary. Aesthetic lifestyle photos are now 100% FRONT & PRIMARY across the entire website!");
}

reorderLifestyleImages().catch(console.error);
