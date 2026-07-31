"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mahalleAnaliziGetir, personelPerformansiGetir } from "@/lib/api/admin";

export default function RaporlarSayfasi() {
  const { data: mahalleAnalizi, isLoading: mahalleYukleniyor } = useQuery({
    queryKey: ["admin", "mahalle-analizi"],
    queryFn: mahalleAnaliziGetir,
  });

  const { data: personelPerformansi, isLoading: personelYukleniyor } = useQuery({
    queryKey: ["admin", "personel-performans"],
    queryFn: personelPerformansiGetir,
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl font-bold text-foreground">Raporlar</h1>

      <Card>
        <CardHeader><CardTitle>Mahalle Analizi</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          {mahalleYukleniyor ? (
            <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />)}</div>
          ) : (
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Mahalle</th>
                  <th className="py-2 pr-3 font-medium">Talep Sayısı</th>
                  <th className="py-2 pr-3 font-medium">Ort. Çözüm Süresi</th>
                  <th className="py-2 pr-3 font-medium">En Çok Şikayet</th>
                </tr>
              </thead>
              <tbody>
                {mahalleAnalizi?.map((m) => (
                  <tr key={m.mahalle_adi} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-3 font-medium text-foreground">{m.mahalle_adi}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{m.talep_sayisi}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">
                      {m.ortalama_cozum_suresi_saat != null ? `${m.ortalama_cozum_suresi_saat.toFixed(1)} saat` : "—"}
                    </td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{m.en_cok_sikayet_kategorisi ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Personel Performansı</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          {personelYukleniyor ? (
            <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />)}</div>
          ) : (
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">Personel</th>
                  <th className="py-2 pr-3 font-medium">Çözülen</th>
                  <th className="py-2 pr-3 font-medium">Bekleyen</th>
                  <th className="py-2 pr-3 font-medium">Tamamlanma</th>
                  <th className="py-2 pr-3 font-medium">Memnuniyet</th>
                  <th className="py-2 pr-3 font-medium">Performans Puanı</th>
                </tr>
              </thead>
              <tbody>
                {personelPerformansi?.map((p) => (
                  <tr key={p.personel_id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-3 font-medium text-foreground">{p.ad_soyad}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{p.cozulen_talep}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{p.bekleyen_talep}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">%{p.tamamlanma_orani.toFixed(0)}</td>
                    <td className="py-2.5 pr-3 text-muted-foreground">{p.memnuniyet_ortalamasi != null ? p.memnuniyet_ortalamasi.toFixed(1) : "—"}</td>
                    <td className="py-2.5 pr-3 font-medium text-primary-700">{p.performans_puani.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
