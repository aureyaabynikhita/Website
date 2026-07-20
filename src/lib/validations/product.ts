import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  description: z.string().min(10, "Description is too short"),
  fabricDetails: z.string().min(2, "Required"),
  washCare: z.string().min(2, "Required"),
  categoryId: z.string().min(1, "Select a category"),
  basePrice: z.coerce.number().positive("Must be greater than 0"),
  compareAtPrice: z.coerce.number().optional(),
  images: z.string().min(1, "At least one image URL is required"), // comma-separated for now
  tags: z.string().optional(), // comma-separated
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});
export type ProductFormInput = z.infer<typeof productFormSchema>;
