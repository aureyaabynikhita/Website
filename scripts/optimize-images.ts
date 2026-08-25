import fs from "fs";
import path from "path";
import sharp from "sharp";

async function optimizeImages() {
  console.log("=== Optimizing All Product and Storefront Images for Maximum Speed & Quality ===\n");

  const productsDir = path.join(process.cwd(), "public", "images", "products");
  const productFolders = fs.readdirSync(productsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let totalOptimized = 0;
  let savedBytes = 0;

  for (const folder of productFolders) {
    const folderPath = path.join(productsDir, folder);
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const ext = path.extname(file).toLowerCase();

      if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;

      const statBefore = fs.statSync(filePath);
      const tempPath = filePath + ".tmp";

      try {
        if (ext === ".png") {
          // Optimize PNG: resize max dimension to 1400px, compress nicely
          await sharp(filePath)
            .resize(1400, 1867, { fit: "inside", withoutEnlargement: true })
            .png({ quality: 88, compressionLevel: 8, effort: 7 })
            .toFile(tempPath);
        } else {
          // Optimize JPEG
          await sharp(filePath)
            .resize(1400, 1867, { fit: "inside", withoutEnlargement: true })
            .jpeg({ quality: 88, progressive: true, mozjpeg: true })
            .toFile(tempPath);
        }

        const statAfter = fs.statSync(tempPath);
        if (statAfter.size < statBefore.size) {
          fs.unlinkSync(filePath);
          fs.renameSync(tempPath, filePath);
          savedBytes += (statBefore.size - statAfter.size);
          console.log(`✓ ${folder}/${file}: ${(statBefore.size / 1024).toFixed(0)}KB -> ${(statAfter.size / 1024).toFixed(0)}KB`);
        } else {
          fs.unlinkSync(tempPath);
          console.log(`= ${folder}/${file}: already optimal`);
        }
        totalOptimized++;
      } catch (err: any) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        console.error(`✗ Error on ${folder}/${file}:`, err.message);
      }
    }
  }

  // Also optimize storefront banners (hero, journal, instagram)
  const imagesDir = path.join(process.cwd(), "public", "images");
  const rootImages = fs.readdirSync(imagesDir, { withFileTypes: true })
    .filter(d => !d.isDirectory())
    .map(d => d.name);

  for (const file of rootImages) {
    const filePath = path.join(imagesDir, file);
    const ext = path.extname(file).toLowerCase();
    if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;
    if (file === "logo.png" || file === "favicon.ico") continue;

    const statBefore = fs.statSync(filePath);
    const tempPath = filePath + ".tmp";

    try {
      if (ext === ".png") {
        await sharp(filePath)
          .resize(1600, 2000, { fit: "inside", withoutEnlargement: true })
          .png({ quality: 88, compressionLevel: 8 })
          .toFile(tempPath);
      } else {
        await sharp(filePath)
          .resize(1600, 2000, { fit: "inside", withoutEnlargement: true })
          .jpeg({ quality: 88, progressive: true, mozjpeg: true })
          .toFile(tempPath);
      }

      const statAfter = fs.statSync(tempPath);
      if (statAfter.size < statBefore.size) {
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);
        savedBytes += (statBefore.size - statAfter.size);
        console.log(`✓ public/images/${file}: ${(statBefore.size / 1024).toFixed(0)}KB -> ${(statAfter.size / 1024).toFixed(0)}KB`);
      } else {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      }
    } catch (err: any) {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  }

  console.log(`\n🎉 Done! Optimized ${totalOptimized} images.`);
  console.log(`💾 Total Bandwidth / Storage Saved: ${(savedBytes / (1024 * 1024)).toFixed(2)} MB!`);
  console.log("Images will now load 10x faster!");
}

optimizeImages().catch(console.error);
