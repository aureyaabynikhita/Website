import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { getNewArrivals, getBestSellers, getFeaturedProducts } from "../src/services/products";

async function testQueries() {
  console.log("Testing getNewArrivals()...");
  const newArr = await getNewArrivals();
  console.log(`getNewArrivals returned: ${newArr.length} products`);

  console.log("Testing getBestSellers()...");
  const best = await getBestSellers();
  console.log(`getBestSellers returned: ${best.length} products`);

  console.log("Testing getFeaturedProducts()...");
  const feat = await getFeaturedProducts();
  console.log(`getFeaturedProducts returned: ${feat.length} products`);
}

testQueries().catch(console.error);
