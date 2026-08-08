import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { adminDb } from "../src/firebase/admin";
import { COLLECTIONS } from "../src/types/firestore";

async function main() {
  console.log("Fetching products to make exactly 8 Best Sellers...");

  const productsSnap = await adminDb
    .collection(COLLECTIONS.products)
    .get();

  const products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const bestSellers = products.filter((p: any) => p.isBestSeller);
  
  console.log(`Current Best Sellers count: ${bestSellers.length}`);
  bestSellers.forEach((p: any) => console.log(`- ${p.title} (${p.id})`));

  if (bestSellers.length < 8) {
    const nonBestSellers = products.filter((p: any) => !p.isBestSeller);
    const needed = 8 - bestSellers.length;
    console.log(`Adding ${needed} more products to Best Sellers...`);

    for (let i = 0; i < needed; i++) {
      const candidate = nonBestSellers[i];
      if (candidate) {
        console.log(`Setting isBestSeller=true for: ${candidate.title} (${candidate.id})`);
        await adminDb
          .collection(COLLECTIONS.products)
          .doc(candidate.id)
          .update({ isBestSeller: true });
      }
    }
  }

  console.log("Done!");
}

main().catch(console.error);
