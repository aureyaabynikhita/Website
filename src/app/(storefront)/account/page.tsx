import { getServerSession } from "@/lib/session";
import { getUserOrders } from "@/services/orders";
import { AccountDashboard } from "@/components/auth/AccountDashboard";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await getServerSession();
  if (!session || !session.profile) {
    redirect("/login?redirect=/account");
  }

  const orders = await getUserOrders(session.uid);

  return (
    <div className="w-full">
      <AccountDashboard profile={session.profile} orders={orders} />
    </div>
  );
}
