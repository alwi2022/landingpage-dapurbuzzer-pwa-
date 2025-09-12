import * as React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react";
import { BRAND, BRAND_BORDER, BRAND_SOFT, INITIAL_BATCH } from "@/app/data/data";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}



export function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {Array.from({ length: INITIAL_BATCH }).map((_, i) => (
        <InfluencerCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function InfluencerCardSkeleton() {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <div className="h-40 w-full bg-zinc-200 animate-pulse" />
      <div className="p-3">
        <div className="h-4 w-3/5 rounded bg-zinc-200 animate-pulse" />
        <div className="mt-2 h-3 w-2/5 rounded bg-zinc-200 animate-pulse" />
        <div className="mt-3 h-9 w-full rounded-full bg-zinc-200 animate-pulse" />
      </div>
    </div>
  );
}

export function BottomSheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full max-w-[430px] rounded-t-3xl bg-white p-4 pb-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-zinc-200" />
        {children}
      </div>
    </div>
  );
}

export function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 h-9 text-sm border transition-colors ${active
          ? "text-white"
          : "text-[#6f2dbd]"
        }`}
      style={{
        backgroundColor: active ? BRAND : "white",
        borderColor: active ? BRAND : BRAND_BORDER,
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = BRAND_SOFT;
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "white";
      }}
    >
      {children}
    </button>
  );
}

export function Spinner() {
  return (
    <div
      className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-700"
      aria-label="loading"
    />
  );
}


export function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState<T>(value);
  const t = useRef<number | null>(null);
  useEffect(() => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setV(value), delay);
    return () => {
      if (t.current) window.clearTimeout(t.current);
    };
  }, [value, delay]);
  return v;
}

export function useInView<T extends Element | null>(
  ref: React.RefObject<T>,
  options?: IntersectionObserverInit
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, options]);
  return inView;
}


function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
