import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login?redirect=/admin/dashboard");
  }
  if (session.profile?.role !== "admin") {
    redirect("/"); // signed in, but not an admin — send them back to the storefront
  }

  return (
    <div className="min-h-screen bg-ivory flex">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
