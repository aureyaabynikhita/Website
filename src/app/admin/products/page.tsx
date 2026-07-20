import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { getAllProductsForAdmin } from "@/services/admin/products";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Products</h1>
          <p className="text-sm text-charcoal/50 mt-1">{products.length} total</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus size={16} /> New Product
          </Button>
        </Link>
      </div>

      <div className="bg-ivory border border-charcoal/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={p.id} className="border-b border-charcoal/5">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative h-12 w-10 bg-beige shrink-0">
                      {p.images[0] && (
                        <Image src={p.images[0]} alt={p.title} fill className="object-cover" />
                      )}
                    </div>
                    {p.title}
                  </td>
                  <td className="p-4 text-charcoal/60">{p.categoryId}</td>
                  <td className="p-4">{formatPrice(p.basePrice)}</td>
                  <td className="p-4">
                    <span className={totalStock <= 10 ? "text-error" : ""}>{totalStock}</span>
                  </td>
                  <td className="p-4 capitalize">{p.status}</td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-burgundy text-xs uppercase tracking-wide hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-charcoal/40">
                  No products yet — run <code>npm run seed</code> or add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
