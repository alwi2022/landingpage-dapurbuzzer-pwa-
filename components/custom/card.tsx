import { PackageType } from "@/app/types/type";
import { ChevronLeft, ChevronRight, Star, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { BRAND, TESTIMONIALS } from "@/app/data/data";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {  useState } from "react";
import { SheetClose } from "../ui/sheet";


export function Rating({ n = 5 }: { n?: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${n}`}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-yellow-500" aria-hidden="true" />
      ))}
    </div>
  );
}


export function Field({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <div className="shrink-0">{icon}</div>
      <div className="w-full">{children}</div>
    </div>
  );
}




export function Testimonials() {
  const [idx, setIdx] = useState(0);
  return (
    <section className="px-3 pt-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[15px] font-semibold">Apa kata mereka?</h2>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIdx((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} aria-label="Testimoni sebelumnya">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIdx((i) => (i + 1) % TESTIMONIALS.length)} aria-label="Testimoni berikutnya">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <img src={TESTIMONIALS[idx].img} alt={TESTIMONIALS[idx].name} className="h-12 w-12 rounded-full object-cover" />
            <div>
              <div className="text-[13px] font-semibold">{TESTIMONIALS[idx].name}</div>
              <div className="text-[11px] text-muted-foreground">{TESTIMONIALS[idx].role}</div>
              <div className="mt-1"><Rating n={TESTIMONIALS[idx].rating} /></div>
            </div>
          </div>
          <p className="mt-3 text-[12px] text-muted-foreground leading-relaxed">{TESTIMONIALS[idx].text}</p>
        </CardContent>
      </Card>
    </section>
  );
}


export function TopRowSkeleton() {
  return (
    <div className="flex gap-2 snap-x overflow-x-auto scrollbar-none pb-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-[136px] shrink-0">
          <div className="h-24 w-full rounded-xl bg-zinc-200 animate-pulse" />
          <div className="mt-2 h-3 w-24 rounded bg-zinc-200 animate-pulse" />
          <div className="mt-1 h-3 w-20 rounded bg-zinc-200 animate-pulse" />
        </div>
      ))}
    </div>
  );
}


export function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function StatSkeleton() {
  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="h-4 w-24 rounded bg-zinc-200 animate-pulse" />
        <div className="h-5 w-5 rounded-full bg-zinc-200 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-7 w-20 rounded bg-zinc-200 animate-pulse" />
      </CardContent>
    </Card>
  );
}

export function NavGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <div className="px-4 pb-1 text-[11px] uppercase tracking-wider text-[#6f2dbd] font-semibold">
        {title}
      </div>
      <nav className="px-2">{children}</nav>
    </div>
  );
}

export function MenuItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[#f5f0fa]"
        aria-label={label}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </SheetClose>
  );
}


export function PackageListItem({ p, }: { p: PackageType; }) {
  return (
    <div className="flex gap-3 py-4">

      <img
        src={p.img}
        alt={p.title}
        loading="lazy"
        className="h-20 w-20 rounded-xl object-cover border shrink-0"
      />

      {/* content */}
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold leading-snug line-clamp-1">{p.title}</div>

        <div className="mt-1 flex items-center gap-1.5 text-[12px] text-muted-foreground">
          <Tag className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="leading-none">{p.price}</span>
          {p.tag ? (
            <span aria-label="tag paket" className="ml-1 rounded-full border px-2 py-[2px] text-[10px]">
              {p.tag}
            </span>
          ) : null}
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            className="h-9 rounded-full px-5 text-[12px]"
            style={{ backgroundColor: BRAND }}
            onClick={() => window.alert(`Detail: ${p.title}`)}
          >
            View Detail
          </Button>
          <Button
            variant="outline"
            className="h-9 rounded-full px-5 text-[12px]"
            asChild
          >
            <a rel="noopener noreferrer" aria-label="Chat WhatsApp">
              Chat Sales
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
