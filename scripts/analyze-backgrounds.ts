import fs from "fs";
import path from "path";
import sharp from "sharp";

const productsDir = path.join(process.cwd(), "public", "images", "products");
const folders = fs.readdirSync(productsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

async function analyzeBackgrounds() {
  for (const folder of folders) {
    const dir = path.join(productsDir, folder);
    const files = fs.readdirSync(dir);
    console.log(`\n=== ${folder} ===`);
    for (const f of files) {
      const filePath = path.join(dir, f);
      // Sample the corners to detect white/plain background vs textured/lifestyle
      const image = sharp(filePath);
      const metadata = await image.metadata();
      const stats = await image.stats();
      
      // If min/max channels are very high (close to 255) in dominant or corners, likely white background
      const avgR = stats.channels[0].mean;
      const avgG = stats.channels[1].mean;
      const avgB = stats.channels[2].mean;
      const isWhiteish = avgR > 235 && avgG > 235 && avgB > 235;

      console.log(`  ${f}: ${metadata.width}x${metadata.height}, AvgRGB: (${avgR.toFixed(0)}, ${avgG.toFixed(0)}, ${avgB.toFixed(0)}) -> ${isWhiteish ? "⚪ WHITE BG" : "🎨 LIFESTYLE/WARM"}`);
    }
  }
}

analyzeBackgrounds().catch(console.error);
