// components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  LayoutGrid,
  Package,
  ShoppingBag,
  UserSquare2,
  Tag,
  Image as ImageIcon,
  Percent,
  RefreshCw,
} from "lucide-react";

type Item = { href?: string; label: string; icon: React.ReactNode; disabled?: boolean };

const items: Item[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutGrid className="h-4 w-4" /> },
  { href: "/admin/influencers", label: "Influencers", icon: <Users className="h-4 w-4" /> },
  { label: "Products", icon: <Package className="h-4 w-4" />, disabled: true },
  { label: "Orders", icon: <ShoppingBag className="h-4 w-4" />, disabled: true },
  { label: "Users", icon: <UserSquare2 className="h-4 w-4" />, disabled: true },
  { label: "Categories", icon: <Tag className="h-4 w-4" />, disabled: true },
  { label: "Brands", icon: <RefreshCw className="h-4 w-4" />, disabled: true },
  { label: "Coupons", icon: <Percent className="h-4 w-4" />, disabled: true },
  { label: "Banners", icon: <ImageIcon className="h-4 w-4" />, disabled: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-zinc-200 bg-white min-h-[calc(100vh-49px)]">
      <div className="px-3 py-3">
        <div className="text-[11px] uppercase tracking-wider text-zinc-500 px-2 pb-2">Menu</div>
        <ul className="space-y-1 text-sm">
          {items.map((it, idx) => {
            const isActive = it.href ? (pathname === it.href || pathname?.startsWith(it.href + "/")) : false;
            const base = "flex items-center gap-2 rounded-md px-3 py-2";
            const active = "text-[color:var(--brand)]";
            const activeBg = { background: "color-mix(in srgb, var(--brand) 10%, transparent)" };

            if (!it.href || it.disabled) {
              return (
                <li key={idx}>
                  <div className={`${base} opacity-50 cursor-not-allowed`} aria-disabled title="Segera hadir">
                    {it.icon}
                    <span>{it.label}</span>
                  </div>
                </li>
              );
            }

            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={`${base} ${isActive ? active : "hover:bg-zinc-50"}`}
                  style={isActive ? activeBg : undefined}
                >
                  {it.icon}
                  <span>{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
