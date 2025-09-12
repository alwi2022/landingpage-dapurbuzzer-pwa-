// app/admin/layout.tsx
import type { ReactNode } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

const BRAND = "#6f2dbd" as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50" style={{ ["--brand" as string]: BRAND }}>
      <AdminNavbar />
      <div className="mx-auto max-w-7xl px-4">
        <div className="md:flex md:gap-4">
          {/* Sidebar: hidden on mobile */}
          <div className="hidden md:block">
            <AdminSidebar />
          </div>

          {/* Content */}
          <main className="flex-1 py-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
