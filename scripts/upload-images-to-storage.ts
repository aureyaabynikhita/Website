/**
 * Script: upload-images-to-storage.ts
 * Run with: npx tsx scripts/upload-images-to-storage.ts
 *
 * Uploads all images from "Aureyaa Final Webiste images" folder
 * to Firebase Storage and updates Firestore with permanent public URLs.
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import fs from "fs";
import path from "path";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { COLLECTIONS } from "../src/types/firestore";

// ── Init Firebase Admin ───────────────────────────────────────────────────────
const projectId = process.env.FIREBASE_PROJECT_ID!;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n");
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!;

if (!getApps().length) {
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });
}

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });
const bucket = getStorage().bucket();

// ── Config ────────────────────────────────────────────────────────────────────
const SOURCE_DIR = "C:\\Users\\lenovo\\Downloads\\Aureyaa Final Webiste images";
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Maps folder name (lower-case) → Firestore product ID
const FOLDER_TO_PRODUCT_ID: Record<string, string> = {
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

// ── Helper: Upload one file to Firebase Storage ───────────────────────────────
async function uploadToStorage(
  localPath: string,
  storagePath: string,
  mimeType: string
): Promise<string> {
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType: mimeType,
      cacheControl: "public, max-age=31536000", // 1-year cache
    },
  });

  // Make the file publicly accessible
  const file = bucket.file(storagePath);
  await file.makePublic();

  // Return the permanent public URL
  return `https://storage.googleapis.com/${storageBucket}/${storagePath}`;
}

function getMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const map: Record<string, string> = {
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png":  "image/png",
    ".webp": "image/webp",
    ".gif":  "image/gif",
  };
  return map[ext] || "image/jpeg";
}

// ── Delete old Storage images for a product ───────────────────────────────────
async function deleteOldStorageImages(productId: string) {
  try {
    const [files] = await bucket.getFiles({ prefix: `products/${productId}/` });
    if (files.length === 0) return;
    await Promise.all(files.map((f) => f.delete()));
    console.log(`  🗑  Deleted ${files.length} old Storage files`);
  } catch {
    // Ignore if folder doesn't exist yet
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  Aureyaa — Firebase Storage Image Uploader   ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Source directory not found:\n   ${SOURCE_DIR}`);
    process.exit(1);
  }

  const folders = fs
    .readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  console.log(`Found ${folders.length} product folders.\n`);

  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const folder of folders) {
    const productId = FOLDER_TO_PRODUCT_ID[folder.toLowerCase()];

    if (!productId) {
      console.warn(`⚠  Unknown folder: "${folder}" — skipping`);
      totalSkipped++;
      continue;
    }

    const folderPath = path.join(SOURCE_DIR, folder);
    const allFiles = fs.readdirSync(folderPath);
    const imageFiles = allFiles
      .filter((f) => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()))
      .sort();

    if (imageFiles.length === 0) {
      console.warn(`⚠  No images in "${folder}" — skipping`);
      totalSkipped++;
      continue;
    }

    console.log(`\n📁 "${folder}"  →  ${productId}  (${imageFiles.length} images)`);

    // 1. Delete old Storage images
    await deleteOldStorageImages(productId);

    // 2. Upload new images
    const publicUrls: string[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const fileName = imageFiles[i];
      const localPath = path.join(folderPath, fileName);
      const ext = path.extname(fileName).toLowerCase();
      const storageName = `${productId}-${String(i + 1).padStart(2, "0")}${ext}`;
      const storagePath = `products/${productId}/${storageName}`;

      try {
        const url = await uploadToStorage(localPath, storagePath, getMimeType(fileName));
        publicUrls.push(url);
        console.log(`  ✓ [${i + 1}/${imageFiles.length}] ${fileName}`);
      } catch (err: any) {
        console.error(`  ✗ Failed: ${fileName} — ${err.message}`);
        totalErrors++;
      }
    }

    if (publicUrls.length === 0) {
      console.error(`  ✗ No images uploaded for "${productId}" — Firestore NOT updated`);
      totalErrors++;
      continue;
    }

    // 3. Update Firestore with new Storage URLs
    try {
      const ref = db.collection(COLLECTIONS.products).doc(productId);
      const snap = await ref.get();

      if (snap.exists) {
        await ref.update({
          images: publicUrls,
          updatedAt: FieldValue.serverTimestamp(),
        });
        console.log(`  ✅ Firestore updated — ${publicUrls.length} images`);
        console.log(`     First URL: ${publicUrls[0]}`);
      } else {
        console.warn(`  ⚠  Product "${productId}" not in Firestore yet.`);
        console.warn(`     Run upload-listings.ts first, then re-run this script.`);
      }

      totalUpdated++;
    } catch (err: any) {
      console.error(`  ✗ Firestore error for "${productId}": ${err.message}`);
      totalErrors++;
    }
  }

  console.log("\n╔══════════════════════════╗");
  console.log("║        Summary           ║");
  console.log("╠══════════════════════════╣");
  console.log(`║  ✅ Updated  : ${String(totalUpdated).padEnd(10)}║`);
  console.log(`║  ⚠  Skipped : ${String(totalSkipped).padEnd(10)}║`);
  console.log(`║  ✗  Errors  : ${String(totalErrors).padEnd(10)}║`);
  console.log("╚══════════════════════════╝");
  console.log("\nImages are now live on Firebase Storage.");
  console.log("No need to restart dev server — URLs are permanent cloud links.\n");
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err);
  process.exit(1);
});
