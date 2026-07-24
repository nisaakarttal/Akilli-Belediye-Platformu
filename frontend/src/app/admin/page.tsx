"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  ListChecks,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  MapPin,
  Sparkles,
  Activity,
  ArrowUpRight,
  Zap,
  ShieldAlert,
  Radio,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { adminApi } from "@/lib/api/admin";
import "@/lib/chart-ayarlari";

const PALET = [
  { main: "#818CF8", bg: "bg-indigo-500", label: "Indigo" },
  { main: "#38BDF8", bg: "bg-sky-500", label: "Sky" },
  { main: "#34D399", bg: "bg-emerald-500", label: "Emerald" },
  { main: "#FBBF24", bg: "bg-amber-500", label: "Amber" },
  { main: "#F472B6", bg: "bg-pink-500", label: "Pink" },
];

function tarihiKisaltilmisGoster(tarih: string) {
  return new Date(tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}

export default function YoneticiGenelBakisSayfasi() {
  const [zamanFiltresi, setZamanFiltresi] = useState<30 | 14 | 7>(30);

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
    <div className="space-y-8 pt-2 pb-24 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. HERO COMMAND HEADER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/15 blur-[100px] dark:bg-indigo-500/25 animate-pulse" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sky-500/15 blur-[100px] dark:bg-sky-500/20" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-extrabold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Sparkles size={13} className="text-amber-400" /> Executive Command Center
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Radio size={12} className="animate-ping text-emerald-500" /> Live Stream Active
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Genel Bakış & Kontrol Paneli
            </h1>
            <p className="max-w-2xl text-sm font-medium text-slate-500 dark:text-slate-400">
              Kapaklı Belediyesi Şikayet & Talep Yönetim Sistemi canlı işlem hacmi ve bölgesel analitik.
            </p>
          </div>

          {/* Quick Metrics Widget */}
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 p-4 shadow-xl">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
              <Zap size={22} />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Çözüm Başarı Skoru</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900 dark:text-white">%{genel.tamamlanma_orani}</span>
                <span className="inline-flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  <ArrowUpRight size={14} /> Mükemmel
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BENTO GRID ARCHITECTURE */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm hover:shadow-xl hover:border-indigo-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Toplam Başvuru</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/30 dark:border-indigo-800/30 group-hover:scale-110 transition-transform">
              <ListChecks size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{genel.toplam_talep}</h3>
            <span className="text-xs font-bold text-indigo-500">Sistem Geneli</span>
          </div>
          <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-500 w-full animate-pulse" />
          </div>
        </motion.div>

        {/* KPI 2 */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Bekleyen Talepler</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200/30 dark:border-amber-800/30 group-hover:scale-110 transition-transform">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{genel.bekleyen_talep}</h3>
            <span className="text-xs font-bold text-amber-500">İşlem Sırasında</span>
          </div>
          <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-amber-500" style={{ width: `${Math.min(100, (genel.bekleyen_talep / (genel.toplam_talep || 1)) * 100)}%` }} />
          </div>
        </motion.div>

        {/* KPI 3 */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Çözülen Talepler</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200/30 dark:border-emerald-800/30 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{genel.cozulen_talep}</h3>
            <span className="text-xs font-bold text-emerald-500">Sonuçlandı</span>
          </div>
          <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${genel.tamamlanma_orani}%` }} />
          </div>
        </motion.div>

        {/* KPI 4 */}
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm hover:shadow-xl hover:border-sky-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Haftalık Performans</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 border border-sky-200/30 dark:border-sky-800/30 group-hover:scale-110 transition-transform">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{genel.bu_hafta_talep}</h3>
            <span className="text-xs font-bold text-sky-500">Bu Hafta Girişi</span>
          </div>
          <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-sky-500 w-3/4" />
          </div>
        </motion.div>
      </div>

      {/* 3. MAIN ANALYTICS SECTION */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Trend Area Chart (8 Columns) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Talep Giriş Hacmi</h2>
              </div>
              <p className="text-xs font-medium text-slate-400 mt-1">Sistem üzerindeki zaman bazlı yük dağılımı</p>
            </div>

            {/* Time Segment Filter */}
            <div className="flex items-center gap-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200/50 dark:border-slate-700/50">
              {[7, 14, 30].map((gun) => (
                <button
                  key={gun}
                  onClick={() => setZamanFiltresi(gun as 30 | 14 | 7)}
                  className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all ${
                    zamanFiltresi === gun
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-md"
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
              <div className="h-[320px] w-full">
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
                          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                          gradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
                          gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");
                          return gradient;
                        },
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: "#0F172A",
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
                        backgroundColor: "#0F172A",
                        titleColor: "#F8FAFC",
                        bodyColor: "#818CF8",
                        bodyFont: { weight: "bold", size: 13 },
                        padding: 14,
                        cornerRadius: 12,
                        displayColors: false,
                      },
                    },
                    scales: {
                      y: {
                        grid: { color: "rgba(148, 163, 184, 0.08)" },
                        ticks: { font: { size: 11, weight: "700" }, color: "#64748B" },
                      },
                      x: {
                        grid: { display: false },
                        ticks: { font: { size: 11, weight: "700" }, color: "#64748B" },
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <div className="h-[320px] flex items-center justify-center text-sm font-semibold text-slate-400">
                Seçilen filtrede veri bulunamadı.
              </div>
            )}
          </div>
        </div>

        {/* Donut & Live Breakdown (4 Columns) */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-xl flex flex-col justify-between">
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieIcon size={20} className="text-purple-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Kategori Ağırlığı</h2>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dağılım</span>
            </div>
          </div>

          <div className="py-6 flex-1 flex flex-col justify-between space-y-6">
            {kategoriDagilimi && kategoriDagilimi.length > 0 ? (
              <>
                <div className="relative h-48 w-full flex items-center justify-center">
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
                        tooltip: { backgroundColor: "#0F172A", padding: 12, cornerRadius: 10 },
                      },
                      cutout: "80%",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">{kategoriToplamSayi}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kayıtlı Talep</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {kategoriDagilimi.slice(0, 4).map((kategori, index) => {
                    const yuzde = kategoriToplamSayi > 0 ? Math.round((kategori.sayi / kategoriToplamSayi) * 100) : 0;
                    const renktema = PALET[index % PALET.length];

                    return (
                      <div key={kategori.kategori_adi} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-extrabold">
                          <span className="text-slate-700 dark:text-slate-300 truncate max-w-[160px]">{kategori.kategori_adi}</span>
                          <span className="text-slate-500 dark:text-slate-400">%{yuzde} ({kategori.sayi})</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className={`h-full rounded-full ${renktema.bg}`} style={{ width: `${yuzde}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-sm font-semibold text-slate-400">
                Veri bulunmuyor.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. GEOGRAPHIC BAR CHART */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-sky-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Mahalle Bazında Yoğunluk Haritası</h2>
          </div>
          <span className="text-xs font-bold text-slate-400">Bölgesel Analiz</span>
        </div>

        <div className="pt-6">
          {mahalleDagilimi && mahalleDagilimi.length > 0 ? (
            <div className="h-[280px] w-full">
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
                    tooltip: { backgroundColor: "#0F172A", padding: 12, cornerRadius: 10 },
                  },
                  scales: {
                    y: {
                      grid: { color: "rgba(148, 163, 184, 0.08)" },
                      ticks: { font: { size: 11, weight: "700" }, color: "#64748B" },
                    },
                    x: {
                      grid: { display: false },
                      ticks: { font: { size: 11, weight: "700" }, color: "#64748B" },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm font-semibold text-slate-400">
              Mahalle verisi henüz oluşmadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}