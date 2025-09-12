"use client";

import { Instagram } from "lucide-react";
import * as React from "react";
import Image from "next/image";
export type Influencer = {
    id: string;
    name: string;
    username?: string | null;
    followers?: number | null;
    img?: string | null;
};

export function formatFollowers(n?: number | null) {
    if (!n) return "0";
    try {
        if (n >= 10000) {
            return new Intl.NumberFormat("id-ID", {
                notation: "compact",
                maximumFractionDigits: 1,
            }).format(n);
        }
        return new Intl.NumberFormat("id-ID").format(n);
    } catch {
        return String(n);
    }
}

type Props = {
    data: Influencer;
    size?: "sm" | "md";
    badgeText?: string;
    className?: string;
    onClick?: () => void;
    dense?: boolean;
    /** CTA */
    ctaText?: string;
    onBook?: (i: Influencer) => void;
    bookHref?: string;
    brandColor?: string;
};

export default function InfluencerCard({
    data,
    size = "sm",
    badgeText,
    className = "",
    onClick,
    dense = false,
    ctaText = "Book Now",
    onBook,
    bookHref,
    brandColor = "#6f2dbd",
}: Props) {
    function handleBook(e: React.MouseEvent) {
        e.stopPropagation();
        if (onBook) onBook(data);
    }

    const CtaButton = () =>
        bookHref ? (
            <a
                href={bookHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-full inline-flex items-center justify-center h-8 rounded-full px-3 text-[12px] font-medium text-white"
                style={{ backgroundColor: brandColor }}
                aria-label={ctaText}
            >
                {ctaText}
            </a>
        ) : (
            <button
                onClick={handleBook}
                className="w-full inline-flex items-center justify-center h-8 rounded-full px-3 text-[12px] font-medium text-white"
                style={{ backgroundColor: brandColor }}
                aria-label={ctaText}
            >
                {ctaText}
            </button>
        );

    if (size === "sm") {
        return (
            <div
                onClick={onClick}
                className={`w-[160px] shrink-0 text-left rounded-xl border overflow-hidden bg-white hover:shadow-sm transition ${className}`}
                role="button"
                aria-label={`Lihat profil ${data.name}`}
            >
                <div className="relative">
                    <img
                        loading="lazy"
                        src={data.img || "https://placehold.co/320x240?text=IMG"}
                        alt={data.name}
                        className="h-24 w-full object-cover"
                    />
                    {badgeText ? (
                        <span className="absolute left-2 top-2 rounded-full bg-white text-[10px] px-1.5 py-0.5 border">
                            {badgeText}
                        </span>
                    ) : null}
                </div>
                <div className={dense ? "p-2.5" : "p-3"}>
                    <div className="text-[12px] font-semibold leading-tight line-clamp-1">
                        {data.name}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Instagram className="h-3 w-3" aria-hidden="true" /> @{data.username}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                        {formatFollowers(data.followers)} Followers
                    </div>

                    {/* CTA */}
                    <div className="mt-2">
                        <CtaButton />
                    </div>
                </div>
            </div>
        );
    }

    // size === "md"
    return (
        <div
            onClick={onClick}
            className={`rounded-xl border bg-white overflow-hidden hover:shadow-sm transition ${className}`}
            role="button"
            aria-label={`Lihat profil ${data.name}`}
        >
            <img
                loading="lazy"
                src={data.img || "https://placehold.co/640x480?text=IMG"}
                alt={data.name}
                className="h-40 w-full object-cover"
            />
            <div className="p-3">
                <div className="text-[14px] font-semibold line-clamp-1">{data.name}</div>
                <div className="mt-0.5 flex items-center gap-1 text-[12px] text-muted-foreground">
                    <Instagram className="h-3.5 w-3.5" aria-hidden />
                    @{data.username}
                </div>
                <div className="mt-1 text-[12px] text-muted-foreground">
                    {formatFollowers(data.followers)} Followers
                </div>

                {/* CTA */}
                <div className="mt-3">
                    <CtaButton />
                </div>
            </div>
        </div>
    );
}
