"use client";

import Link from "next/link";


const BRAND = "#6f2dbd" as const;

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-[70] bg-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
         
          <Link href="/admin" className="font-semibold tracking-wide">
            DapurBuzzer • Admin
          </Link>
        </div>

        <nav className="text-sm flex items-center gap-4">
          <Link href="/" className="hover:underline">Lihat Site</Link>
          <span className="inline-flex items-center rounded-full bg-[--brand-ghost] px-2 py-0.5 text-[11px] text-[color:var(--brand)]"
            style={{ ['--brand' as any]: BRAND, ['--brand-ghost' as any]: `${BRAND}15` }}>
            Admin
          </span>
        </nav>
      </div>
    </header>
  );
}
