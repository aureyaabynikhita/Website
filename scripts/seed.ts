/**
 * Run with: npx tsx scripts/seed.ts
 * Requires the same FIREBASE_* admin env vars as the app (.env.local).
 * Populates enough sample data to preview the homepage — NOT for production use.
 */
import { adminDb } from "../src/firebase/admin";
import { COLLECTIONS } from "../src/types/firestore";
import { FieldValue } from "firebase-admin/firestore";

const categories = [
  { id: "cat-gowns", slug: "gowns", name: "Gowns", image: "/images/cat-gowns.png", order: 1 },
  { id: "cat-sarees", slug: "sarees", name: "Sarees", image: "/images/cat-sarees.png", order: 2 },
  { id: "cat-coords", slug: "co-ords", name: "Co-ords", image: "/images/cat-coords.png", order: 3 },
  { id: "cat-jackets", slug: "jackets", name: "Jackets", image: "/images/cat-jackets.png", order: 4 },
];

const products = [
  {
    id: "prod-aria-gown",
    slug: "aria-silk-drape-gown",
    title: "Aria Silk Drape Gown",
    description: "A fluid silk gown cut for effortless movement.",
    fabricDetails: "100% mulberry silk",
    washCare: "Dry clean only",
    categoryId: "cat-gowns",
    collectionIds: [],
    images: ["/images/placeholder-1.png"],
    basePrice: 24500,
    tags: ["gown", "silk", "new"],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod-noor-set",
    slug: "noor-hand-embroidered-set",
    title: "Noor Hand-Embroidered Set",
    description: "Hand-embroidered occasion set with heirloom detailing.",
    fabricDetails: "Chanderi silk with zari embroidery",
    washCare: "Dry clean only",
    categoryId: "cat-coords",
    collectionIds: [],
    images: ["/images/placeholder-2.png"],
    basePrice: 31200,
    tags: ["co-ord", "embroidered", "new"],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "prod-meera-saree",
    slug: "meera-bandhani-saree",
    title: "Meera Bandhani Saree",
    description: "Traditional bandhani work on a modern drape.",
    fabricDetails: "Pure georgette",
    washCare: "Dry clean recommended",
    categoryId: "cat-sarees",
    collectionIds: [],
    images: ["/images/placeholder-5.png"],
    basePrice: 21800,
    tags: ["saree", "bandhani", "bestseller"],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "prod-kavya-jacket",
    slug: "kavya-velvet-jacket",
    title: "Kavya Velvet Jacket",
    description: "A structured velvet jacket for evening layering.",
    fabricDetails: "Silk velvet, satin lining",
    washCare: "Dry clean only",
    categoryId: "cat-jackets",
    collectionIds: [],
    images: ["/images/placeholder-6.png"],
    basePrice: 27600,
    tags: ["jacket", "velvet", "bestseller"],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
  },
];

async function seed() {
  console.log("Seeding categories...");
  for (const cat of categories) {
    await adminDb
      .collection(COLLECTIONS.categories)
      .doc(cat.id)
      .set({ ...cat, parentId: null, seo: { metaTitle: cat.name, metaDescription: "" } });
  }

  console.log("Seeding products...");
  for (const p of products) {
    await adminDb
      .collection(COLLECTIONS.products)
      .doc(p.id)
      .set({
        ...p,
        variants: [
          { id: `${p.id}-s`, size: "S", color: "Default", sku: `${p.id}-S`, price: p.basePrice, stock: 12 },
          { id: `${p.id}-m`, size: "M", color: "Default", sku: `${p.id}-M`, price: p.basePrice, stock: 8 },
          { id: `${p.id}-l`, size: "L", color: "Default", sku: `${p.id}-L`, price: p.basePrice, stock: 5 },
        ],
        ratingAverage: 4.7,
        ratingCount: 12,
        seo: { metaTitle: p.title, metaDescription: p.description },
        status: "published",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
  }

  console.log("Done. Restart `npm run dev` and refresh the homepage.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
