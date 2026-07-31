"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, FileText, Clock, Bell, ArrowRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { taleplerListele } from "@/lib/api/talepler";
import { bildirimleriListele } from "@/lib/api/bildirimler";
import { useAuth } from "@/providers/auth-provider";
import { DURUM_ETIKETLERI, DURUM_RENKLERI } from "@/constants/durum";
import { goreceliZaman, cn } from "@/lib/utils";

export default function VatandasDashboard() {
  const { kullanici } = useAuth();

  const { data: talepler, isLoading: talepYukleniyor } = useQuery({
    queryKey: ["talepler", "vatandas-panel"],
    queryFn: () => taleplerListele({ sayfa: 1, sayfa_boyutu: 5 }),
    enabled: !!kullanici,
  });

  const { data: bildirimler, isLoading: bildirimYukleniyor } = useQuery({
    queryKey: ["bildirimler", "panel"],
    queryFn: bildirimleriListele,
    enabled: !!kullanici,
  });

  const kayitlar = talepler?.veriler ?? [];
  const toplam = talepler?.toplam ?? 0;
  const devamEden = kayitlar.filter((t) => !["cozuldu", "kapatildi"].includes(t.durum)).length;
  const cozulen = kayitlar.filter((t) => t.durum === "cozuldu" || t.durum === "kapatildi").length;

  return (
    <div className="space-y-6">
      {/* Özet kartları */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-medium text-muted-foreground">Toplam Talep</p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">{talepYukleniyor ? "—" : toplam}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-muted-foreground">Devam Eden</p>
          <p className="mt-2 font-display text-2xl font-bold text-info">{talepYukleniyor ? "—" : devamEden}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-muted-foreground">Çözülen</p>
          <p className="mt-2 font-display text-2xl font-bold text-success">{talepYukleniyor ? "—" : cozulen}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-muted-foreground">Okunmamış Bildirim</p>
          <p className="mt-2 font-display text-2xl font-bold text-foreground">
            {bildirimYukleniyor ? "—" : bildirimler?.filter((b) => !b.okundu_mu).length ?? 0}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Taleplerim */}
        <Card>
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="font-display text-base font-semibold text-foreground">Taleplerim</h2>
            <Link href="/panel/taleplerim" className="text-xs font-medium text-primary-700 hover:underline">
              Tümünü Gör
            </Link>
          </div>

          <div className="p-5">
            {talepYukleniyor ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : kayitlar.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <FileText className="h-8 w-8 text-muted-foreground" aria-hidden />
                <p className="text-sm text-muted-foreground">Henüz bir talebiniz yok.</p>
                <Link href="/panel/talep-olustur" className={cn(buttonVariants({ size: "sm" }))}>
                  <PlusCircle className="h-4 w-4" aria-hidden />
                  İlk Talebinizi Oluşturun
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {kayitlar.map((talep) => {
                  const renk = DURUM_RENKLERI[talep.durum];
                  return (
                    <li key={talep.id}>
                      <Link
                        href={`/panel/taleplerim/${talep.id}`}
                        className="flex items-center justify-between gap-3 py-3.5 hover:opacity-80"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{talep.baslik}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            #{talep.takip_no} · {talep.kategori.ad} · {goreceliZaman(talep.olusturulma_tarihi)}
                          </p>
                        </div>
                        <Badge className={cn(renk.bg, renk.text)} dot>
                          {DURUM_ETIKETLERI[talep.durum]}
                        </Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>

        {/* Bildirimler */}
        <Card>
          <div className="flex items-center justify-between p-5 pb-0">
            <h2 className="font-display text-base font-semibold text-foreground">Bildirimler</h2>
            <Link href="/panel/bildirimler" className="text-xs font-medium text-primary-700 hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="p-5">
            {bildirimYukleniyor ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : !bildirimler || bildirimler.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Bell className="h-7 w-7 text-muted-foreground" aria-hidden />
                <p className="text-sm text-muted-foreground">Yeni bildiriminiz yok.</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {bildirimler.slice(0, 5).map((bildirim) => (
                  <li key={bildirim.id} className={cn("rounded-lg px-2 py-2.5", !bildirim.okundu_mu && "bg-primary-50/60")}>
                    <p className="text-sm font-medium leading-snug text-foreground">{bildirim.baslik}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{goreceliZaman(bildirim.olusturulma_tarihi)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      {/* Kısayollar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Link href="/panel/talep-olustur" className={cn(buttonVariants({ variant: "secondary" }), "h-auto flex-col items-start gap-2 p-5 text-left")}>
          <PlusCircle className="h-5 w-5 text-primary-700" aria-hidden />
          <span className="font-display text-sm font-semibold text-foreground">Yeni Talep Oluştur</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Bir sorun mu bildirmek istiyorsunuz? <ArrowRight className="h-3 w-3" aria-hidden />
          </span>
        </Link>
        <Link href="/panel/harita" className={cn(buttonVariants({ variant: "secondary" }), "h-auto flex-col items-start gap-2 p-5 text-left")}>
          <MapPin className="h-5 w-5 text-primary-700" aria-hidden />
          <span className="font-display text-sm font-semibold text-foreground">Haritada Görüntüle</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Bölgenizdeki açık talepleri inceleyin <ArrowRight className="h-3 w-3" aria-hidden />
          </span>
        </Link>
        <Link href="/panel/taleplerim?durum=bekliyor" className={cn(buttonVariants({ variant: "secondary" }), "h-auto flex-col items-start gap-2 p-5 text-left")}>
          <Clock className="h-5 w-5 text-primary-700" aria-hidden />
          <span className="font-display text-sm font-semibold text-foreground">Bekleyen Talepler</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            Sırada olan taleplerinizi görün <ArrowRight className="h-3 w-3" aria-hidden />
          </span>
        </Link>
      </div>
    </div>
  );
}
