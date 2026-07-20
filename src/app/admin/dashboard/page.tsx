import { Package, ShoppingCart, Users, IndianRupee, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { getRevenueStats } from "@/services/admin/orders";
import { getDashboardCounts } from "@/services/admin/customers-coupons";
import { getLowStockProducts } from "@/services/admin/products";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [revenue, counts, lowStock] = await Promise.all([
    getRevenueStats(),
    getDashboardCounts(),
    getLowStockProducts(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Dashboard</h1>
        <p className="text-sm text-charcoal/50 mt-1">Overview of AUREYAA's storefront</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={formatPrice(revenue.totalRevenue)} icon={IndianRupee} />
        <StatCard label="Orders" value={String(revenue.totalOrders)} icon={ShoppingCart} />
        <StatCard label="Products" value={String(counts.productCount)} icon={Package} />
        <StatCard label="Customers" value={String(counts.customerCount)} icon={Users} />
      </div>

      <div className="bg-ivory border border-charcoal/10 p-6">
        <h2 className="text-sm uppercase tracking-wide text-charcoal/60 mb-4">
          Revenue (paid orders, last 7 active days)
        </h2>
        <RevenueChart data={revenue.last7Days} />
      </div>

      {lowStock.length > 0 && (
        <div className="bg-ivory border border-error/30 p-6">
          <h2 className="flex items-center gap-2 text-sm uppercase tracking-wide text-error mb-4">
            <AlertTriangle size={16} /> Low Stock ({lowStock.length})
          </h2>
          <ul className="space-y-2">
            {lowStock.slice(0, 6).map((p) => (
              <li key={p.id} className="flex justify-between text-sm">
                <Link href={`/admin/products/${p.id}`} className="hover:text-burgundy">
                  {p.title}
                </Link>
                <span className="text-charcoal/50">
                  {p.variants.filter((v) => v.stock <= 5).length} variant(s) low
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
