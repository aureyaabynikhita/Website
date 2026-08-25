/**
 * Script: update-images-final.ts
 * Run with: npx tsx scripts/update-images-final.ts
 * 
 * Copies images from "Aureyaa Final Webiste images" folder to public/images/products/
 * and updates Firestore documents with new image URLs.
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import fs from "fs";
import path from "path";
import { adminDb } from "../src/firebase/admin";
import { COLLECTIONS } from "../src/types/firestore";
import { FieldValue } from "firebase-admin/firestore";

const SOURCE_DIR = "C:\\Users\\lenovo\\Downloads\\Aureyaa Final Webiste images";

// Maps folder name (case-insensitive) => Firestore product ID (same as upload-listings.ts generates)
const folderToProductId: Record<string, string> = {
  "ada cherry red":      "prod-ada-cherry-red",
  "afreen ivory purple": "prod-afreen-ivory-purple",
  "mooh black":          "prod-mooh-black",
  "mooh bottle green":   "prod-mooh-bottle-green",
  "mooh green":          "prod-mooh-green",
  "mooh grey":           "prod-mooh-grey",
  "mooh ivory":          "prod-mooh-ivory",
  "mooh maroon":         "prod-mooh-maroon",
  "naira black":         "prod-naira-black",
  "naira off white":     "prod-naira-off-white",
  "nazakat black":       "prod-nazakat-black",
  "rooh beige":          "prod-rooh-beige",
  "rooh sky blue":       "prod-rooh-sky-blue",
  "sitara red":          "prod-sitara-red",
  "sitara royal blue":   "prod-sitara-royal-blue",
  "zoya black":          "prod-zoya-black",
  "zoya cherry red":     "prod-zoya-cherry-red",
  "zoya jacket black":   "prod-zoya-jacket-black",
};

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

function sanitizeFileName(name: string): string {
  // Convert spaces and special chars to underscores, keep extension
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  const sanitized = base
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/__+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${sanitized}${ext.toLowerCase()}`;
}

function copyImageToPublic(srcPath: string, productId: string, destFileName: string): string {
  const destDir = path.join(process.cwd(), "public", "images", "products", productId);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const destPath = path.join(destDir, destFileName);
  fs.copyFileSync(srcPath, destPath);
  return `/images/products/${productId}/${destFileName}`;
}

async function main() {
  console.log("=== Aureyaa Image Updater ===\n");
  
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  const folders = fs.readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  console.log(`Found ${folders.length} product folders.\n`);
  
  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const folder of folders) {
    const folderLower = folder.toLowerCase();
    const productId = folderToProductId[folderLower];
    
    if (!productId) {
      console.warn(`⚠ Skipping unknown folder: "${folder}"`);
      totalSkipped++;
      continue;
    }

    const folderPath = path.join(SOURCE_DIR, folder);
    const files = fs.readdirSync(folderPath);
    const imageFiles = files.filter(f => 
      IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase())
    );

    if (imageFiles.length === 0) {
      console.log(`⚠ No images in "${folder}" — skipping`);
      totalSkipped++;
      continue;
    }

    console.log(`📁 Processing "${folder}" (${productId}) — ${imageFiles.length} images`);

    // Clean old images from public dir for this product
    const destDir = path.join(process.cwd(), "public", "images", "products", productId);
    if (fs.existsSync(destDir)) {
      const oldFiles = fs.readdirSync(destDir);
      for (const oldFile of oldFiles) {
        fs.unlinkSync(path.join(destDir, oldFile));
      }
      console.log(`  🗑 Cleared ${oldFiles.length} old images`);
    }

    // Copy new images
    const imageUrls: string[] = [];
    let index = 1;
    
    for (const file of imageFiles.sort()) {
      const srcPath = path.join(folderPath, file);
      const ext = path.extname(file).toLowerCase();
      // Use a clean sequential name: product-id-01.png etc
      const cleanName = `${productId}-${String(index).padStart(2, "0")}${ext}`;
      
      try {
        const url = copyImageToPublic(srcPath, productId, cleanName);
        imageUrls.push(url);
        console.log(`  ✓ Copied: ${file} → ${cleanName}`);
        index++;
      } catch (err: any) {
        console.error(`  ✗ Error copying ${file}: ${err.message}`);
        totalErrors++;
      }
    }

    if (imageUrls.length === 0) {
      console.error(`  ✗ No images copied for "${folder}" — skipping Firestore update`);
      totalErrors++;
      continue;
    }

    // Update Firestore
    try {
      const productRef = adminDb.collection(COLLECTIONS.products).doc(productId);
      const snap = await productRef.get();
      
      if (snap.exists) {
        await productRef.update({
          images: imageUrls,
          updatedAt: FieldValue.serverTimestamp(),
        });
        console.log(`  ✅ Firestore updated: ${imageUrls.length} images set for "${productId}"`);
      } else {
        // Product doesn't exist yet — log a warning, don't crash
        console.warn(`  ⚠ Product "${productId}" not found in Firestore (run upload-listings.ts first)`);
      }
      totalUpdated++;
    } catch (err: any) {
      console.error(`  ✗ Firestore error for "${productId}": ${err.message}`);
      totalErrors++;
    }

    console.log("");
  }

  console.log("=== Done ===");
  console.log(`✅ Updated: ${totalUpdated} products`);
  console.log(`⚠ Skipped: ${totalSkipped} folders`);
  console.log(`✗ Errors:  ${totalErrors}`);
  console.log("\nRestart 'npm run dev' to see changes.");
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
