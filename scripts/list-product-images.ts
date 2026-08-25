import fs from "fs";
import path from "path";

const productsDir = path.join(process.cwd(), "public", "images", "products");
const folders = fs.readdirSync(productsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log("=== All Product Image Lists ===");
for (const folder of folders) {
  const files = fs.readdirSync(path.join(productsDir, folder));
  console.log(`\n📁 ${folder} (${files.length} images):`);
  files.forEach((f, i) => console.log(`   [${i}] ${f}`));
}
