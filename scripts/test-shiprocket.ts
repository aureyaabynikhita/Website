import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { checkShiprocketServiceability } from "../src/services/shipping/shiprocket";

async function testShiprocket() {
  console.log("Testing Shiprocket API authentication and serviceability...");
  console.log("Email:", process.env.SHIPROCKET_EMAIL);

  try {
    const res = await checkShiprocketServiceability("400102", "110001", 0.5);
    console.log("\n✅ Shiprocket Connected Successfully!");
    console.log("Live Serviceability Result:\n", JSON.stringify(res, null, 2));
  } catch (error: any) {
    console.log("\nShiprocket API Response:", error.message);
  }
}

testShiprocket().catch(console.error);
