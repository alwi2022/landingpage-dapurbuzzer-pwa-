"use client";

import React, { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  Home, Heart, Clapperboard,
  Baby, Car, Camera, Smartphone, UtensilsCrossed, Shirt, Dumbbell,
  Package,
  User
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import HeaderMenu from "./HeaderMenu";
import InfluencerCard, { Influencer as Infl } from "@/components/InfluencerCard";
import { PackageListItem, Testimonials, TopRowSkeleton } from "@/components/custom/card";
import { BANNERS, BRAND, CLIENTS, PACKAGES } from "./data/data";
import { useAutoSlide } from "@/lib/utils";

const CATEGORIES = [
  { name: "Content Creator", icon: <Camera className="h-4 w-4" aria-hidden /> },
  { name: "Mom & Kids", icon: <Baby className="h-4 w-4" aria-hidden /> },
  { name: "Tech & Gadget", icon: <Smartphone className="h-4 w-4" aria-hidden /> },
  { name: "Food & Beverage", icon: <UtensilsCrossed className="h-4 w-4" aria-hidden /> },
  { name: "Beauty & Fashion", icon: <Shirt className="h-4 w-4" aria-hidden /> },
  { name: "Health & Sport", icon: <Dumbbell className="h-4 w-4" aria-hidden /> },
  { name: "Entertainment", icon: <Clapperboard className="h-4 w-4" aria-hidden /> },
  { name: "Auto & Hobby", icon: <Car className="h-4 w-4" aria-hidden /> },
];

export default function DapurBuzzerLandingCompact() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [top, setTop] = useState<Infl[] | null>(null);
  const [slide, setSlide] = useAutoSlide(BANNERS.length);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/influencers", { cache: "no-store" });
        const j = await r.json();
        const data: Infl[] = Array.isArray(j) ? j : j.data ?? [];
        data.sort((a, b) => Number(b.followers ?? 0) - Number(a.followers ?? 0));
        setTop(data.slice(0, 12));
      } catch (e) {
        console.error(e);
        setTop([]);
      }
    })();
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const href = q ? `/influencers?q=${encodeURIComponent(q)}` : `/influencers`;
    router.push(href);
  }


  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full max-w-[430px] bg-white min-h-screen shadow-xl relative">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: BRAND, color: "white" }}>
          <div className="mx-auto max-w-[430px] px-3 py-2 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="logo/logo.png" alt="Dapur Buzzer" className="h-7 w-7 bg-white rounded-full" />
              <span className="font-semibold tracking-wide text-[13px]">DAPUR BUZZER</span>
            </div>
            <div className="flex-1" />
            <HeaderMenu />
          </div>

          {/* search */}
          <div className="mx-auto max-w-[430px] px-3 pb-2">
            <form
              onSubmit={onSearch}
              className="flex items-center gap-2 rounded-full bg-white text-foreground px-3 py-1.5"
              role="search"
              aria-label="Pencarian"
            >
              <SearchIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari influencer, kategori, atau paket…"
                className="border-0 p-0 focus-visible:ring-0 bg-transparent h-7 text-[13px]"
                aria-label="Kolom pencarian"
              />
              <Button
                type="submit"
                size="sm"
                className="h-7 rounded-full px-3 text-[12px]"
                style={{ backgroundColor: BRAND }}
              >
                Cari
              </Button>
            </form>
          </div>
        </header>
        {/* HERO */}
        <section className="pt-3">
          <div className="rounded-2xl">
            <div className="relative overflow-hidden rounded-xl aspect-[16/9] sm:aspect-[21/9]">
              <img
                src={BANNERS[slide].img}
                alt={BANNERS[slide].caption}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: (BANNERS[slide] as any).focal ?? "center 20%" }}
              />
              <div className="absolute right-4 bottom-1 flex gap-1">
                {BANNERS.map((_, i) => (
                  <button
                    key={`dot-${i}`}
                    aria-label={`Ke slide ${i + 1}`}
                    onClick={() => setSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${i === slide ? "w-5 bg-white" : "w-3 bg-white/60"
                      }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Kategori */}
        <section className="px-3 pt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[15px] font-semibold text-gray-800">Kategori</h2>
            <Button
              variant="link"
              className="px-0 text-[12px] font-medium hover:text-[#5a23a1]"
              style={{ color: "#6f2dbd" }}
            >
              Lihat Semua
            </Button>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {CATEGORIES.map((label) => (
              <button
                key={label.name}
                className="group rounded-xl border border-gray-200 bg-white px-2.5 py-3 text-center 
                   hover:shadow-sm 
                   cursor-pointer"
                aria-label={`Kategori ${label.name}`}
              >
                <div className="mx-auto inline-flex h-10 w-10 items-center justify-center 
                        rounded-full bg-[#6f2dbd]/10 text-[#6f2dbd]">
                  {label.icon}
                </div>
                <div className="mt-1.5 text-[12px] leading-tight line-clamp-2 text-gray-700">
                  {label.name}
                </div>
              </button>
            ))}
          </div>
        </section>


        {/* Trending Influencer */}
        <section className="px-3 pt-6 scroll-mt-20" id="recommended">

          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[15px] font-semibold flex items-center gap-1">
              Trending Influencer
            </h2>
            <Button
              variant="link"
              className="px-0 text-[12px]"
              style={{ color: BRAND }}
              onClick={() => router.push("/influencers")}
            >
              Lihat lainnya
            </Button>
          </div>
          <div className="flex gap-2 snap-x overflow-x-auto scrollbar-none snap-mandatory pb-1" role="list">
            {top === null ? (
              <TopRowSkeleton />
            ) : (
              top.map((r) => (
                <div key={r.id} className="snap-start" role="listitem">
                  <InfluencerCard data={r} size="sm" badgeText="Top" />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Packages */}
        <section className="px-3 pt-6 scroll-mt-20" id="packages">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-semibold">Package Micro Influencer</h2>
            <Button
              variant="link"
              className="px-0 text-[12px]"
              style={{ color: BRAND }}
              onClick={() => window.location.assign("#packages")}
            >
              Lihat Lebih Banyak
            </Button>
          </div>

          <Card className="rounded-xl">
            <CardContent className="p-0">
              {PACKAGES.map((p, i) => (
                <div key={`${p.title}-${i}`}>
                  <div className="px-3">
                    <PackageListItem p={p} />
                  </div>
                  {i < PACKAGES.length - 1 && <div className="border-t mx-3" aria-hidden="true" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Clients */}
        <section className="px-3 pt-6">
          <h2 className="text-[15px] font-semibold mb-2">Dipercaya oleh</h2>
          <div className="grid grid-cols-4 gap-2">
            {CLIENTS.map((c) => (
              <div key={c.name} className="flex items-center justify-center">
                <img src={c.img} alt={c.name} className="max-h-10 object-contain" />
              </div>
            ))}
          </div>
        </section>

        <Testimonials />


        {/* Footer */}
        <footer className="bg-muted/30 border-t pb-[calc(10px+env(safe-area-inset-bottom))]">
          <div className="px-3 py-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2">
                <img src="logo/logo.png" alt="Dapur Buzzer" className="w-8 h-8 object-cover" />
                <div className="text-left">
                  <div className="text-[13px] font-semibold">Dapur Buzzer Indonesia</div>
                  <div className="text-[11px] text-muted-foreground">Influencer & KOL Management Platform</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <img src="contact/appstore.png" alt="App Store" className="w-24 h-auto" />
                <img src="contact/playstore.png" alt="Play Store" className="w-24 h-auto" />
              </div>
              <div className="mt-4 text-[11px] text-muted-foreground">
                © 2025 Dapur Buzzer – PT FHCreative Group Indonesia.
              </div>
            </div>
          </div>
        </footer>

        {/* Bottom Tab (mobile) */}
        <nav className="sticky bottom-0 bg-white/95 backdrop-blur border-t">
          <div className="mx-auto grid grid-cols-4 text-center text-[11px]">
            <a className="p-2" href="#" style={{ color: BRAND }}>
              <div className="flex flex-col items-center gap-0.5">
                <Home className="h-4 w-4" /> Home
              </div>
            </a>
            <a className="p-2" href="#recommended">
              <div className="flex flex-col items-center gap-0.5">
                <Heart className="h-4 w-4" /> Trending
              </div>
            </a>
            <a className="p-2" href="#packages">
              <div className="flex flex-col items-center gap-0.5">
                <Package className="h-4 w-4" /> Paket
              </div>
            </a>
            <a className="p-2" href="#About">
              <div className="flex flex-col items-center gap-0.5">
                <User className="h-4 w-4" /> About
              </div>
            </a>
          </div>
          <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
      </div>
    </div>
  );
}
