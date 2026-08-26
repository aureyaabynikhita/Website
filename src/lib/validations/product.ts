import { z } from "zod";

export const productVariantSchema = z.object({
  id: z.string(),
  size: z.string(),
  color: z.string().default("Original"),
  price: z.coerce.number().positive("Must be greater than 0"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  sku: z.string().optional(),
});

export const productFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().min(5, "Description is required"),
  fabricDetails: z.string().optional().default("Premium Silk & Georgette"),
  washCare: z.string().optional().default("Dry Clean Only"),
  stylingTips: z.string().optional(),
  categoryId: z.string().min(1, "Select a category"),
  basePrice: z.coerce.number().positive("Must be greater than 0"),
  compareAtPrice: z.coerce.number().optional().nullable(),
  images: z.union([z.string(), z.array(z.string())]),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
  variants: z.array(productVariantSchema).optional(),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("published"),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;

