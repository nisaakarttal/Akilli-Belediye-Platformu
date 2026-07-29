"use client";

import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock,
  ListChecks,
  MapPin,
  PieChart as PieIcon,
  Radio,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { AnalitikKarti } from "@/components/admin/analitik-karti";
import { KpiKarti } from "@/components/admin/kpi-karti";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import {
  GRAFIK_TEMA_RENKLERI,
  HAFTALIK_PERFORMANS_SABIT_ILERLEME_YUZDESI,
  KATEGORI_VERI_PALETI,
  MAHALLE_CUBUK_HOVER_RENGI,
  MAHALLE_CUBUK_RENGI,
  TREND_CIZGI_RENGI,
  ZAMAN_FILTRE_SECENEKLERI,
} from "@/constants/admin-dashboard";
import { useYoneticiGenelBakis } from "@/hooks/use-yonetici-genel-bakis";
import { tarihKisaFormatla } from "@/lib/tarih";
import { cn } from "@/lib/utils";
import "@/lib/chart-ayarlari";

const EKSEN_SECENEKLERI = {
  y: {
    grid: { color: GRAFIK_TEMA_RENKLERI.izgara },
    ticks: { font: { size: 11, weight: "700" as const }, color: GRAFIK_TEMA_RENKLERI.eksenMetin },
  },
  x: {
    grid: { display: false },
    ticks: { font: { size: 11, weight: "700" as const }, color: GRAFIK_TEMA_RENKLERI.eksenMetin },
  },
};

export default function YoneticiGenelBakisSayfasi() {
  const {
    zamanFiltresi,
    setZamanFiltresi,
    genel,
    genelYukleniyor,
    kategoriDagilimi,
    mahalleDagilimi,
    gunlukTalepler,
    kategoriToplamSayi,
  } = useYoneticiGenelBakis();

  if (genelYukleniyor || !genel) return <TamSayfaYukleniyor />;

  const bekleyenYuzdesi = Math.min(100, (genel.bekleyen_talep / (genel.toplam_talep || 1)) * 100);

  return (
    <div className="space-y-8 pb-24 pt-2 selection:bg-birincil-500 selection:text-white">
      {/* 1. Üst komuta başlığı */}
      <div className="relative overflow-hidden rounded-3xl border border-kenarlik bg-zemin/70 p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-birincil-500/15 blur-[100px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-ikincil-500/15 blur-[100px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-birincil-500/20 bg-birincil-600/10 px-3 py-1 text-xs font-extrabold text-birincil-600">
                <Sparkles size={13} className="text-uyari" aria-hidden="true" /> Yönetici Komuta Merkezi
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-basarili/20 bg-basarili/10 px-3 py-1 text-xs font-bold text-green-600">
                <Radio size={12} className="animate-ping text-basarili" aria-hidden="true" /> Canlı Veri Akışı
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-metin sm:text-4xl">
              Genel Bakış &amp; Kontrol Paneli
            </h1>
            <p className="max-w-2xl text-sm font-medium text-metin-ikincil">
              Kapaklı Belediyesi Şikâyet &amp; Talep Yönetim Sistemi canlı işlem hacmi ve bölgesel analitik.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-kenarlik bg-zemin/80 p-4 shadow-xl">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-birincil-700 via-birincil-600 to-ikincil-500 text-white shadow-lg shadow-birincil-600/30">
              <Zap size={22} aria-hidden="true" />
              <span className="absolute -right-1 -top-1 flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-basarili opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-basarili" />
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-metin-ikincil">
                Çözüm Başarı Skoru
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-2xl font-black text-metin">%{genel.tamamlanma_orani}</span>
                <span className="inline-flex items-center rounded-md bg-basarili/10 px-2 py-0.5 text-xs font-bold text-green-600">
                  <ArrowUpRight size={14} aria-hidden="true" /> Mükemmel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI kartları */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiKarti
          ikon={ListChecks}
          etiket="Toplam Başvuru"
          deger={genel.toplam_talep}
          vurguEtiketi="Sistem Geneli"
          vurgu="birincil"
          ilerlemeYuzdesi={100}
          nabizAnimasyonu
        />
        <KpiKarti
          ikon={Clock}
          etiket="Bekleyen Talepler"
          deger={genel.bekleyen_talep}
          vurguEtiketi="İşlem Sırasında"
          vurgu="uyari"
          ilerlemeYuzdesi={bekleyenYuzdesi}
        />
        <KpiKarti
          ikon={CheckCircle2}
          etiket="Çözülen Talepler"
          deger={genel.cozulen_talep}
          vurguEtiketi="Sonuçlandı"
          vurgu="basarili"
          ilerlemeYuzdesi={genel.tamamlanma_orani}
        />
        <KpiKarti
          ikon={TrendingUp}
          etiket="Haftalık Performans"
          deger={genel.bu_hafta_talep}
          vurguEtiketi="Bu Hafta Girişi"
          vurgu="ikincil"
          ilerlemeYuzdesi={HAFTALIK_PERFORMANS_SABIT_ILERLEME_YUZDESI}
        />
      </div>

      {/* 3. Ana analitik bölümü */}
      <div className="grid gap-6 lg:grid-cols-12">
        <AnalitikKarti
          ikon={BarChart3}
          baslik="Talep Giriş Hacmi"
          aciklama="Sistem üzerindeki zaman bazlı yük dağılımı"
          className="lg:col-span-8"
          sagIcerik={
            <div className="flex items-center gap-1 rounded-2xl border border-kenarlik bg-black/5 p-1 dark:bg-white/5">
              {ZAMAN_FILTRE_SECENEKLERI.map((gun) => (
                <button
                  key={gun}
                  onClick={() => setZamanFiltresi(gun)}
                  className={cn(
                    "rounded-xl px-3.5 py-1.5 text-xs font-black transition-all",
                    zamanFiltresi === gun
                      ? "bg-zemin text-birincil-600 shadow-md"
                      : "text-metin-ikincil hover:text-metin"
                  )}
                  aria-pressed={zamanFiltresi === gun}
                >
                  {gun} Gün
                </button>
              ))}
            </div>
          }
        >
          {gunlukTalepler && gunlukTalepler.length > 0 ? (
            <div className="h-[320px] w-full">
              <Line
                data={{
                  labels: gunlukTalepler.map((n) => tarihKisaFormatla(n.tarih)),
                  datasets: [
                    {
                      label: "Talep",
                      data: gunlukTalepler.map((n) => n.sayi),
                      borderColor: TREND_CIZGI_RENGI,
                      borderWidth: 3.5,
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                        gradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
                        gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");
                        return gradient;
                      },
                      fill: true,
                      tension: 0.4,
                      pointBackgroundColor: GRAFIK_TEMA_RENKLERI.tooltipArkaPlan,
                      pointBorderColor: "#818CF8",
                      pointBorderWidth: 3,
                      pointRadius: 5,
                      pointHoverRadius: 8,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: GRAFIK_TEMA_RENKLERI.tooltipArkaPlan,
                      titleColor: "#F8FAFC",
                      bodyColor: "#818CF8",
                      bodyFont: { weight: "bold", size: 13 },
                      padding: 14,
                      cornerRadius: 12,
                      displayColors: false,
                    },
                  },
                  scales: EKSEN_SECENEKLERI,
                }}
              />
            </div>
          ) : (
            <div className="flex h-[320px] items-center justify-center text-sm font-semibold text-metin-ikincil">
              Seçilen filtrede veri bulunamadı.
            </div>
          )}
        </AnalitikKarti>

        <AnalitikKarti
          ikon={PieIcon}
          ikonSinifi="text-purple-500"
          baslik="Kategori Ağırlığı"
          className="flex flex-col justify-between lg:col-span-4"
          sagIcerik={
            <span className="text-[10px] font-black uppercase tracking-widest text-metin-ikincil">Dağılım</span>
          }
        >
          {kategoriDagilimi && kategoriDagilimi.length > 0 ? (
            <div className="flex flex-1 flex-col justify-between space-y-6">
              <div className="relative flex h-48 w-full items-center justify-center">
                <Doughnut
                  data={{
                    labels: kategoriDagilimi.map((k) => k.kategori_adi),
                    datasets: [
                      {
                        data: kategoriDagilimi.map((k) => k.sayi),
                        backgroundColor: KATEGORI_VERI_PALETI.map((renk) => renk.hex),
                        borderWidth: 0,
                        hoverOffset: 8,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { backgroundColor: GRAFIK_TEMA_RENKLERI.tooltipArkaPlan, padding: 12, cornerRadius: 10 },
                    },
                    cutout: "80%",
                  }}
                />
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-metin">{kategoriToplamSayi}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-metin-ikincil">
                    Kayıtlı Talep
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {kategoriDagilimi.slice(0, 4).map((kategori, index) => {
                  const yuzde = kategoriToplamSayi > 0 ? Math.round((kategori.sayi / kategoriToplamSayi) * 100) : 0;
                  const renk = KATEGORI_VERI_PALETI[index % KATEGORI_VERI_PALETI.length];

                  return (
                    <div key={kategori.kategori_adi} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-extrabold">
                        <span className="max-w-[160px] truncate text-metin">{kategori.kategori_adi}</span>
                        <span className="text-metin-ikincil">
                          %{yuzde} ({kategori.sayi})
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
                        <div className={cn("h-full rounded-full", renk.barSinifi)} style={{ width: `${yuzde}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm font-semibold text-metin-ikincil">
              Veri bulunmuyor.
            </div>
          )}
        </AnalitikKarti>
      </div>

      {/* 4. Coğrafi dağılım grafiği */}
      <AnalitikKarti ikon={MapPin} ikonSinifi="text-sky-500" baslik="Mahalle Bazında Yoğunluk Haritası">
        {mahalleDagilimi && mahalleDagilimi.length > 0 ? (
          <div className="h-[280px] w-full">
            <Bar
              data={{
                labels: mahalleDagilimi.map((m) => m.mahalle_adi),
                datasets: [
                  {
                    label: "Talep Sayısı",
                    data: mahalleDagilimi.map((m) => m.sayi),
                    backgroundColor: MAHALLE_CUBUK_RENGI,
                    hoverBackgroundColor: MAHALLE_CUBUK_HOVER_RENGI,
                    borderRadius: 10,
                    borderSkipped: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { backgroundColor: GRAFIK_TEMA_RENKLERI.tooltipArkaPlan, padding: 12, cornerRadius: 10 },
                },
                scales: EKSEN_SECENEKLERI,
              }}
            />
          </div>
        ) : (
          <div className="flex h-[280px] items-center justify-center text-sm font-semibold text-metin-ikincil">
            Mahalle verisi henüz oluşmadı.
          </div>
        )}
      </AnalitikKarti>
    </div>
  );
}
