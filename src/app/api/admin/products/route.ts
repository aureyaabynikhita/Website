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
  const images = data.images.split(",").map((s) => s.trim()).filter(Boolean);
  const tags = (data.tags ?? "").split(",").map((s) => s.trim()).filter(Boolean);

  if (body.id) {
    await updateProduct(body.id, { ...data, images, tags });
  } else {
    await createProduct({
      id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      fabricDetails: data.fabricDetails,
      washCare: data.washCare,
      categoryId: data.categoryId,
      collectionIds: [],
      images,
      variants: [],
      basePrice: data.basePrice,
      compareAtPrice: data.compareAtPrice,
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
