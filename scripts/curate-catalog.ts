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

async function updateCategoriesAndProducts() {
  console.log("Updating Categories in Firestore...");

  const categories = [
    {
      id: "cat-coords",
      slug: "coords",
      name: "Co-Ord Sets",
      image: "/images/products/prod-mooh-ivory/prod-mooh-ivory-01.png",
      order: 1,
      seo: { metaTitle: "Luxury Co-Ord Sets | AUREYAA", metaDescription: "Explore handcrafted Indo-Western co-ord sets by AUREYAA." }
    },
    {
      id: "cat-sarees",
      slug: "sarees",
      name: "Drape Sarees",
      image: "/images/products/prod-zoya-cherry-red/prod-zoya-cherry-red-01.png",
      order: 2,
      seo: { metaTitle: "Designer Drape Sarees | AUREYAA", metaDescription: "Modern drape sarees with heirloom elegance." }
    },
    {
      id: "cat-drape-skirts",
      slug: "drape-skirts",
      name: "Drape Skirts",
      image: "/images/products/prod-sitara-royal-blue/prod-sitara-royal-blue-01.png",
      order: 3,
      seo: { metaTitle: "Indo-Western Drape Skirts | AUREYAA", metaDescription: "Flowy, dramatic drape skirts for celebratory evenings." }
    },
  ];

  for (const cat of categories) {
    await db.collection("categories").doc(cat.id).set(cat, { merge: true });
    console.log(`✓ Category updated: ${cat.name} -> ${cat.image}`);
  }

  // Curate products with proper BestSeller, Featured, and NewArrival tags
  console.log("\nCurating Products for Premium Placing...");

  const bestSellerIds = [
    "prod-mooh-ivory",
    "prod-zoya-cherry-red",
    "prod-nazakat-black",
    "prod-sitara-royal-blue",
    "prod-rooh-sky-blue",
    "prod-naira-off-white",
    "prod-mooh-bottle-green",
    "prod-zoya-jacket-black"
  ];

  const featuredIds = [
    "prod-sitara-red",
    "prod-ada-cherry-red",
    "prod-rooh-beige",
    "prod-mooh-maroon",
    "prod-zoya-black",
    "prod-mooh-green"
  ];

  const snap = await db.collection("products").get();
  for (const doc of snap.docs) {
    const isBest = bestSellerIds.includes(doc.id);
    const isFeat = featuredIds.includes(doc.id);
    await doc.ref.update({
      isNewArrival: true, // all current items are from the new collection
      isBestSeller: isBest,
      isFeatured: isFeat,
      updatedAt: FieldValue.serverTimestamp()
    });
    console.log(`✓ Product [${doc.id}]: BestSeller=${isBest}, Featured=${isFeat}`);
  }

  console.log("\n✅ All categories and product placements updated in Firestore!");
}

updateCategoriesAndProducts().catch(console.error);
