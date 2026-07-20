import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?redirect=/account");
  }
  return <div className="section-container section-spacing">{children}</div>;
}
