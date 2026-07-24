"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, ListChecks, TrendingUp } from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { IstatistikKarti } from "@/components/admin/istatistik-karti";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { adminApi } from "@/lib/api/admin";
import "@/lib/chart-ayarlari";

const GRAFIK_RENKLERI = [
  "#2563EB", "#0EA5E9", "#22C55E", "#F59E0B", "#EF4444",
  "#8B5CF6", "#EC4899", "#14B8A6", "#F97316", "#64748B",
];

function tarihiKisaltilmisGoster(tarih: string) {
  return new Date(tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export default function YoneticiGenelBakisSayfasi() {
  const { data: genel, isLoading: genelYukleniyor } = useQuery({
    queryKey: ["admin-genel-istatistik"],
    queryFn: adminApi.genelIstatistikler,
  });
  const { data: kategoriDagilimi } = useQuery({
    queryKey: ["admin-kategori-dagilimi"],
    queryFn: adminApi.kategoriDagilimi,
  });
  const { data: mahalleDagilimi } = useQuery({
    queryKey: ["admin-mahalle-dagilimi"],
    queryFn: adminApi.mahalleDagilimi,
  });
  const { data: gunlukTalepler } = useQuery({
    queryKey: ["admin-gunluk-talepler"],
    queryFn: () => adminApi.gunlukTalepler(30),
  });

  if (genelYukleniyor || !genel) return <TamSayfaYukleniyor />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-metin sm:text-3xl">Genel Bakış</h1>
        <p className="text-sm text-metin-ikincil">Kapaklı Belediyesi talep sisteminin özet istatistikleri.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <IstatistikKarti ikon={ListChecks} etiket="Toplam Talep" deger={genel.toplam_talep} vurgu="birincil" />
        <IstatistikKarti ikon={Clock} etiket="Bekleyen Talep" deger={genel.bekleyen_talep} vurgu="uyari" />
        <IstatistikKarti ikon={CheckCircle2} etiket="Çözülen Talep" deger={genel.cozulen_talep} vurgu="basarili" />
        <IstatistikKarti ikon={TrendingUp} etiket="Tamamlanma Oranı" deger={`%${genel.tamamlanma_orani}`} vurgu="birincil" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <IstatistikKarti ikon={ListChecks} etiket="Bugünkü Talepler" deger={genel.bugunku_talep} />
        <IstatistikKarti ikon={ListChecks} etiket="Bu Haftaki Talepler" deger={genel.bu_hafta_talep} />
        <IstatistikKarti ikon={ListChecks} etiket="Bu Ayki Talepler" deger={genel.bu_ay_talep} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Kart className="lg:col-span-2">
          <KartBasligi>
            <KartBaslik className="text-lg">Son 30 Günde Talep Sayısı</KartBaslik>
          </KartBasligi>
          <KartIcerik>
            {gunlukTalepler && gunlukTalepler.length > 0 ? (
              <Line
                data={{
                  labels: gunlukTalepler.map((n) => tarihiKisaltilmisGoster(n.tarih)),
                  datasets: [
                    {
                      label: "Talep Sayısı",
                      data: gunlukTalepler.map((n) => n.sayi),
                      borderColor: "#2563EB",
                      backgroundColor: "rgba(37, 99, 235, 0.1)",
                      fill: true,
                      tension: 0.3,
                    },
                  ],
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
              />
            ) : (
              <p className="py-8 text-center text-sm text-metin-ikincil">Henüz veri bulunmuyor.</p>
            )}
          </KartIcerik>
        </Kart>

        <Kart>
          <KartBasligi>
            <KartBaslik className="text-lg">Kategori Dağılımı</KartBaslik>
          </KartBasligi>
          <KartIcerik>
            {kategoriDagilimi && kategoriDagilimi.length > 0 ? (
              <Doughnut
                data={{
                  labels: kategoriDagilimi.map((k) => k.kategori_adi),
                  datasets: [{ data: kategoriDagilimi.map((k) => k.sayi), backgroundColor: GRAFIK_RENKLERI }],
                }}
                options={{ responsive: true, plugins: { legend: { position: "bottom", labels: { boxWidth: 12 } } } }}
              />
            ) : (
              <p className="py-8 text-center text-sm text-metin-ikincil">Henüz veri bulunmuyor.</p>
            )}
          </KartIcerik>
        </Kart>
      </div>

      <Kart>
        <KartBasligi>
          <KartBaslik className="text-lg">Mahalle Dağılımı</KartBaslik>
        </KartBasligi>
        <KartIcerik>
          {mahalleDagilimi && mahalleDagilimi.length > 0 ? (
            <Bar
              data={{
                labels: mahalleDagilimi.map((m) => m.mahalle_adi),
                datasets: [{ label: "Talep Sayısı", data: mahalleDagilimi.map((m) => m.sayi), backgroundColor: "#0EA5E9" }],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          ) : (
            <p className="py-8 text-center text-sm text-metin-ikincil">Henüz veri bulunmuyor.</p>
          )}
        </KartIcerik>
      </Kart>
    </div>
  );
}
