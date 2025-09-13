// app/HeaderMenu.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
    Home,
    Heart,
    Package,
    Download,
    Menu,
    LayoutGrid,
    User,
} from "lucide-react";
import { MenuItem, NavGroup } from "@/components/custom/card";
import { BRAND } from "./data/data";



export default function HeaderMenu() {
    const [deferred, setDeferred] = useState<any>(null);
    const [canInstall, setCanInstall] = useState(false);
    const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);

    useEffect(() => {
        const onBIP = (e: any) => { e.preventDefault(); setDeferred(e); setCanInstall(true); };
        const onInstalled = () => { setDeferred(null); setCanInstall(false); };
        window.addEventListener("beforeinstallprompt", onBIP);
        window.addEventListener("appinstalled", onInstalled);
        return () => {
          window.removeEventListener("beforeinstallprompt", onBIP);
          window.removeEventListener("appinstalled", onInstalled);
        };
      }, []);
      

    const handleInstall = async () => {
        if (isIOS) {
            alert("iOS: buka menu Share lalu pilih 'Add to Home Screen'.");
            return;
        }
        if (!deferred) return;
        deferred.prompt();
        await deferred.userChoice; // { outcome: 'accepted' | 'dismissed' }
        setDeferred(null);
        setCanInstall(false);
    };

    useEffect(() => {
        const handler = () => {
            const btn = document.getElementById("menu-close-btn");
            btn?.click();
        };
        window.addEventListener("hashchange", handler);
        return () => window.removeEventListener("hashchange", handler);
    }, []);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Buka menu"
                    className="text-white hover:bg-white/10 h-8 w-8"
                >
                    <Menu className="h-4 w-4" />
                </Button>
            </SheetTrigger>

            <SheetContent
                side="left"
                className="w-[86%] sm:w-96 p-0 flex h-full flex-col"
            >
                {/* HEADER */}
                <SheetHeader className="p-4 pb-2">
                    <SheetTitle className="flex items-center gap-2 text-[#1a1a1a]">
                        <img src="logo/logo.png" alt="Dapur Buzzer" className="h-7 w-7 rounded-full" />
                        <span className="font-semibold">Dapur Buzzer</span>
                    </SheetTitle>
                </SheetHeader>

                {/* CONTENT */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <Separator />

                    {/* NAV UTAMA */}
                    <NavGroup title="Menu">
                        <MenuItem href="#" icon={<Home className="h-4 w-4" />} label="Home" />
                        <MenuItem
                            href="#recommended"
                            icon={<Heart className="h-4 w-4" />}
                            label="Trending Influencer"
                        />
                        <MenuItem
                            href="#packages"
                            icon={<Package className="h-4 w-4" />}
                            label="Paket Micro KOL"
                        />
                        <MenuItem href="#about" icon={<User className="h-4 w-4" />} label="About" />
                    </NavGroup>

                    <Separator />

                    {/* ADMIN SECTION */}
                    <NavGroup title="Admin">
                        <MenuItem
                            href="/admin"
                            icon={<LayoutGrid className="h-4 w-4" />}
                            label="Dashboard"
                        />
                    </NavGroup>

                    <Separator />
                </div>

                {/* FOOTER */}
                <div className="border-t bg-white p-3">
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            asChild
                            className="rounded-xl text-white"
                            style={{ backgroundColor: BRAND }}
                        >
                           <a rel="noopener noreferrer" aria-label="Chat Sales">
                                <img src="contact/WhatsApp.webp" alt="Chat Sales" className="h-4 w-4 -mr-1" />
                                Chat Sales
                                </a>
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-xl border-[#6f2dbd] text-[#6f2dbd] hover:bg-[#f5f0fa]"

                        >
                            Minta Proposal
                        </Button>
                        <Button
                            onClick={handleInstall}
                            disabled={!canInstall && !isIOS}
                            title={isIOS ? "iOS: Share → Add to Home Screen" : canInstall ? "Install App" : "Install belum tersedia"}
                            variant="outline"
                            className="col-span-2 rounded-xl border-[#6f2dbd] text-[#6f2dbd] hover:bg-[#f5f0fa]"
                        >
                            <Download className="mr-2 h-4 w-4" /> {isIOS ? "Add to Home Screen" : "Install App"}
                        </Button>
                    </div>
                    <div className="px-4 py-4 text-center text-[11px] text-muted-foreground">
                        © 2025 Dapur Buzzer •{" "}
                        <a href="#legal" className="underline">
                            Syarat & Privasi
                        </a>
                    </div>
                </div>

                <SheetClose asChild>
                    <button id="menu-close-btn" className="hidden" aria-hidden="true" />
                </SheetClose>
            </SheetContent>
        </Sheet>
    );
}


