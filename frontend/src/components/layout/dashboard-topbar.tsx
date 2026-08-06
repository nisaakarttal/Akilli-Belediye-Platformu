"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ChevronDown, LogOut, Search, Settings } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/providers/auth-provider";
import { bildirimleriListele, bildirimiOkunduYap, tumBildirimleriOkunduYap } from "@/lib/api/bildirimler";
import { cn, goreceliZaman } from "@/lib/utils";

export function DashboardTopbar({ baslik }: { baslik: string }) {
  const { kullanici, cikisYap } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [menuAcik, setMenuAcik] = useState(false);
  const [bildirimAcik, setBildirimAcik] = useState(false);
  const bildirimRef = useRef<HTMLDivElement>(null);

  const { data: bildirimler = [] } = useQuery({
    queryKey: ["bildirimler"], queryFn: bildirimleriListele, enabled: !!kullanici, refetchInterval: 60_000,
  });
  const okunduMutation = useMutation({ mutationFn: bildirimiOkunduYap, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bildirimler"] }) });
  const tumuMutation = useMutation({ mutationFn: tumBildirimleriOkunduYap, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bildirimler"] }) });
  const okunmamisSayisi = bildirimler.filter((b) => !b.okundu_mu).length;

  useEffect(() => {
    const kapat = (e: MouseEvent) => { if (bildirimRef.current && !bildirimRef.current.contains(e.target as Node)) setBildirimAcik(false); };
    document.addEventListener("mousedown", kapat);
    return () => document.removeEventListener("mousedown", kapat);
  }, []);

  if (!kullanici) return null;
  const talepYolu = (id: string) => kullanici.rol === "admin" ? `/admin/talepler/${id}` : kullanici.rol === "personel" ? `/personel/${id}` : `/panel/taleplerim/${id}`;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/90 px-5 backdrop-blur">
      <h1 className="font-display text-base font-semibold text-foreground">{baslik}</h1>
      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="search" placeholder="Ara..." className="h-10 w-56 rounded-xl border border-border bg-muted/60 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40" /></div>
        <ThemeToggle />
        <div className="relative" ref={bildirimRef}>
          <button onClick={() => setBildirimAcik((v) => !v)} className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" aria-label={`Bildirimler${okunmamisSayisi ? ` (${okunmamisSayisi} okunmamış)` : ""}`} aria-expanded={bildirimAcik}>
            <Bell className="h-[18px] w-[18px]" />
            {okunmamisSayisi > 0 && <span className="absolute right-1 top-0.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">{okunmamisSayisi > 9 ? "9+" : okunmamisSayisi}</span>}
          </button>
          {bildirimAcik && <div className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-3"><div><p className="text-sm font-semibold">Bildirimler</p><p className="text-xs text-muted-foreground">{okunmamisSayisi} okunmamış bildirim</p></div>{okunmamisSayisi > 0 && <button onClick={() => tumuMutation.mutate()} disabled={tumuMutation.isPending} className="flex items-center gap-1 text-xs font-medium text-primary-700 hover:underline disabled:opacity-50"><CheckCheck className="h-3.5 w-3.5" /> Tümünü okundu yap</button>}</div>
            <div className="max-h-80 overflow-y-auto">{bildirimler.length === 0 ? <p className="px-4 py-8 text-center text-sm text-muted-foreground">Henüz bildiriminiz yok.</p> : bildirimler.slice(0, 8).map((b) => <button key={b.id} onClick={() => { if (!b.okundu_mu) okunduMutation.mutate(b.id); setBildirimAcik(false); if (b.ilgili_talep_id) router.push(talepYolu(b.ilgili_talep_id)); }} className={cn("block w-full border-b border-border/60 px-4 py-3 text-left transition-colors hover:bg-muted", !b.okundu_mu && "bg-primary-50/60")}><div className="flex gap-2"><span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", b.okundu_mu ? "bg-transparent" : "bg-primary-600")} /><div className="min-w-0"><p className="truncate text-sm font-medium text-foreground">{b.baslik}</p><p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{b.mesaj}</p><p className="mt-1 text-[11px] text-muted-foreground">{goreceliZaman(b.olusturulma_tarihi)}</p></div></div></button>)}</div>
          </div>}
        </div>
        <div className="relative"><button onClick={() => setMenuAcik((v) => !v)} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 hover:bg-muted" aria-expanded={menuAcik}><Avatar ad={kullanici.ad} soyad={kullanici.soyad} src={kullanici.profil_fotografi} /><span className="hidden text-left sm:block"><span className="block text-sm font-medium leading-tight">{kullanici.ad} {kullanici.soyad}</span><span className="block text-xs capitalize text-muted-foreground">{kullanici.rol}</span></span><ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /></button>
          <div className={cn("absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface p-1.5 shadow-card transition-all", menuAcik ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0")}><a href={kullanici.rol === "vatandas" ? "/panel/profil" : kullanici.rol === "admin" ? "/admin/ayarlar" : "/personel/ayarlar"} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-muted"><Settings className="h-4 w-4" />Ayarlar</a><button onClick={cikisYap} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-danger-bg"><LogOut className="h-4 w-4" />Çıkış Yap</button></div>
        </div>
      </div>
    </header>
  );
}
