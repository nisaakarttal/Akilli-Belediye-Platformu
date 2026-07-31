"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FileText, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { taleplerListele } from "@/lib/api/talepler";
import { DURUM_ETIKETLERI, DURUM_RENKLERI, ONCELIK_ETIKETLERI, ONCELIK_RENKLERI } from "@/constants/durum";
import { tarihFormatla, cn } from "@/lib/utils";
import type { TalepDurumu } from "@/types";

const SAYFA_BOYUTU = 10;

const DURUM_SEKMELERI: { deger: TalepDurumu | "tumu"; etiket: string }[] = [
  { deger: "tumu", etiket: "Tümü" },
  { deger: "bekliyor", etiket: DURUM_ETIKETLERI.bekliyor },
  { deger: "inceleniyor", etiket: DURUM_ETIKETLERI.inceleniyor },
  { deger: "atandi", etiket: DURUM_ETIKETLERI.atandi },
  { deger: "cozuldu", etiket: DURUM_ETIKETLERI.cozuldu },
  { deger: "kapatildi", etiket: DURUM_ETIKETLERI.kapatildi },
];

export default function TaleplerimSayfasi() {
  const [durum, setDurum] = useState<TalepDurumu | "tumu">("tumu");
  const [sayfa, setSayfa] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["talepler", "liste", durum, sayfa],
    queryFn: () =>
      taleplerListele({
        durum: durum === "tumu" ? undefined : durum,
        sayfa,
        sayfa_boyutu: SAYFA_BOYUTU,
      }),
  });

  const kayitlar = data?.veriler ?? [];
  const toplamSayfa = data ? Math.max(1, Math.ceil(data.toplam / SAYFA_BOYUTU)) : 1;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-bold text-foreground">Taleplerim</h1>
        <Link href="/panel/talep-olustur" className={cn(buttonVariants({ size: "sm" }))}>
          <PlusCircle className="h-4 w-4" aria-hidden />
          Yeni Talep
        </Link>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {DURUM_SEKMELERI.map((sekme) => (
          <button
            key={sekme.deger}
            onClick={() => {
              setDurum(sekme.deger);
              setSayfa(1);
            }}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              durum === sekme.deger ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary-50"
            )}
          >
            {sekme.etiket}
          </button>
        ))}
      </div>

      <Card className="mt-4">
        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : kayitlar.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <FileText className="h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">Bu filtreyle eşleşen talebiniz yok.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {kayitlar.map((talep) => {
              const durumRenk = DURUM_RENKLERI[talep.durum];
              const oncelikRenk = ONCELIK_RENKLERI[talep.oncelik];
              return (
                <li key={talep.id}>
                  <Link href={`/panel/taleplerim/${talep.id}`} className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-muted/60">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{talep.baslik}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        #{talep.takip_no} · {talep.kategori.ad} · {talep.mahalle.ad} · {tarihFormatla(talep.olusturulma_tarihi)}
                        {talep.gecikti_mi && <span className="ml-1.5 font-medium text-danger">· Gecikti</span>}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Badge className={cn(oncelikRenk.bg, oncelikRenk.text)}>{ONCELIK_ETIKETLERI[talep.oncelik]}</Badge>
                      <Badge className={cn(durumRenk.bg, durumRenk.text)} dot>{DURUM_ETIKETLERI[talep.durum]}</Badge>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {toplamSayfa > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setSayfa((s) => Math.max(1, s - 1))}
            disabled={sayfa === 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border disabled:opacity-40"
            aria-label="Önceki sayfa"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-muted-foreground">{sayfa} / {toplamSayfa}</span>
          <button
            onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))}
            disabled={sayfa === toplamSayfa}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border disabled:opacity-40"
            aria-label="Sonraki sayfa"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
