"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Trash2,
  Plus,
  Image as ImageIcon,
  Save,
  CheckCircle,
  AlertCircle,
  Package,
  Layers,
  Sparkles,
} from "lucide-react";
import { productFormSchema, type ProductFormInput } from "@/lib/validations/product";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ProductDoc } from "@/types/firestore";
import { formatPrice } from "@/lib/utils";

const CATEGORIES = [
  { id: "cat-sarees", name: "Drape Sarees" },
  { id: "cat-coords", name: "Co-Ord Sets" },
  { id: "cat-drape-skirts", name: "Drape Skirts" },
  { id: "cat-gowns", name: "Gowns" },
  { id: "cat-jackets", name: "Jackets" },
];

const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

export function ProductForm({ existing }: { existing?: ProductDoc }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  // Default variants if new
  const initialVariants = existing?.variants && existing.variants.length > 0
    ? existing.variants
    : [
        {
          id: `var-${Date.now()}-M`,
          size: "M",
          color: "Original",
          price: existing?.basePrice || 14431,
          stock: 10,
          sku: `${existing?.slug || "prod"}-M`,
        },
        {
          id: `var-${Date.now()}-L`,
          size: "L",
          color: "Original",
          price: existing?.basePrice || 14431,
          stock: 10,
          sku: `${existing?.slug || "prod"}-L`,
        },
      ];

  const [imagesList, setImagesList] = useState<string[]>(
    existing?.images || ["/images/placeholder-1.jpg"]
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: existing
      ? {
          title: existing.title,
          slug: existing.slug,
          description: existing.description,
          fabricDetails: existing.fabricDetails || "Premium Blended Silk & Georgette",
          washCare: existing.washCare || "Professional Dry Clean Only",
          stylingTips: existing.stylingTips || "",
          categoryId: existing.categoryId,
          basePrice: existing.basePrice,
          compareAtPrice: existing.compareAtPrice || undefined,
          images: existing.images,
          tags: existing.tags || [],
          variants: initialVariants,
          isFeatured: existing.isFeatured || false,
          isNewArrival: existing.isNewArrival || false,
          isBestSeller: existing.isBestSeller || false,
          status: existing.status || "published",
        }
      : {
          title: "",
          slug: "",
          description: "",
          fabricDetails: "Premium Blended Silk & Georgette",
          washCare: "Professional Dry Clean Only",
          categoryId: "cat-sarees",
          basePrice: 14431,
          images: imagesList,
          variants: initialVariants,
          status: "published",
          isFeatured: false,
          isNewArrival: true,
          isBestSeller: false,
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const watchedBasePrice = watch("basePrice") || 0;
  const watchedCompareAtPrice = watch("compareAtPrice") || 0;
  const watchedSlug = watch("slug");

  // Handle adding an image
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    const updated = [...imagesList, newImageUrl.trim()];
    setImagesList(updated);
    setValue("images", updated, { shouldDirty: true });
    setNewImageUrl("");
    toast.success("Image added to gallery preview");
  };

  // Handle removing an image
  const handleRemoveImage = (index: number) => {
    const updated = imagesList.filter((_, i) => i !== index);
    setImagesList(updated);
    setValue("images", updated, { shouldDirty: true });
  };

  // Handle setting primary image
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const primary = imagesList[index];
    if (!primary) return;
    const updated: string[] = [primary, ...imagesList.filter((_, i) => i !== index)];
    setImagesList(updated);
    setValue("images", updated, { shouldDirty: true });
    toast.success("Set as primary cover image");
  };

  // Quick add size variant
  const handleAddQuickSize = (size: string) => {
    append({
      id: `var-${Date.now()}-${size.toLowerCase()}`,
      size,
      color: "Original",
      price: watchedBasePrice || 14431,
      stock: 10,
      sku: `${watchedSlug || "prod"}-${size}`,
    });
  };

  async function onSubmit(data: ProductFormInput) {
    try {
      const payload = {
        ...data,
        id: existing?.id,
        images: imagesList,
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || "Failed to save product");
      }

      toast.success(existing ? "Product updated successfully!" : "Product published successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      console.error("Save product error:", err);
      toast.error(err?.message || "Could not save product changes.");
    }
  }

  async function handleDelete() {
    if (!existing?.id) return;
    if (!confirm(`Are you sure you want to permanently delete "${existing.title}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: existing.id }),
      });

      if (!res.ok) throw new Error("Delete failed");
      toast.success("Product deleted");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error("Failed to delete product.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8 max-w-5xl pb-24">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-beige/40 p-4 border border-charcoal/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-charcoal/70 hover:text-burgundy transition-colors"
          >
            <ArrowLeft size={16} /> Back to Products
          </Link>
          {existing && (
            <span className="text-[11px] font-mono bg-charcoal/10 text-charcoal/70 px-2 py-0.5 border border-charcoal/10">
              ID: {existing.id}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {existing && (
            <>
              <Link
                href={`/product/${existing.slug}`}
                target="_blank"
                className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-burgundy hover:text-burgundy-light transition-colors px-3 py-2 border border-burgundy/20 hover:bg-burgundy/5"
              >
                <ExternalLink size={14} /> View Live on Store
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-error hover:bg-error/10 transition-colors px-3 py-2 border border-error/20"
              >
                <Trash2 size={14} /> {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* 1. Basic Details Card */}
        <div className="bg-ivory border border-charcoal/10 p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-charcoal/10 pb-3">
            <Package size={18} className="text-burgundy" />
            <h2 className="font-serif text-lg text-charcoal tracking-wide">General Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Product Title"
              placeholder="e.g. MOOH IVORY"
              error={errors.title?.message}
              {...register("title")}
            />
            <Input
              label="URL Slug"
              placeholder="e.g. mooh-ivory"
              error={errors.slug?.message}
              {...register("slug")}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs tracking-[0.15em] uppercase text-charcoal/70 font-semibold">
              Category
            </label>
            <select
              className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
              {...register("categoryId")}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.id})
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-error">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-xs tracking-[0.15em] uppercase text-charcoal/70 font-semibold">
              Description & Craftsmanship Story
            </label>
            <textarea
              rows={5}
              placeholder="Enter product description, styling details, and silhouettes..."
              className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none font-sans leading-relaxed"
              {...register("description")}
            />
            {errors.description && <p className="mt-1 text-xs text-error">{errors.description.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Fabric & Construction Details"
              placeholder="e.g. Premium Silk Georgette with Hand Embroidery"
              error={errors.fabricDetails?.message}
              {...register("fabricDetails")}
            />
            <Input
              label="Wash & Care Instructions"
              placeholder="e.g. Professional Dry Clean Only"
              error={errors.washCare?.message}
              {...register("washCare")}
            />
          </div>

          <div>
            <Input
              label="Styling Tips (Optional)"
              placeholder="e.g. Pair with statement emerald earrings and gold heels"
              error={errors.stylingTips?.message}
              {...register("stylingTips")}
            />
          </div>
        </div>

        {/* 2. Pricing & Discounts Card */}
        <div className="bg-ivory border border-charcoal/10 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-burgundy font-serif font-bold text-lg">₹</span>
              <h2 className="font-serif text-lg text-charcoal tracking-wide">Pricing & Valuation</h2>
            </div>
            {watchedCompareAtPrice > watchedBasePrice && (
              <span className="text-xs bg-success/10 text-success font-semibold px-2 py-1 border border-success/20">
                {Math.round(((watchedCompareAtPrice - watchedBasePrice) / watchedCompareAtPrice) * 100)}% Discount Visible
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Input
              label="Selling Price (₹ Incl. Taxes)"
              type="number"
              placeholder="14431"
              error={errors.basePrice?.message}
              {...register("basePrice")}
            />
            <Input
              label="Original MRP / Compare Price (₹ Optional)"
              type="number"
              placeholder="18500"
              error={errors.compareAtPrice?.message}
              {...register("compareAtPrice")}
            />
          </div>
        </div>

        {/* 3. Visual Image Gallery Manager */}
        <div className="bg-ivory border border-charcoal/10 p-6 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon size={18} className="text-burgundy" />
              <h2 className="font-serif text-lg text-charcoal tracking-wide">Image Gallery ({imagesList.length})</h2>
            </div>
            <span className="text-[11px] text-charcoal/50 uppercase tracking-wider">
              First image is primary cover
            </span>
          </div>

          {/* Existing Images Thumbnails Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {imagesList.map((url, index) => (
              <div
                key={url + index}
                className="group relative aspect-[3/4] bg-beige/50 border border-charcoal/15 overflow-hidden shadow-xs"
              >
                <Image
                  src={url}
                  alt={`Product view ${index + 1}`}
                  fill
                  className="object-cover object-top"
                />

                {/* Primary Cover Badge */}
                {index === 0 && (
                  <span className="absolute top-2 left-2 bg-burgundy text-ivory text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 shadow-xs z-10">
                    Cover
                  </span>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-1 bg-error text-ivory hover:bg-error/90 transition-colors shadow-xs"
                      aria-label="Remove image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className="w-full py-1 bg-ivory text-charcoal text-[10px] uppercase font-bold tracking-wider hover:bg-gold hover:text-ivory transition-colors"
                    >
                      Make Cover
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Image URL Input */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-charcoal/10">
            <input
              type="text"
              placeholder="/images/products/prod-name/prod-name-01.png or https://..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1 border border-charcoal/20 bg-ivory px-3 py-2 text-xs font-mono focus:border-burgundy focus:outline-none"
            />
            <Button type="button" variant="outline" onClick={handleAddImage} className="text-xs uppercase shrink-0">
              <Plus size={14} /> Add Image
            </Button>
          </div>
        </div>

        {/* 4. Sizes & Variant Inventory Manager */}
        <div className="bg-ivory border border-charcoal/10 p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-charcoal/10 pb-3">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-burgundy" />
              <h2 className="font-serif text-lg text-charcoal tracking-wide">Size & Stock Inventory</h2>
            </div>
            {/* Quick Size Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider text-charcoal/50 mr-1 font-semibold">
                + Quick Add:
              </span>
              {STANDARD_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleAddQuickSize(size)}
                  className="text-[11px] px-2 py-0.5 bg-beige/60 hover:bg-burgundy hover:text-ivory border border-charcoal/15 transition-colors font-medium"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Variants Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-charcoal/10 text-left text-[11px] uppercase tracking-wider text-charcoal/50">
                  <th className="pb-3">Size</th>
                  <th className="pb-3">Color Label</th>
                  <th className="pb-3">Price (₹)</th>
                  <th className="pb-3">Stock Units</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {fields.map((field, index) => (
                  <tr key={field.id} className="py-2">
                    <td className="py-2.5 pr-3">
                      <input
                        type="text"
                        className="w-20 border border-charcoal/20 bg-ivory px-2 py-1 text-xs font-semibold focus:border-burgundy focus:outline-none"
                        {...register(`variants.${index}.size`)}
                      />
                    </td>
                    <td className="py-2.5 pr-3">
                      <input
                        type="text"
                        className="w-28 border border-charcoal/20 bg-ivory px-2 py-1 text-xs focus:border-burgundy focus:outline-none"
                        {...register(`variants.${index}.color`)}
                      />
                    </td>
                    <td className="py-2.5 pr-3">
                      <input
                        type="number"
                        className="w-24 border border-charcoal/20 bg-ivory px-2 py-1 text-xs font-sans focus:border-burgundy focus:outline-none"
                        {...register(`variants.${index}.price`)}
                      />
                    </td>
                    <td className="py-2.5 pr-3">
                      <input
                        type="number"
                        min={0}
                        className="w-20 border border-charcoal/20 bg-ivory px-2 py-1 text-xs font-sans focus:border-burgundy focus:outline-none"
                        {...register(`variants.${index}.stock`)}
                      />
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-error hover:text-error/80 p-1 transition-colors"
                        aria-label="Remove size"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Merchandising & Status Flags */}
        <div className="bg-ivory border border-charcoal/10 p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-2 border-b border-charcoal/10 pb-3">
            <Sparkles size={18} className="text-burgundy" />
            <h2 className="font-serif text-lg text-charcoal tracking-wide">Visibility & Merchandising</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-xs tracking-[0.15em] uppercase text-charcoal/70 font-semibold">
                Storefront Status
              </label>
              <select
                className="w-full border border-charcoal/20 bg-ivory p-3 text-sm text-charcoal focus:border-burgundy focus:outline-none"
                {...register("status")}
              >
                <option value="published">Published (Visible to all customers)</option>
                <option value="draft">Draft (Hidden from storefront)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex flex-col justify-center space-y-3 pt-2">
              <label className="flex items-center gap-2.5 text-xs uppercase tracking-wider font-semibold text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-burgundy"
                  {...register("isFeatured")}
                />
                Editorial Pick / Featured on Homepage
              </label>
              <label className="flex items-center gap-2.5 text-xs uppercase tracking-wider font-semibold text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-burgundy"
                  {...register("isNewArrival")}
                />
                Show in "New Arrivals" Edit
              </label>
              <label className="flex items-center gap-2.5 text-xs uppercase tracking-wider font-semibold text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-burgundy"
                  {...register("isBestSeller")}
                />
                Mark as "Best Seller"
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="sticky bottom-4 z-40 bg-charcoal text-ivory p-4 shadow-xl border border-charcoal/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-wider text-ivory/70">
              {existing ? `Editing "${existing.title}"` : "Creating New Product"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/products">
              <Button type="button" variant="outline" className="text-ivory border-ivory/30 hover:bg-ivory/10 text-xs uppercase">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gold hover:bg-gold-light text-charcoal font-bold uppercase tracking-widest text-xs py-3 px-6 shadow-md"
            >
              <Save size={15} /> {isSubmitting ? "Saving..." : existing ? "Save All Changes" : "Publish Product"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
