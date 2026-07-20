"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { productFormSchema, type ProductFormInput } from "@/lib/validations/product";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ProductDoc } from "@/types/firestore";

const CATEGORIES = [
  { id: "cat-gowns", name: "Gowns" },
  { id: "cat-sarees", name: "Sarees" },
  { id: "cat-coords", name: "Co-ords" },
  { id: "cat-jackets", name: "Jackets" },
];

export function ProductForm({ existing }: { existing?: ProductDoc }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(productFormSchema),
    defaultValues: existing
      ? {
          title: existing.title,
          slug: existing.slug,
          description: existing.description,
          fabricDetails: existing.fabricDetails,
          washCare: existing.washCare,
          categoryId: existing.categoryId,
          basePrice: existing.basePrice,
          compareAtPrice: existing.compareAtPrice,
          images: existing.images.join(", "),
          tags: existing.tags.join(", "),
          isFeatured: existing.isFeatured,
          isNewArrival: existing.isNewArrival,
          isBestSeller: existing.isBestSeller,
          status: existing.status,
        }
      : { status: "draft" },
  });

  async function onSubmit(data: ProductFormInput) {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(existing ? { ...data, id: existing.id } : data),
    });
    if (!res.ok) {
      toast.error("Couldn't save the product.");
      return;
    }
    toast.success(existing ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Title" error={errors.title?.message} {...register("title")} />
        <Input label="Slug" error={errors.slug?.message} {...register("slug")} />
      </div>

      <div>
        <label className="mb-2 block text-xs tracking-[0.15em] uppercase text-charcoal/70">
          Description
        </label>
        <textarea
          rows={4}
          className="w-full border border-charcoal/20 bg-transparent p-3 text-charcoal focus:border-burgundy focus:outline-none"
          {...register("description")}
        />
        {errors.description && <p className="mt-1 text-xs text-error">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Fabric Details" error={errors.fabricDetails?.message} {...register("fabricDetails")} />
        <Input label="Wash Care" error={errors.washCare?.message} {...register("washCare")} />
      </div>

      <div>
        <label className="mb-2 block text-xs tracking-[0.15em] uppercase text-charcoal/70">
          Category
        </label>
        <select
          className="w-full border-b border-charcoal/20 bg-transparent py-3 text-charcoal focus:border-burgundy focus:outline-none"
          {...register("categoryId")}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1 text-xs text-error">{errors.categoryId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Base Price (₹)"
          type="number"
          error={errors.basePrice?.message}
          {...register("basePrice")}
        />
        <Input
          label="Compare-at Price (₹) — optional"
          type="number"
          error={errors.compareAtPrice?.message}
          {...register("compareAtPrice")}
        />
      </div>

      <Input
        label="Image URLs (comma-separated)"
        placeholder="/images/product-1.jpg, /images/product-2.jpg"
        error={errors.images?.message}
        {...register("images")}
      />
      <Input label="Tags (comma-separated)" placeholder="gown, silk, new" {...register("tags")} />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isFeatured")} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isNewArrival")} /> New Arrival
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("isBestSeller")} /> Best Seller
        </label>
      </div>

      <div>
        <label className="mb-2 block text-xs tracking-[0.15em] uppercase text-charcoal/70">
          Status
        </label>
        <select
          className="w-full border-b border-charcoal/20 bg-transparent py-3 text-charcoal focus:border-burgundy focus:outline-none"
          {...register("status")}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : existing ? "Save Changes" : "Create Product"}
      </Button>

      <p className="text-xs text-charcoal/40">
        Note: size/color variant stock is managed separately for now — this form creates/edits
        the product record; per-variant SKU/stock editing can be added as a follow-up view,
        or edited directly in Firestore in the meantime.
      </p>
    </form>
  );
}
