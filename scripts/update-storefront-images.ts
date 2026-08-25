import fs from "fs";
import path from "path";
import sharp from "sharp";

async function updateStorefrontImages() {
  const images = [
    { src: "public/images/products/prod-mooh-ivory/prod-mooh-ivory-01.png", dest: "public/images/journal-1.jpg" },
    { src: "public/images/products/prod-mooh-maroon/prod-mooh-maroon-01.png", dest: "public/images/journal-2.jpg" },
    { src: "public/images/products/prod-naira-black/prod-naira-black-01.png", dest: "public/images/journal-3.jpg" },
    { src: "public/images/products/prod-mooh-ivory/prod-mooh-ivory-01.png", dest: "public/images/instagram-1.jpg" },
    { src: "public/images/products/prod-zoya-cherry-red/prod-zoya-cherry-red-01.png", dest: "public/images/instagram-2.jpg" },
    { src: "public/images/products/prod-sitara-royal-blue/prod-sitara-royal-blue-01.png", dest: "public/images/instagram-3.jpg" },
    { src: "public/images/products/prod-afreen-ivory-purple/prod-afreen-ivory-purple-01.png", dest: "public/images/instagram-4.jpg" },
    { src: "public/images/products/prod-naira-off-white/prod-naira-off-white-01.png", dest: "public/images/instagram-5.jpg" },
    { src: "public/images/products/prod-nazakat-black/prod-nazakat-black-01.png", dest: "public/images/instagram-6.jpg" },
  ];

  for (const item of images) {
    const srcPath = path.join(process.cwd(), item.src);
    const destPath = path.join(process.cwd(), item.dest);
    if (fs.existsSync(srcPath)) {
      await sharp(srcPath)
        .resize(800, 1000, { fit: "cover", position: "top" })
        .jpeg({ quality: 90 })
        .toFile(destPath + ".tmp");
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      fs.renameSync(destPath + ".tmp", destPath);
      console.log(`✓ Updated ${item.dest} from ${item.src}`);
    }
  }

  console.log("\n✅ All Journal & Instagram photos replaced with top-aligned full model portraits!");
}

updateStorefrontImages().catch(console.error);
