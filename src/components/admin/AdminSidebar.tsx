"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  FileText,
  Image as ImageIcon,
  Star,
  Undo2,
  LifeBuoy,
  Mail,
  Truck,
  CreditCard,
  Search,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Coupons", href: "/admin/coupons", icon: Tag },
  { label: "CMS", href: "/admin/cms", icon: FileText },
  { label: "Lookbook", href: "/admin/lookbook", icon: ImageIcon },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Returns", href: "/admin/returns", icon: Undo2 },
  { label: "Support", href: "/admin/support", icon: LifeBuoy },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Shipping", href: "/admin/shipping", icon: Truck },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "SEO", href: "/admin/seo", icon: Search },
  { label: "Roles", href: "/admin/roles", icon: Shield },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-charcoal/10 bg-ivory min-h-screen">
      <div className="h-20 flex items-center px-6 border-b border-charcoal/10">
        <span className="font-serif text-xl tracking-[0.1em] text-burgundy">AUREYAA</span>
        <span className="ml-2 text-[10px] tracking-widest uppercase text-charcoal/40">Admin</span>
      </div>
      <nav className="py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-burgundy/5 text-burgundy border-r-2 border-burgundy"
                  : "text-charcoal/70 hover:bg-beige-light"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
