import { getAllCustomers } from "@/services/admin/customers-coupons";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getAllCustomers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-charcoal">Customers</h1>
        <p className="text-sm text-charcoal/50 mt-1">{customers.length} total</p>
      </div>

      <div className="bg-ivory border border-charcoal/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-charcoal/10 text-left text-xs uppercase tracking-wide text-charcoal/50">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Reward Points</th>
              <th className="p-4">Store Credits</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.uid} className="border-b border-charcoal/5">
                <td className="p-4">{c.displayName}</td>
                <td className="p-4 text-charcoal/60">{c.email}</td>
                <td className="p-4 text-charcoal/60">{c.phone ?? "—"}</td>
                <td className="p-4">{c.rewardPoints}</td>
                <td className="p-4">{c.storeCredits}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-charcoal/40">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
