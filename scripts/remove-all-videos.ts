/**
 * Script: remove-all-videos.ts
 * Run with: npx tsx scripts/remove-all-videos.ts
 * 
 * 1. Sets videoUrl to "" on all products in Firestore
 * 2. Deletes any video files (.mp4, .mov, .webm) from public/images/products/
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import fs from "fs";
import path from "path";
import { adminDb } from "../src/firebase/admin";
import { COLLECTIONS } from "../src/types/firestore";
import { FieldValue } from "firebase-admin/firestore";

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm", ".avi", ".mkv"];

async function main() {
  console.log("=== Remove All Videos ===\n");

  // 1. Update Firestore — clear videoUrl on all products
  console.log("Step 1: Clearing videoUrl on all Firestore products...\n");
  
  const snap = await adminDb.collection(COLLECTIONS.products).get();
  let updatedCount = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    if (data.videoUrl && data.videoUrl.trim() !== "") {
      await doc.ref.update({
        videoUrl: "",
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`  ✅ Cleared videoUrl on "${doc.id}" (was: "${data.videoUrl}")`);
      updatedCount++;
    }
  }

  console.log(`\n  ${updatedCount} products updated in Firestore.\n`);

  // 2. Delete video files from public/images/products/
  console.log("Step 2: Deleting video files from public/images/products/...\n");
  
  const productsDir = path.join(process.cwd(), "public", "images", "products");
  let deletedCount = 0;

  if (fs.existsSync(productsDir)) {
    const productFolders = fs.readdirSync(productsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const folder of productFolders) {
      const folderPath = path.join(productsDir, folder);
      const files = fs.readdirSync(folderPath);

      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (VIDEO_EXTENSIONS.includes(ext)) {
          const filePath = path.join(folderPath, file);
          fs.unlinkSync(filePath);
          console.log(`  🗑 Deleted: ${folder}/${file}`);
          deletedCount++;
        }
      }
    }
  }

  console.log(`\n  ${deletedCount} video files deleted.\n`);
  console.log("=== Done ===");
}

main().catch(console.error);
