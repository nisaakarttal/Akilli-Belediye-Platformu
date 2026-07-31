"use client";

import { useState } from "react";
import { Search, Bell, LogOut, Settings, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/providers/auth-provider";
import { bildirimleriListele } from "@/lib/api/bildirimler";
import { cn } from "@/lib/utils";

export function DashboardTopbar({ baslik }: { baslik: string }) {
  const { kullanici, cikisYap } = useAuth();
  const [menuAcik, setMenuAcik] = useState(false);

  const { data: bildirimler } = useQuery({
    queryKey: ["bildirimler"],
    queryFn: bildirimleriListele,
    enabled: !!kullanici,
    refetchInterval: 60_000,
  });

  const okunmamisSayisi = bildirimler?.filter((b) => !b.okundu_mu).length ?? 0;

  if (!kullanici) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/90 px-5 backdrop-blur">
      <div>
        <h1 className="font-display text-base font-semibold text-foreground">{baslik}</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            placeholder="Ara..."
            className="h-10 w-56 rounded-xl border border-border bg-muted/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
          />
        </div>

        <ThemeToggle />

        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={`Bildirimler${okunmamisSayisi ? ` (${okunmamisSayisi} okunmamış)` : ""}`}
        >
          <Bell className="h-4.5 w-4.5" aria-hidden />
          {okunmamisSayisi > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-danger" aria-hidden />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuAcik((v) => !v)}
            className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-muted"
            aria-expanded={menuAcik}
          >
            <Avatar ad={kullanici.ad} soyad={kullanici.soyad} src={kullanici.profil_fotografi} />
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium leading-tight text-foreground">
                {kullanici.ad} {kullanici.soyad}
              </span>
              <span className="block text-xs capitalize leading-tight text-muted-foreground">{kullanici.rol}</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          </button>

          <div
            className={cn(
              "absolute right-0 mt-2 w-48 origin-top-right rounded-xl border border-border bg-surface p-1.5 shadow-card transition-all",
              menuAcik ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
            )}
          >
            <a href="/panel/profil" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
              <Settings className="h-4 w-4" aria-hidden />
              Ayarlar
            </a>
            <button
              onClick={cikisYap}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-danger-bg"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
