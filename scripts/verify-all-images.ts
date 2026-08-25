import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import fs from "fs";
import path from "path";
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

const SOURCE_DIR = "C:\\Users\\lenovo\\Downloads\\Aureyaa Final Webiste images";
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

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

async function verifyAll() {
  const folders = fs.readdirSync(SOURCE_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let totalSourceImages = 0;
  let totalWebsiteImages = 0;
  let totalFirestoreImages = 0;

  console.log("\n=================== 100% IMAGE VERIFICATION AUDIT ===================\n");

  for (const folder of folders) {
    const folderLower = folder.toLowerCase();
    const productId = FOLDER_TO_PRODUCT_ID[folderLower];

    const sourcePath = path.join(SOURCE_DIR, folder);
    const sourceFiles = fs.readdirSync(sourcePath).filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()));
    totalSourceImages += sourceFiles.length;

    let websiteCount = 0;
    const destDir = path.join(process.cwd(), "public", "images", "products", productId);
    if (fs.existsSync(destDir)) {
      websiteCount = fs.readdirSync(destDir).length;
    }
    totalWebsiteImages += websiteCount;

    let firestoreCount = 0;
    let firestoreUrls: string[] = [];
    if (productId) {
      const doc = await db.collection("products").doc(productId).get();
      if (doc.exists) {
        firestoreUrls = doc.data()?.images || [];
        firestoreCount = firestoreUrls.length;
      }
    }
    totalFirestoreImages += firestoreCount;

    const status = (sourceFiles.length === websiteCount && sourceFiles.length === firestoreCount) ? "✅ 100% MATCH" : "⚠️ MISMATCH";

    console.log(`📁 Folder: "${folder}"`);
    console.log(`   Source Images in Download Folder : ${sourceFiles.length}`);
    console.log(`   Images on Website (public/)      : ${websiteCount}`);
    console.log(`   Images in Live Database          : ${firestoreCount}`);
    console.log(`   Status                           : ${status}\n`);
  }

  console.log("========================== FINAL TOTALS ==========================");
  console.log(`Total Source Images Found in Download : ${totalSourceImages}`);
  console.log(`Total Website Images on Disk          : ${totalWebsiteImages}`);
  console.log(`Total Images Wired in Database        : ${totalFirestoreImages}`);
  console.log("==================================================================\n");
}

verifyAll().catch(console.error);
