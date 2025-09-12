// app/admin/page.tsx
"use client";

import useSWR from "swr";
import { Users, BarChart3, Package, } from "lucide-react";
import {  StatCard, StatSkeleton } from "@/components/custom/card";
import { BRAND } from "../data/data";
import { InfluencersMetaResp } from "../types/type";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";


 

const fetchInfluencersCount = async (): Promise<number> => {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const r = await fetch("/api/influencers?limit=1&page=1", {
      cache: "no-store",
      signal: ctrl.signal,
    });
    if (!r.ok) throw new Error(await r.text());
    const j: InfluencersMetaResp = await r.json();
    if (Array.isArray(j)) return j.length; 
    return j?.meta?.total ?? 0;
  } finally {
    clearTimeout(timeout);
  }
};

export default function AdminHome() {
  const { data: influencersCount, isLoading, error } = useSWR(
    "influencers-count",
    fetchInfluencersCount,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  return (
    <div
      className="min-h-screen bg-zinc-50"
      style={{ ["--brand" as string]: BRAND }}
    >
      <main className="mx-auto max-w-5xl p-4 space-y-6">
        <header>
          <h1 className="text-xl font-semibold">Selamat Datang, Admin</h1>
          <p className="text-sm text-muted-foreground">
            Gunakan menu di bawah untuk mengelola data.
          </p>
        </header>

        <section
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          aria-live="polite"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <StatCard
                icon={<Users className="h-5 w-5 text-[color:var(--brand)]" />}
                label="Influencers"
                value={error ? "-" : (influencersCount ?? 0)}
              />
              <StatCard
                icon={<Package className="h-5 w-5 text-[color:var(--brand)]" />}
                label="Brands"
                value="-"
              />
              <StatCard
                icon={<BarChart3 className="h-5 w-5 text-[color:var(--brand)]" />}
                label="Campaigns"
                value="-"
              />
            </>
          )}
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NavCard
            href="/admin/influencers"
            title="Kelola Influencers"
            desc="Tambah, edit, atau hapus data influencer."
          />
          <NavCard
            title="Kelola Brands"
            desc="Kelola daftar brand / client."
            disabled
          />
          <NavCard
            title="Kelola Campaigns"
            desc="Pantau dan atur campaign yang berjalan."
            disabled
          />
          <NavCard
            title="Reports & Analytics"
            desc="Lihat laporan performa."
            disabled
          />
        </section>

        {error && (
          <p className="text-xs text-red-600">
            Gagal mengambil jumlah influencers dari <code>/api/influencers</code>.
          </p>
        )}
      </main>
    </div>
  );
}


   function NavCard({
  href,
  title,
  desc,
  disabled,
}: {
  href?: string;
  title: string;
  desc: string;
  disabled?: boolean;
}) {
  return (
    <Card className={`rounded-xl h-full ${disabled ? "opacity-60" : ""}`}>
      <div className="p-5 space-y-3">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
        {disabled || !href ? (
          <Button
            className="rounded-full"
            style={{ backgroundColor: "var(--brand)" }}
            disabled
            aria-disabled
          >
            Segera Hadir
          </Button>
        ) : (
          <Button
            asChild
            className="rounded-full"
            style={{ backgroundColor: "var(--brand)" }}
          >
            <Link href={href}>Buka</Link>
          </Button>
        )}
      </div>
    </Card>
  );
}
