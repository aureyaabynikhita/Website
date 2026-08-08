import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { adminDb } from "../src/firebase/admin";
import { COLLECTIONS } from "../src/types/firestore";

async function main() {
  const cats = await adminDb.collection(COLLECTIONS.categories).get();
  console.log("Existing Categories:");
  cats.forEach(doc => {
    console.log(doc.id, "=>", doc.data());
  });

  const prods = await adminDb.collection(COLLECTIONS.products).get();
  console.log("\nExisting Products count:", prods.size);
}

main().catch(console.error);
