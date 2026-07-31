"use client";

import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memnuniyetPersonelGetir, memnuniyetKategoriGetir, mahalleDagilimiGetir } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

export default function IstatistiklerSayfasi() {
  const { data: memnuniyetPersonel } = useQuery({ queryKey: ["admin", "memnuniyet-personel"], queryFn: memnuniyetPersonelGetir });
  const { data: memnuniyetKategori } = useQuery({ queryKey: ["admin", "memnuniyet-kategori"], queryFn: memnuniyetKategoriGetir });
  const { data: mahalleDagilimi } = useQuery({ queryKey: ["admin", "mahalle-dagilimi"], queryFn: mahalleDagilimiGetir });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl font-bold text-foreground">İstatistikler</h1>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Personel Bazlı Memnuniyet</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {memnuniyetPersonel?.map((m) => (
                <li key={m.personel_id} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted">
                  <span className="text-sm font-medium text-foreground">{m.ad_soyad}</span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    {m.ortalama_puan.toFixed(1)} ({m.degerlendirme_sayisi})
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Kategori Bazlı Memnuniyet</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {memnuniyetKategori?.map((m) => (
                <li key={m.kategori_adi} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted">
                  <span className="text-sm font-medium text-foreground">{m.kategori_adi}</span>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                    {m.ortalama_puan.toFixed(1)} ({m.degerlendirme_sayisi})
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Mahalle Dağılımı</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {mahalleDagilimi?.map((m) => {
              const maks = Math.max(...(mahalleDagilimi?.map((x) => x.sayi) ?? [1]));
              return (
                <li key={m.mahalle_adi}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{m.mahalle_adi}</span>
                    <span className="text-muted-foreground">{m.sayi}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full bg-primary-700")} style={{ width: `${(m.sayi / maks) * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
