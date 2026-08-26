import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { requireAdmin } from "@/lib/session";
import { productFormSchema } from "@/lib/validations/product";
import { createProduct, updateProduct, deleteProduct } from "@/services/admin/products";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const parsed = productFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const id = body.id ?? `prod-${nanoid(10)}`;
  const data = parsed.data;
  
  const images = Array.isArray(data.images)
    ? data.images.filter(Boolean)
    : data.images.split(",").map((s) => s.trim()).filter(Boolean);

  const tags = Array.isArray(data.tags)
    ? data.tags.filter(Boolean)
    : (data.tags ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  const variants = (data.variants && data.variants.length > 0
    ? data.variants
    : [
        {
          id: `var-${id}-freesize`,
          size: "Free Size",
          color: "Original",
          price: data.basePrice,
          stock: 10,
          sku: `${id}-FS`,
        },
      ]
  ).map((v) => ({
    id: v.id,
    size: v.size,
    color: v.color || "Original",
    price: v.price,
    stock: v.stock,
    sku: v.sku || `${id}-${v.size}`,
    ...(v.price ? { compareAtPrice: data.compareAtPrice || undefined } : {}),
  }));

  if (body.id) {
    await updateProduct(body.id, {
      title: data.title,
      slug: data.slug,
      description: data.description,
      fabricDetails: data.fabricDetails,
      washCare: data.washCare,
      stylingTips: data.stylingTips,
      categoryId: data.categoryId,
      basePrice: data.basePrice,
      compareAtPrice: data.compareAtPrice || undefined,
      images,
      tags,
      variants,
      isFeatured: data.isFeatured,
      isNewArrival: data.isNewArrival,
      isBestSeller: data.isBestSeller,
      status: data.status,
    });
  } else {
    await createProduct({
      id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      fabricDetails: data.fabricDetails,
      washCare: data.washCare,
      stylingTips: data.stylingTips,
      categoryId: data.categoryId,
      collectionIds: [],
      images,
      variants,
      basePrice: data.basePrice,
      compareAtPrice: data.compareAtPrice || undefined,
      tags,
      isFeatured: data.isFeatured,
      isNewArrival: data.isNewArrival,
      isBestSeller: data.isBestSeller,
      ratingAverage: 0,
      ratingCount: 0,
      seo: { metaTitle: data.title, metaDescription: data.description.slice(0, 150) },
      status: data.status,
    });
  }

  return NextResponse.json({ ok: true, id });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
