"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { atananTalepleriListele } from "@/lib/api/personel";
import { DURUM_ETIKETLERI, DURUM_RENKLERI, ONCELIK_ETIKETLERI, ONCELIK_RENKLERI } from "@/constants/durum";
import { tarihFormatla, cn } from "@/lib/utils";

export default function AtananTaleplerSayfasi() {
  const { data: talepler, isLoading } = useQuery({
    queryKey: ["personel", "atanan-talepler"],
    queryFn: atananTalepleriListele,
  });

  return (
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Atanan Talepler</h1>
      <p className="mt-1 text-sm text-muted-foreground">Size atanmış, çözüm bekleyen talepler.</p>

      <Card className="mt-4">
        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}
          </div>
        ) : !talepler || talepler.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <ListChecks className="h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">Şu anda atanmış talebiniz yok.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {talepler.map((talep) => {
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
    </div>
  );
}
