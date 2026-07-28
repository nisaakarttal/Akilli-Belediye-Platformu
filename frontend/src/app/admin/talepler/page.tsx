"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileQuestion,
  Filter,
  Search,
  RefreshCw,
  Sparkles,
  Clock,
  CheckCircle2,
  UserCheck,
  Tag,
  Calendar,
  Building,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { KorumaliRota } from "@/components/layout/korumali-rota";
import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Secim } from "@/components/ui/select";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { taleplerApi } from "@/lib/api/talepler";
import type { TalepDurumu } from "@/types";

const DURUM_SECENEKLERI: { deger: TalepDurumu | ""; etiket: string }[] = [
  { deger: "", etiket: "Tüm Durumlar" },
  { deger: "bekliyor", etiket: "Bekliyor" },
  { deger: "inceleniyor", etiket: "İnceleniyor" },
  { deger: "atandi", etiket: "Atandı" },
  { deger: "cozuldu", etiket: "Çözüldü" },
  { deger: "kapatildi", etiket: "Kapatıldı" },
];

// Durum Bazlı Kart Sol Renkli Vurgu Çizgileri
const DURUM_VURGU_RENKLERI: Record<TalepDurumu, string> = {
  bekliyor: "bg-amber-500",
  inceleniyor: "bg-blue-500",
  atandi: "bg-purple-500",
  cozuldu: "bg-emerald-500",
  kapatildi: "bg-slate-400",
};

function tarihiBicimlendir(isoTarih: string) {
  return new Date(isoTarih).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function AdminTaleplerIcerik() {
  const [durumFiltresi, setDurumFiltresi] = useState<TalepDurumu | "">("");
  const [arama, setArama] = useState("");

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["admin-talepler", durumFiltresi],
    queryFn: () => taleplerApi.listele({ durum: durumFiltresi || undefined, sayfa_boyutu: 50 }),
  });

  const talepler = data?.veriler || [];

  // İstatistiki Özet Veriler
  const istatistikler = useMemo(() => {
    const toplam = talepler.length;
    const bekleyen = talepler.filter((t) => t.durum === "bekliyor").length;
    const atanan = talepler.filter((t) => t.durum === "atandi" || t.durum === "inceleniyor").length;
    const cozulen = talepler.filter((t) => t.durum === "cozuldu").length;
    return { toplam, bekleyen, atanan, cozulen };
  }, [talepler]);

  // Client-side Arama Filtrelemesi
  const filtrelenmisTalepler = useMemo(() => {
    if (!arama.trim()) return talepler;
    const aramaKucuk = arama.toLowerCase();
    return talepler.filter(
      (t) =>
        t.baslik.toLowerCase().includes(aramaKucuk) ||
        t.takip_no.toLowerCase().includes(aramaKucuk) ||
        t.kategori.ad.toLowerCase().includes(aramaKucuk) ||
        t.mahalle.ad.toLowerCase().includes(aramaKucuk)
    );
  }, [talepler, arama]);

  return (
    <div className="space-y-8 pt-2 pb-12">
      {/* CANLI VE RENKLİ İSTATİSTİK KARTLARI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Kart className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-5 text-white shadow-lg shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">Toplam Başvuru</p>
                <p className="mt-1 text-3xl font-black">{istatistikler.toplam}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <Sparkles size={24} className="text-amber-300" />
              </div>
            </div>
            <div className="mt-3 text-[11px] text-blue-100">Sistemdeki tüm bildirimler</div>
          </Kart>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Kart className="relative overflow-hidden border-none bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 p-5 text-white shadow-lg shadow-amber-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-100">Bekleyen Talepler</p>
                <p className="mt-1 text-3xl font-black">{istatistikler.bekleyen}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <Clock size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-[11px] text-amber-100">İnceleme/Atama bekliyor</div>
          </Kart>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Kart className="relative overflow-hidden border-none bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-500 p-5 text-white shadow-lg shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-100">İşlemde / Atandı</p>
                <p className="mt-1 text-3xl font-black">{istatistikler.atanan}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <UserCheck size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-[11px] text-purple-100">Saha personeli görevlendirildi</div>
          </Kart>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Kart className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 p-5 text-white shadow-lg shadow-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Çözüme Ulaşan</p>
                <p className="mt-1 text-3xl font-black">{istatistikler.cozulen}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <CheckCircle2 size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-[11px] text-emerald-100">Başarıyla tamamlandı</div>
          </Kart>
        </motion.div>
      </div>

      {/* BAŞLIK & REFRESH EYLEMİ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent sm:text-3xl">
            Talep & Şikayet Yönetimi
          </h1>
          <p className="mt-1 text-sm text-metin-ikincil">
            Vatandaşlar tarafından iletilen tüm talepleri süzün, detaylarını inceleyin ve ekiplere yönlendirin.
          </p>
        </div>

        <Dugme
          varyant="anahat"
          boyut="kucuk"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="self-start gap-2 bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 shadow-sm sm:self-auto"
        >
          <RefreshCw size={14} className={isRefetching ? "animate-spin" : ""} />
          <span>Talepleri Yenile</span>
        </Dugme>
      </div>

      {/* ARAMA VE BİLGİ FİLTRE PANELİ */}
      <div className="space-y-3 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/40 via-blue-50/20 to-transparent p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Arama Kutusu */}
          <div className="relative min-w-[240px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
            <Girdi
              placeholder="Takip no, başlık, mahalle veya kategori ara..."
              className="pl-9 bg-white border-indigo-100 focus:border-indigo-400 focus:ring-indigo-200 text-sm"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
            />
          </div>

          {/* Select Filtre */}
          <div className="min-w-[180px]">
            <Secim
              value={durumFiltresi}
              onChange={(e) => setDurumFiltresi(e.target.value as TalepDurumu | "")}
              className="bg-white border-indigo-100 focus:border-indigo-400 text-sm font-medium"
            >
              {DURUM_SECENEKLERI.map((secenek) => (
                <option key={secenek.deger} value={secenek.deger}>
                  {secenek.etiket}
                </option>
              ))}
            </Secim>
          </div>
        </div>

        {/* Hızlı Çip Filtreleri */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs font-bold text-indigo-900/70 mr-1 flex items-center gap-1">
            <Filter size={12} /> Hızlı Süzgeç:
          </span>
          {DURUM_SECENEKLERI.map((secenek) => (
            <button
              key={secenek.deger}
              onClick={() => setDurumFiltresi(secenek.deger)}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
                durumFiltresi === secenek.deger
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-indigo-950 border border-indigo-100 hover:bg-indigo-50"
              }`}
            >
              {secenek.etiket}
            </button>
          ))}
        </div>
      </div>

      {/* TALEPLER LİSTESİ */}
      {isLoading ? (
        <TamSayfaYukleniyor />
      ) : filtrelenmisTalepler.length === 0 ? (
        <Kart className="border border-dashed border-indigo-200 bg-indigo-50/20">
          <KartIcerik className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 mb-3">
              <FileQuestion size={32} />
            </div>
            <p className="text-base font-bold text-metin">Gösterilecek Talep Bulunamadı</p>
            <p className="mt-1 text-xs text-metin-ikincil max-w-sm">
              Seçtiğiniz filtreler veya arama terimleri ile eşleşen kayıt bulunamadı. Filtreleri temizlemeyi deneyebilirsiniz.
            </p>
          </KartIcerik>
        </Kart>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtrelenmisTalepler.map((talep) => (
              <motion.div
                key={talep.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <Link href={`/admin/talepler/${talep.id}`} className="block group">
                  <Kart className="relative overflow-hidden border border-indigo-100/80 bg-white shadow-xs transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
                    {/* Durum Bazlı Sol Vurgu Çizgisi */}
                    <div
                      className={`absolute left-0 top-0 h-full w-1.5 transition-all group-hover:w-2 ${
                        DURUM_VURGU_RENKLERI[talep.durum] || "bg-indigo-500"
                      }`}
                    />

                    <KartIcerik className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 pl-6">
                      {/* Sol Taraf: Takip No, Başlık ve Detaylar */}
                      <div className="space-y-1.5 flex-1 min-w-[260px]">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-black tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            <Tag size={10} /> #{talep.takip_no}
                          </span>
                          <span className="text-[11px] font-medium text-metin-ikincil flex items-center gap-1">
                            <Calendar size={11} className="text-indigo-400" />
                            {tarihiBicimlendir(talep.olusturulma_tarihi)}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-metin text-base group-hover:text-indigo-600 transition-colors">
                          {talep.baslik}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-metin-ikincil font-medium">
                          <span className="flex items-center gap-1 text-indigo-900 font-semibold">
                            <Building size={12} className="text-indigo-500" />
                            {talep.kategori.ad}
                          </span>
                          <span>•</span>
                          <span className="text-metin-ikincil">{talep.mahalle.ad}</span>
                        </div>
                      </div>

                      {/* Sağ Taraf: Rozetler ve Yönlendirme Ok Simgesi */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end gap-1.5">
                          <DurumRozeti durum={talep.durum} />
                          <OncelikRozeti oncelik={talep.oncelik} />
                        </div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </KartIcerik>
                  </Kart>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function AdminTaleplerPage() {
  return (
    <KorumaliRota izinliRoller={["admin"]}>
      <AdminTaleplerIcerik />
    </KorumaliRota>
  );
}