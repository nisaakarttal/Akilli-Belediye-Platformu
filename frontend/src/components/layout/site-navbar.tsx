"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X, Landmark } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

const LINKLER = [
  { href: "/", etiket: "Ana Sayfa" },
  { href: "/hizmetler", etiket: "Hizmetler" },
  { href: "/duyurular", etiket: "Duyurular" },
  { href: "/haberler", etiket: "Haberler" },
  { href: "/etkinlikler", etiket: "Etkinlikler" },
  { href: "/iletisim", etiket: "İletişim" },
];

export function SiteNavbar() {
  const [acikMi, setAcikMi] = useState(false);
  const { kullanici } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Landmark className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display leading-tight">
            <span className="block text-sm font-bold tracking-tight text-foreground">AKILLI BELEDİYE</span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Platformu
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
          {LINKLER.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.etiket}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Ara"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:flex"
          >
            <Search className="h-4.5 w-4.5" aria-hidden />
          </button>
          <ThemeToggle className="hidden sm:flex" />
          {kullanici ? (
            <Link href="/panel" className={cn(buttonVariants({ size: "sm" }))}>
              Panele Git
            </Link>
          ) : (
            <Link href="/giris" className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>
              Giriş Yap
            </Link>
          )}
          <button
            aria-label={acikMi ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setAcikMi((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
          >
            {acikMi ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <nav
        className={cn(
          "grid overflow-hidden border-t border-border bg-surface transition-[grid-template-rows] duration-200 lg:hidden",
          acikMi ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="container flex flex-col gap-1 py-3">
            {LINKLER.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setAcikMi(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.etiket}
              </Link>
            ))}
            {!kullanici && (
              <Link href="/giris" className="mt-1 rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground">
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
