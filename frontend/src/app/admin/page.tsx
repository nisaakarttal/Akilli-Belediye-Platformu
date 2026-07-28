"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
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
  ArrowUpRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { adminApi } from "@/lib/api/admin";
import "@/lib/chart-ayarlari";

type ZamanAraligiGunu = 7 | 14 | 30;

const ZAMAN_ARALIGI_SECENEKLERI: ZamanAraligiGunu[] = [7, 14, 30];
const VARSAYILAN_ZAMAN_ARALIGI: ZamanAraligiGunu = 30;
const KATEGORI_LISTESI_LIMITI = 4;
const GRAFIK_YUKSEKLIGI_TREND = 320;
const GRAFIK_YUKSEKLIGI_BAR = 280;
const KOYU_METIN_RENGI = "#0F172A";
const GRAFIK_IZGARA_RENGI = "rgba(148, 163, 184, 0.08)";
const GRAFIK_ETIKET_RENGI = "#64748B";

const PALET = [
  { main: "#818CF8", bg: "bg-indigo-500", label: "Indigo" },
  { main: "#38BDF8", bg: "bg-sky-500", label: "Sky" },
  { main: "#34D399", bg: "bg-emerald-500", label: "Emerald" },
  { main: "#FBBF24", bg: "bg-amber-500", label: "Amber" },
  { main: "#F472B6", bg: "bg-pink-500", label: "Pink" },
];

const GRAFIK_ETIKET_YAZI_TIPI = { size: 11, weight: 700 as const };
const IZGARA_EKSEN_AYARLARI = {
  y: {
    grid: { color: GRAFIK_IZGARA_RENGI },
    ticks: { font: GRAFIK_ETIKET_YAZI_TIPI, color: GRAFIK_ETIKET_RENGI },
  },
  x: {
    grid: { display: false },
    ticks: { font: GRAFIK_ETIKET_YAZI_TIPI, color: GRAFIK_ETIKET_RENGI },
  },
};

function tarihiKisaltilmisGoster(tarih: string) {
  return new Date(tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export default function YoneticiGenelBakisSayfasi() {
  const [zamanFiltresi, setZamanFiltresi] = useState<ZamanAraligiGunu>(VARSAYILAN_ZAMAN_ARALIGI);

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
    queryKey: ["admin-gunluk-talepler", zamanFiltresi],
    queryFn: () => adminApi.gunlukTalepler(zamanFiltresi),
  });

  const kategoriToplamSayi = useMemo(() => {
    if (!kategoriDagilimi) return 0;
    return kategoriDagilimi.reduce((acc, curr) => acc + curr.sayi, 0);
  }, [kategoriDagilimi]);

  if (genelYukleniyor || !genel) return <TamSayfaYukleniyor />;

  return (
    <div className="space-y-8 pb-24 pt-2 font-sans text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* 1. Üst komuta başlığı */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-2xl backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/70 sm:p-8">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 animate-pulse rounded-full bg-indigo-500/15 blur-[100px] dark:bg-indigo-500/25"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sky-500/15 blur-[100px] dark:bg-sky-500/20"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-extrabold text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                <Sparkles size={13} className="text-amber-400" aria-hidden="true" /> Yönetim Merkezi
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <Radio size={12} className="animate-ping text-emerald-500" aria-hidden="true" /> Canlı Yayın
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Genel Bakış &amp; Kontrol Paneli
            </h1>
            <p className="max-w-2xl text-sm font-medium text-slate-500 dark:text-slate-400">
              Kapaklı Belediyesi Şikâyet &amp; Talep Yönetim Sistemi canlı işlem hacmi ve bölgesel analitik.
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950/80">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <Zap size={22} aria-hidden="true" />
              <span className="absolute -right-1 -top-1 flex h-3 w-3" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Çözüm Başarı Skoru
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  %{genel.tamamlanma_orani}
                </span>
                <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-500">
                  <ArrowUpRight size={14} aria-hidden="true" /> Mükemmel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KPI kartları */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-indigo-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Toplam Başvuru
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-200/30 bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110 dark:border-indigo-800/30 dark:bg-indigo-950/80 dark:text-indigo-400">
              <ListChecks size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{genel.toplam_talep}</h3>
            <span className="text-xs font-bold text-indigo-500">Sistem Geneli</span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-full animate-pulse rounded-full bg-indigo-500" />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-amber-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Bekleyen Talepler
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-200/30 bg-amber-50 text-amber-600 transition-transform group-hover:scale-110 dark:border-amber-800/30 dark:bg-amber-950/80 dark:text-amber-400">
              <Clock size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{genel.bekleyen_talep}</h3>
            <span className="text-xs font-bold text-amber-500">İşlem Sırasında</span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${Math.min(100, (genel.bekleyen_talep / (genel.toplam_talep || 1)) * 100)}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-emerald-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Çözülen Talepler
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-200/30 bg-emerald-50 text-emerald-600 transition-transform group-hover:scale-110 dark:border-emerald-800/30 dark:bg-emerald-950/80 dark:text-emerald-400">
              <CheckCircle2 size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{genel.cozulen_talep}</h3>
            <span className="text-xs font-bold text-emerald-500">Sonuçlandı</span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${genel.tamamlanma_orani}%` }} />
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
          className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:border-sky-500/50 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Haftalık Performans
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-sky-200/30 bg-sky-50 text-sky-600 transition-transform group-hover:scale-110 dark:border-sky-800/30 dark:bg-sky-950/80 dark:text-sky-400">
              <TrendingUp size={20} aria-hidden="true" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{genel.bu_hafta_talep}</h3>
            <span className="text-xs font-bold text-sky-500">Bu Hafta Girişi</span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full w-3/4 rounded-full bg-sky-500" />
          </div>
        </motion.div>
      </div>

      {/* 3. Trend ve kategori dağılımı */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 dark:border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-500" aria-hidden="true" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Talep Giriş Hacmi</h2>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-400">Sistem üzerindeki zaman bazlı yük dağılımı</p>
            </div>

            <div
              role="tablist"
              aria-label="Zaman aralığı"
              className="flex items-center gap-1 rounded-2xl border border-slate-200/50 bg-slate-100 p-1 dark:border-slate-700/50 dark:bg-slate-800/80"
            >
              {ZAMAN_ARALIGI_SECENEKLERI.map((gun) => (
                <button
                  key={gun}
                  type="button"
                  role="tab"
                  aria-selected={zamanFiltresi === gun}
                  onClick={() => setZamanFiltresi(gun)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition-all ${
                    zamanFiltresi === gun
                      ? "bg-white text-indigo-600 shadow-md dark:bg-slate-900 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {gun} Gün
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6">
            {gunlukTalepler && gunlukTalepler.length > 0 ? (
              <div style={{ height: GRAFIK_YUKSEKLIGI_TREND }} className="w-full">
                <Line
                  data={{
                    labels: gunlukTalepler.map((n) => tarihiKisaltilmisGoster(n.tarih)),
                    datasets: [
                      {
                        label: "Talep",
                        data: gunlukTalepler.map((n) => n.sayi),
                        borderColor: "#6366F1",
                        borderWidth: 3.5,
                        backgroundColor: (context) => {
                          const ctx = context.chart.ctx;
                          const gradient = ctx.createLinearGradient(0, 0, 0, GRAFIK_YUKSEKLIGI_TREND);
                          gradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
                          gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");
                          return gradient;
                        },
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: KOYU_METIN_RENGI,
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
                        backgroundColor: KOYU_METIN_RENGI,
                        titleColor: "#F8FAFC",
                        bodyColor: "#818CF8",
                        bodyFont: { weight: "bold", size: 13 },
                        padding: 14,
                        cornerRadius: 12,
                        displayColors: false,
                      },
                    },
                    scales: IZGARA_EKSEN_AYARLARI,
                  }}
                />
              </div>
            ) : (
              <div
                style={{ height: GRAFIK_YUKSEKLIGI_TREND }}
                className="flex items-center justify-center text-sm font-semibold text-slate-400"
              >
                Seçilen filtrede veri bulunamadı.
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 lg:col-span-4">
          <div className="border-b border-slate-100 pb-5 dark:border-slate-800/80">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieIcon size={20} className="text-purple-500" aria-hidden="true" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Kategori Ağırlığı</h2>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dağılım</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between space-y-6 py-6">
            {kategoriDagilimi && kategoriDagilimi.length > 0 ? (
              <>
                <div className="relative flex h-48 w-full items-center justify-center">
                  <Doughnut
                    data={{
                      labels: kategoriDagilimi.map((k) => k.kategori_adi),
                      datasets: [
                        {
                          data: kategoriDagilimi.map((k) => k.sayi),
                          backgroundColor: PALET.map((p) => p.main),
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
                        tooltip: { backgroundColor: KOYU_METIN_RENGI, padding: 12, cornerRadius: 10 },
                      },
                      cutout: "80%",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{kategoriToplamSayi}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Kayıtlı Talep
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {kategoriDagilimi.slice(0, KATEGORI_LISTESI_LIMITI).map((kategori, index) => {
                    const yuzde =
                      kategoriToplamSayi > 0 ? Math.round((kategori.sayi / kategoriToplamSayi) * 100) : 0;
                    const renktema = PALET[index % PALET.length];

                    return (
                      <div key={kategori.kategori_adi} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-extrabold">
                          <span className="max-w-[160px] truncate text-slate-700 dark:text-slate-300">
                            {kategori.kategori_adi}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            %{yuzde} ({kategori.sayi})
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className={`h-full rounded-full ${renktema.bg}`} style={{ width: `${yuzde}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex h-48 items-center justify-center text-sm font-semibold text-slate-400">
                Veri bulunmuyor.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Mahalle bazında dağılım */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/90">
        <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-sky-500" aria-hidden="true" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Mahalle Bazında Yoğunluk</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">Bölgesel Analiz</span>
        </div>

        <div className="pt-6">
          {mahalleDagilimi && mahalleDagilimi.length > 0 ? (
            <div style={{ height: GRAFIK_YUKSEKLIGI_BAR }} className="w-full">
              <Bar
                data={{
                  labels: mahalleDagilimi.map((m) => m.mahalle_adi),
                  datasets: [
                    {
                      label: "Talep Sayısı",
                      data: mahalleDagilimi.map((m) => m.sayi),
                      backgroundColor: "#38BDF8",
                      hoverBackgroundColor: "#0284C7",
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
                    tooltip: { backgroundColor: KOYU_METIN_RENGI, padding: 12, cornerRadius: 10 },
                  },
                  scales: IZGARA_EKSEN_AYARLARI,
                }}
              />
            </div>
          ) : (
            <div
              style={{ height: GRAFIK_YUKSEKLIGI_BAR }}
              className="flex items-center justify-center text-sm font-semibold text-slate-400"
            >
              Mahalle verisi henüz oluşmadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
