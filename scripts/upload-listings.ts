import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import fs from "fs";
import path from "path";
import { adminDb } from "../src/firebase/admin";
import { COLLECTIONS } from "../src/types/firestore";
import { FieldValue } from "firebase-admin/firestore";

const LISTINGS_DIR = "c:\\Users\\lenovo\\Downloads\\Listings";

interface ProductInfo {
  name: string;
  folder: string;
  category: "INDO WESTERN-CO-ORD SETS" | "INDO WESTERN-drape saree" | "INDO WESTERN-drape skirt";
  color: string;
  sizes: string[];
  mrp: number;
}

const productsToUpload: ProductInfo[] = [
  {
    name: "MOOH IVORY",
    folder: "MOOH ivory",
    category: "INDO WESTERN-CO-ORD SETS",
    color: "Ivory",
    sizes: ["M", "L", "XL", "XXL"],
    mrp: 3823
  },
  {
    name: "NAZAKAT BLACK",
    folder: "NAZAKAT black",
    category: "INDO WESTERN-drape saree",
    color: "Black",
    sizes: ["XXL"],
    mrp: 14431
  },
  {
    name: "Zoya black",
    folder: "ZOYA black",
    category: "INDO WESTERN-drape saree",
    color: "Black",
    sizes: ["L"],
    mrp: 14431
  },
  {
    name: "Zoya cherry red",
    folder: "ZOYA cherry red",
    category: "INDO WESTERN-drape saree",
    color: "Cherry red",
    sizes: ["L"],
    mrp: 14431
  },
  {
    name: "Ada cherry red",
    folder: "ADA cherry red",
    category: "INDO WESTERN-drape skirt",
    color: "Cherry red",
    sizes: ["L"],
    mrp: 12071
  },
  {
    name: "Afreen ivory purple",
    folder: "AFREEN ivory purple",
    category: "INDO WESTERN-drape skirt",
    color: "Ivory purple",
    sizes: ["XL"],
    mrp: 12071
  },
  {
    name: "sitara red",
    folder: "SITARA RED",
    category: "INDO WESTERN-drape skirt",
    color: "Red",
    sizes: ["M"],
    mrp: 12071
  },
  {
    name: "Sitara royal blue",
    folder: "SITARA royal blue",
    category: "INDO WESTERN-drape skirt",
    color: "Royal Blue",
    sizes: ["L"],
    mrp: 12071
  },
  {
    name: "Zoya jacket black",
    folder: "ZOYA jacket black",
    category: "INDO WESTERN-drape skirt",
    color: "Black",
    sizes: ["L"],
    mrp: 14431
  },
  {
    name: "MOOH BLACK",
    folder: "MOOH black",
    category: "INDO WESTERN-CO-ORD SETS",
    color: "Black",
    sizes: ["M", "L", "XL", "XXL"],
    mrp: 2352
  },
  {
    name: "MOOH BOTTLE GREEN",
    folder: "MOOH bottle green",
    category: "INDO WESTERN-CO-ORD SETS",
    color: "Bottle Green",
    sizes: ["M", "L", "XL", "XXL"],
    mrp: 2643
  },
  {
    name: "MOOH GREEN",
    folder: "MOOH green",
    category: "INDO WESTERN-CO-ORD SETS",
    color: "Green",
    sizes: ["M", "L", "XL", "XXL"],
    mrp: 2562
  },
  {
    name: "MOOH GREY",
    folder: "MOOH grey",
    category: "INDO WESTERN-CO-ORD SETS",
    color: "Grey",
    sizes: ["M", "L", "XL", "XXL"],
    mrp: 2643
  },
  {
    name: "MOOH MAROON",
    folder: "MOOH maroon",
    category: "INDO WESTERN-CO-ORD SETS",
    color: "Maroon",
    sizes: ["M", "L", "XL", "XXL"],
    mrp: 2643
  },
  {
    name: "NAIRA BLACK",
    folder: "NAIRA black",
    category: "INDO WESTERN-CO-ORD SETS",
    color: "Black",
    sizes: ["XL"],
    mrp: 12071
  },
  {
    name: "NAIRA OFF WHITE",
    folder: "NAIRA OFF WHITE",
    category: "INDO WESTERN-CO-ORD SETS",
    color: "Off White",
    sizes: ["L"],
    mrp: 12071
  },
  {
    name: "ROOH BEIGE",
    folder: "ROOH BEIGE",
    category: "INDO WESTERN-CO-ORD SETS",
    color: "Beige",
    sizes: ["XL"],
    mrp: 14431
  },
  {
    name: "ROOH SKY BLUE",
    folder: "ROOH SKY BLUE",
    category: "INDO WESTERN-CO-ORD SETS",
    color: "Sky Blue",
    sizes: ["M"],
    mrp: 14431
  }
];

const categoryIdMap = {
  "INDO WESTERN-CO-ORD SETS": "cat-coords",
  "INDO WESTERN-drape saree": "cat-sarees",
  "INDO WESTERN-drape skirt": "cat-drape-skirts"
};

function generateDescription(name: string, category: string, color: string): string {
  const returnPolicyText = `\n\n**Return Policy**:\nWe offer a 7-day return policy for this product. Please note that an unboxing/unpacking video and clear images are mandatory to initiate a return request.`;
  
  if (category.toLowerCase().includes("saree")) {
    return `Elevate your wardrobe with the elegant ${name}. This stunning drape saree features a sophisticated silhouette designed to turn heads. Crafted in a rich ${color} shade, it blends traditional grace with modern Indo-Western aesthetics. Perfect for weddings, festive occasions, and evening celebrations.\n\n**Fabric & Details**:\nPremium flowy fabric with meticulous draping details.\n\n**Wash Care**:\nDry clean only.\n\n**Styling Tip**:\nStyle with statement earrings and a clutch to complete the look.${returnPolicyText}`;
  } else if (category.toLowerCase().includes("skirt")) {
    return `Discover the charm of our ${name} Indo-Western drape skirt. A perfect blend of contemporary style and classic elegance, this skirt features beautiful gathers and a flattering fit in a gorgeous ${color} color. Ideal for making a statement at any festive event or formal gathering.\n\n**Fabric & Details**:\nLightweight and breathable premium fabric with refined drape styling.\n\n**Wash Care**:\nDry clean only.\n\n**Styling Tip**:\nPair with a crop top or matching jacket and traditional heels.${returnPolicyText}`;
  } else {
    return `Indulge in style and comfort with the ${name} Indo-Western Co-ord Set. Designed for the modern woman, this set features a tailored fit, a premium finish, and an eye-catching ${color} colorway. Whether you're heading to a brunch or an evening party, this co-ord set offers effortless sophistication.\n\n**Fabric & Details**:\nHigh-quality fabric designed for comfort and structured style.\n\n**Wash Care**:\nDry clean only.\n\n**Styling Tip**:\nAccessorize with minimalist jewelry and contemporary sandals.${returnPolicyText}`;
  }
}

function copyFileLocal(localFilePath: string, productId: string, fileName: string): string {
  const destDir = path.join(process.cwd(), "public", "images", "products", productId);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  const destPath = path.join(destDir, fileName);
  fs.copyFileSync(localFilePath, destPath);
  return `/images/products/${productId}/${fileName}`;
}

async function main() {
  // Touch adminDb to trigger initialization of the Firebase Admin App proxy
  const skirtCatRef = adminDb.collection(COLLECTIONS.categories).doc("cat-drape-skirts");
  const skirtCatSnap = await skirtCatRef.get();

  // 1. Ensure 'cat-drape-skirts' category exists in Firestore
  if (!skirtCatSnap.exists) {
    console.log("Creating 'cat-drape-skirts' category...");
    await skirtCatRef.set({
      id: "cat-drape-skirts",
      slug: "drape-skirts",
      name: "Drape Skirts",
      image: "/images/cat-skirts.png",
      order: 5,
      parentId: null,
      seo: { metaTitle: "Drape Skirts", metaDescription: "Indo Western drape skirts and skirt sets" }
    });
  }

  // 2. Process and Copy Products
  for (const item of productsToUpload) {
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const productId = `prod-${slug}`;
    const folderPath = path.join(LISTINGS_DIR, item.folder);

    if (!fs.existsSync(folderPath)) {
      console.error(`Folder not found: ${folderPath}`);
      continue;
    }

    const files = fs.readdirSync(folderPath);
    const imageUrls: string[] = [];
    let videoUrl: string | undefined = undefined;

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const isVideo = [".mp4", ".mov", ".webm"].includes(path.extname(file).toLowerCase());
      
      try {
        const relativeUrl = copyFileLocal(filePath, productId, file);
        if (isVideo) {
          videoUrl = relativeUrl;
        } else {
          imageUrls.push(relativeUrl);
        }
      } catch (err: any) {
        console.error(`Error copying file ${file}:`, err.message);
      }
    }

    const categoryId = categoryIdMap[item.category];
    const description = generateDescription(item.name, item.category, item.color);

    // Create variants
    const variants = item.sizes.map((size) => {
      const sizeSlug = size.toLowerCase();
      const colorSlug = item.color.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return {
        id: `${productId}-${sizeSlug}`,
        size,
        color: item.color,
        sku: `${item.name.toUpperCase().replace(/[^A-Z0-9]+/g, "")}-${size.toUpperCase()}`,
        price: item.mrp,
        stock: 10
      };
    });

    console.log(`Writing product ${item.name} to Firestore...`);
    const productDoc = {
      id: productId,
      slug,
      title: item.name,
      description,
      fabricDetails: "Premium blended fabric",
      washCare: "Dry clean only",
      categoryId,
      collectionIds: [],
      images: imageUrls,
      videoUrl: videoUrl || "",
      variants,
      basePrice: item.mrp,
      tags: [item.category.toLowerCase().replace("indo western-", ""), item.color.toLowerCase()],
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      ratingAverage: 5.0,
      ratingCount: 1,
      seo: { metaTitle: item.name, metaDescription: description.substring(0, 150) },
      status: "published" as const,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };

    await adminDb.collection(COLLECTIONS.products).doc(productId).set(productDoc);
    console.log(`Product ${item.name} successfully uploaded!`);
  }

  console.log("All listings have been seeded and processed successfully!");
}

main().catch(console.error);
