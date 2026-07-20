import { notFound } from "next/navigation";
import { getProductByIdForAdmin } from "@/services/admin/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductByIdForAdmin(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-6">Edit Product</h1>
      <ProductForm existing={product} />
    </div>
  );
}
