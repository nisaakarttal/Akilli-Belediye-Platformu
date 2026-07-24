"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { useKimlik } from "@/hooks/use-kimlik";
import { bildirimlerApi } from "@/lib/api/bildirimler";

function tarihiBicimlendir(isoTarih: string) {
  return new Date(isoTarih).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function bildirimTipiGetir(baslik: string) {
  const metin = baslik.toLowerCase();
  if (metin.includes("atandı") || metin.includes("görev")) {
    return {
      etiket: "Atama",
      renk: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
      ikon: Sparkles,
    };
  }
  if (metin.includes("tamamlandı") || metin.includes("çözüldü") || metin.includes("onay")) {
    return {
      etiket: "Çözüldü",
      renk: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      ikon: CheckCircle2,
    };
  }
  if (metin.includes("iptal") || metin.includes("hata") || metin.includes("acil")) {
    return {
      etiket: "Önemli",
      renk: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      ikon: AlertTriangle,
    };
  }
  return {
    etiket: "Güncelleme",
    renk: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    ikon: Info,
  };
}

function BildirimlerIcerik() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { kullanici } = useKimlik();

  const [filtre, setFiltre] = useState<"tumu" | "okunmamis" | "okunmus">("tumu");

  const { data, isLoading } = useQuery({
    queryKey: ["bildirimler"],
    queryFn: () => bildirimlerApi.listele(),
  });

  const sorgulariYenile = () => {
    queryClient.invalidateQueries({ queryKey: ["bildirimler"] });
    queryClient.invalidateQueries({ queryKey: ["okunmamis-bildirimler"] });
  };

  const hepsiniOkunduYapMutation = useMutation({
    mutationFn: () => bildirimlerApi.tumunuOkunduYap(),
    onSuccess: () => sorgulariYenile(),
  });

  const okunduYapMutation = useMutation({
    mutationFn: (id: string) => bildirimlerApi.okunduYap(id),
    onSuccess: () => sorgulariYenile(),
  });

  const okunmadiYapMutation = useMutation({
    mutationFn: (id: string) => bildirimlerApi.okunmadiYap(id),
    onSuccess: () => sorgulariYenile(),
  });

  async function hepsiniOkunduYap() {
    hepsiniOkunduYapMutation.mutate();
  }

  // Role göre bildirim tıklama yönlendirmesi
  const handleBildirimTikla = (bildirim: any) => {
    if (!bildirim.okundu_mu) {
      okunduYapMutation.mutate(bildirim.id);
    }

    const rol = (kullanici?.rol || "").toString().toLowerCase();

    if (rol.includes("admin")) {
      router.push("/admin/talepler");
    } else if (rol.includes("personel")) {
      router.push("/personel/atanan-talepler");
    } else {
      router.push("/taleplerim");
    }
  };

  const okunmamisSayisi = useMemo(() => {
    return data ? data.filter((b) => !b.okundu_mu).length : 0;
  }, [data]);

  const filtrelenmisBildirimler = useMemo(() => {
    if (!data) return [];
    if (filtre === "okunmamis") return data.filter((b) => !b.okundu_mu);
    if (filtre === "okunmus") return data.filter((b) => b.okundu_mu);
    return data;
  }, [data, filtre]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/50 dark:bg-slate-950 font-sans selection:bg-indigo-500 selection:text-white">
      <Basli />

      <main className="relative mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12 flex-1">
        {/* Glow Arkaplan Süslemeleri */}
        <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/15" />
        <div className="pointer-events-none absolute top-40 -left-20 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-500/10" />

        {/* BAŞLIK ALANI */}
        <div className="relative z-10 mb-8 space-y-6 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-black text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <Sparkles size={13} className="text-amber-400 animate-pulse" />
                  Aktivite & Bildirim Akışı
                </span>
                {okunmamisSayisi > 0 && (
                  <span className="inline-flex items-center rounded-full bg-amber-500/10 dark:bg-amber-500/20 px-2.5 py-0.5 text-xs font-extrabold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    {okunmamisSayisi} Yeni
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Bildirimler
              </h1>
            </div>

            {data && okunmamisSayisi > 0 && (
              <Dugme
                varyant="anahat"
                boyut="kucuk"
                onClick={hepsiniOkunduYap}
                disabled={hepsiniOkunduYapMutation.isPending}
                className="gap-2 self-start sm:self-auto rounded-xl border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xs hover:shadow-md transition-all active:scale-95 text-xs font-bold"
              >
                <CheckCheck size={15} className="text-indigo-500" />
                Tümünü Okundu Yap
              </Dugme>
            )}
          </div>

          {/* Filtre Sekmeleri */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 rounded-xl bg-slate-200/50 dark:bg-slate-900/80 p-1 border border-slate-200/60 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setFiltre("tumu")}
                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all ${
                  filtre === "tumu"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Tümü ({data?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setFiltre("okunmamis")}
                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all ${
                  filtre === "okunmamis"
                    ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Okunmamış ({okunmamisSayisi})
              </button>
              <button
                type="button"
                onClick={() => setFiltre("okunmus")}
                className={`px-3.5 py-1.5 text-xs font-black rounded-lg transition-all ${
                  filtre === "okunmus"
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Okunmuş ({(data?.length || 0) - okunmamisSayisi})
              </button>
            </div>
          </div>
        </div>

        {/* BİLDİRİM LİSTESİ */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 w-full animate-pulse rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-5"
              />
            ))}
          </div>
        ) : filtrelenmisBildirimler.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Kart className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-12 text-center">
              <KartIcerik className="flex flex-col items-center justify-center p-0">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 mb-4 shadow-inner">
                  <BellOff size={28} />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Bildirim Bulunamadı
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-400 max-w-sm">
                  {filtre === "okunmamis"
                    ? "Harika! Okunmamış tüm bildirimlerinizi tamamladınız."
                    : "Seçili filtreye uygun hiçbir bildirim kaydı bulunmuyor."}
                </p>
              </KartIcerik>
            </Kart>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtrelenmisBildirimler.map((bildirim) => {
                const okunmadi = !bildirim.okundu_mu;
                const tip = bildirimTipiGetir(bildirim.baslik);
                const TipIkonu = tip.ikon;

                return (
                  <motion.div
                    key={bildirim.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Kart
                      onClick={() => handleBildirimTikla(bildirim)}
                      className={`group relative overflow-hidden cursor-pointer rounded-2xl border transition-all duration-200 active:scale-[0.995] ${
                        okunmadi
                          ? "border-indigo-500/40 dark:border-indigo-500/30 bg-white dark:bg-slate-900 shadow-md shadow-indigo-500/5 hover:border-indigo-500 hover:shadow-xl"
                          : "border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/50 opacity-80 hover:opacity-100 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      {okunmadi && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-indigo-400 to-purple-500" />
                      )}

                      <KartIcerik className="flex items-start justify-between gap-4 p-5">
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${
                              okunmadi
                                ? "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            }`}
                          >
                            <Bell size={18} />
                          </div>

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black rounded-md border uppercase tracking-wider ${tip.renk}`}
                              >
                                <TipIkonu size={11} />
                                {tip.etiket}
                              </span>

                              <p
                                className={`text-sm tracking-tight truncate ${
                                  okunmadi
                                    ? "font-black text-slate-900 dark:text-white"
                                    : "font-bold text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {bildirim.baslik}
                              </p>

                              {okunmadi && (
                                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse ml-auto sm:ml-0" />
                              )}
                            </div>

                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed break-words">
                              {bildirim.mesaj}
                            </p>

                            <div className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-slate-400">
                              <Clock size={12} />
                              <span>{tarihiBicimlendir(bildirim.olusturulma_tarihi)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Aksiyon Butonları */}
                        <div className="flex items-center gap-2 shrink-0 self-center">
                          {okunmadi ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                okunduYapMutation.mutate(bildirim.id);
                              }}
                              disabled={okunduYapMutation.isPending}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-extrabold transition-all border border-indigo-200 dark:border-indigo-800/50 shadow-2xs active:scale-95"
                              title="Okundu İşaretle"
                            >
                              <Check size={13} />
                              <span className="hidden sm:inline">Okundu</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                okunmadiYapMutation.mutate(bildirim.id);
                              }}
                              disabled={okunmadiYapMutation.isPending}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/30 text-xs font-extrabold transition-all border border-slate-200/80 dark:border-slate-700/60 shadow-2xs active:scale-95 opacity-0 group-hover:opacity-100 sm:opacity-100"
                              title="Okunmadı Olarak İşaretle"
                            >
                              <RotateCcw size={13} />
                              <span className="hidden sm:inline">Okunmadı Yap</span>
                            </button>
                          )}

                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBildirimTikla(bildirim);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 transition-all cursor-pointer"
                            title="Atanan Taleplere Git"
                          >
                            <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </KartIcerik>
                    </Kart>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Altbilgi />
    </div>
  );
}

export default function BildirimlerSayfasi() {
  return (
    <KorumaliRota>
      <BildirimlerIcerik />
    </KorumaliRota>
  );
}