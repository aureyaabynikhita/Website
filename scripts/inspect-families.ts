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

async function inspectFamilies() {
  const snap = await db.collection("products").get();
  const products = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Group by family prefix
  const families: Record<string, any[]> = {};
  for (const p of products as any[]) {
    // Extract base family name (e.g. "Mooh", "Rooh", "Naira", "Sitara", "Zoya", "Ada", "Afreen")
    const titleLower = p.title.toLowerCase();
    let family = "Other";
    if (titleLower.includes("mooh")) family = "Mooh";
    else if (titleLower.includes("rooh")) family = "Rooh";
    else if (titleLower.includes("naira")) family = "Naira";
    else if (titleLower.includes("sitara")) family = "Sitara";
    else if (titleLower.includes("zoya")) family = "Zoya";
    else if (titleLower.includes("ada")) family = "Ada";
    else if (titleLower.includes("afreen")) family = "Afreen";
    else if (titleLower.includes("nazakat")) family = "Nazakat";

    if (!families[family]) families[family] = [];
    families[family].push(p);
  }

  console.log("=== Product Color Families ===");
  for (const [fam, prods] of Object.entries(families)) {
    console.log(`\nFamily "${fam}" (${prods.length} styles/colors):`);
    prods.forEach(p => {
      console.log(`  - ${p.title} (slug: ${p.slug}, img: ${p.images?.[0]})`);
    });
  }
}

inspectFamilies().catch(console.error);
