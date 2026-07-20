import { getAllCoupons } from "@/services/admin/customers-coupons";
import { CouponForm } from "@/components/admin/CouponForm";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await getAllCoupons();

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-charcoal">Coupons</h1>

      <CouponForm />

      <div className="bg-ivory border border-charcoal/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="p-4">Code</th>
              <th className="p-4">Type</th>
              <th className="p-4">Value</th>
              <th className="p-4">Used</th>
              <th className="p-4">Valid Till</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-charcoal/5">
                <td className="p-4 font-medium">{c.code}</td>
                <td className="p-4 capitalize">{c.type}</td>
                <td className="p-4">{c.type === "percentage" ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="p-4">
                  {c.usedCount}
                  {c.usageLimit ? ` / ${c.usageLimit}` : ""}
                </td>
                <td className="p-4">{c.validTill?.toDate?.().toLocaleDateString() ?? "—"}</td>
                <td className="p-4">{c.isActive ? "Active" : "Inactive"}</td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-charcoal/40">
                  No coupons yet — create one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
