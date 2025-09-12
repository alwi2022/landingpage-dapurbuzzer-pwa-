// app/influencers/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InfluencerCard, { Influencer } from "@/components/InfluencerCard";
import { ArrowLeft, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { RangeKey } from "../types/type";
import { BottomSheet, GridSkeleton, Pill, Spinner, useDebounce, useInView } from "@/components/ui/card";
import { BRAND, BRAND_BORDER, BRAND_SOFT, INITIAL_BATCH, LOAD_MORE } from "../data/data";


export default function AllInfluencersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [items, setItems] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sort, setSort] = useState<"followers_desc" | "followers_asc">("followers_desc");
  const [range, setRange] = useState<RangeKey>("any");

  const [visible, setVisible] = useState(INITIAL_BATCH);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(sentinelRef, { rootMargin: "300px" });

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  const dq = useDebounce(q, 300);

  function onChangeSearch(v: string) {
    setQ(v);
    const sp = new URLSearchParams(searchParams.toString());
    if (v.trim()) sp.set("q", v.trim());
    else sp.delete("q");
    router.replace(`/influencers?${sp.toString()}`, { scroll: false });
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const r = await fetch("/api/influencers", { cache: "no-store" });
        const j = await r.json();
        const data: Influencer[] = Array.isArray(j) ? j : j.data ?? [];
        if (mounted) setItems(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const base = items.filter((i) => {
      const textHit = dq
        ? [i.name, i.username, String(i.followers ?? "")]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(dq.toLowerCase()))
        : true;

      const f = i.followers ?? 0;
      const rangeHit =
        range === "any"
          ? true
          : range === "0-10"
            ? f < 10_000
            : range === "10-50"
              ? f >= 10_000 && f < 50_000
              : range === "50-100"
                ? f >= 50_000 && f < 100_000
                : f >= 100_000;

      return textHit && rangeHit;
    });

    const factor = sort === "followers_asc" ? 1 : -1;
    return [...base].sort((a, b) => ((a.followers ?? 0) - (b.followers ?? 0)) * factor);
  }, [items, dq, range, sort]);

  useEffect(() => {
    setVisible(INITIAL_BATCH);
  }, [dq, sort, range]);

  useEffect(() => {
    if (!inView) return;
    setVisible((v) => Math.min(filtered.length, v + LOAD_MORE));
  }, [inView, filtered.length]);

  const list = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const initialLoading = loading && items.length === 0;

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="mx-auto w-full max-w-[430px] bg-white min-h-screen shadow-xl relative">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: BRAND, color: "white" }}>
          <div className="px-3 py-2 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-lg text-sm hover:bg-white/20"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="font-semibold text-[13px]">Search</div>
            <div className="w-[64px]" />
          </div>

          {/* search pill + filter */}
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                <SearchIcon className="h-4 w-4 text-zinc-500" />
                <input
            value={q} onChange={(e)=>onChangeSearch(e.target.value)}
                  placeholder="Search..."
                  className="h-7 w-full bg-transparent outline-none text-[13px] text-zinc-700"
                />
              </div>
              <button
                onClick={() => setSheetOpen(true)}
                className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white text-zinc-700 shadow-sm"
                aria-label="Open filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Grid */}
        <main className="px-3 pt-2 pb-24">
          {initialLoading ? (
            <GridSkeleton />
          ) : list.length === 0 ? (
            <div className="p-6 text-sm text-zinc-500">No results.</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2.5">
                {list.map((it) => (
                  <InfluencerCard
                    key={it.id}
                    data={it}
                    size="md"
                    dense
                    className="rounded-2xl"
                  />
                ))}
              </div>

              {/* sentinel for infinite scroll */}
              <div ref={sentinelRef} className="h-10" />
              {hasMore && (
                <div className="flex items-center justify-center py-3">
                  <Spinner />
                </div>
              )}
            </>
          )}
        </main>

        {/* Bottom Sheet (Filter) */}
        {sheetOpen && (
          <BottomSheet onClose={() => setSheetOpen(false)}>
            <div className="text-[13px] font-semibold mb-2">Sort By</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              <Pill active={sort === "followers_desc"} onClick={() => setSort("followers_desc")}>
                Followers (High → Low)
              </Pill>
              <Pill active={sort === "followers_asc"} onClick={() => setSort("followers_asc")}>
                Followers (Low → High)
              </Pill>
            </div>

            <div className="mt-4">
              <div className="text-[12px] text-zinc-600 mb-2">Followers Range</div>
              <div className="flex flex-wrap gap-2">
                {[
                  { k: "any", t: "Any" },
                  { k: "0-10", t: "<10K" },
                  { k: "10-50", t: "10K–50K" },
                  { k: "50-100", t: "50K–100K" },
                  { k: "100+", t: "100K+" },
                ].map((r) => (
                  <Pill key={r.k} active={range === (r.k as RangeKey)} onClick={() => setRange(r.k as RangeKey)}>
                    {r.t}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button className="h-10 flex-1 rounded-full border text-[#6f2dbd] transition-colors"
                style={{ borderColor: BRAND_BORDER }}
                onClick={() => setRange("any")}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = BRAND_SOFT)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "white")}
              >
                Reset
              </button>
              <button
                className="h-10 flex-1 rounded-full text-white transition-colors"
                style={{ backgroundColor: BRAND }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.9")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
                onClick={() => setSheetOpen(false)}
              >
                Apply
              </button>
            </div>
          </BottomSheet>
        )}
      </div>
    </div>
  );
}

