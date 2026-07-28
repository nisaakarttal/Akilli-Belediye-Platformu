"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronRight,
  Clock,
  Info,
  RotateCcw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { useKimlik } from "@/hooks/use-kimlik";
import { bildirimlerApi } from "@/lib/api/bildirimler";
import type { Bildirim } from "@/types";

type BildirimFiltresi = "tumu" | "okunmamis" | "okunmus";

interface BildirimTipi {
  etiket: string;
  renk: string;
  ikon: LucideIcon;
}

const YUKLENIYOR_ISKELET_SAYISI = 4;
const YUKLENIYOR_ISKELET_ANAHTARLARI = Array.from({ length: YUKLENIYOR_ISKELET_SAYISI }, (_, i) => i);

function tarihiBicimlendir(isoTarih: string) {
  return new Date(isoTarih).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function bildirimTipiGetir(baslik: string): BildirimTipi {
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

  const [filtre, setFiltre] = useState<BildirimFiltresi>("tumu");

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

  function hepsiniOkunduYap() {
    hepsiniOkunduYapMutation.mutate();
  }

  /** Bildirime tıklandığında rolüne göre ilgili talep listesine yönlendirir. */
  function bildirimeGit(bildirim: Bildirim) {
    if (!bildirim.okundu_mu) {
      okunduYapMutation.mutate(bildirim.id);
    }

    const rol = (kullanici?.rol ?? "").toString().toLowerCase();

    if (rol.includes("admin")) {
      router.push("/admin/talepler");
    } else if (rol.includes("personel")) {
      router.push("/personel/atanan-talepler");
    } else {
      router.push("/taleplerim");
    }
  }

  const okunmamisSayisi = useMemo(() => (data ? data.filter((b) => !b.okundu_mu).length : 0), [data]);

  const filtrelenmisBildirimler = useMemo(() => {
    if (!data) return [];
    if (filtre === "okunmamis") return data.filter((b) => !b.okundu_mu);
    if (filtre === "okunmus") return data.filter((b) => b.okundu_mu);
    return data;
  }, [data, filtre]);

  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50/50 font-sans selection:bg-indigo-500 selection:text-white dark:bg-slate-950">
      <Basli />

      <main className="relative mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
        <div
          className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/15"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-20 top-40 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-500/10"
          aria-hidden="true"
        />

        <div className="relative z-10 mb-8 space-y-6 border-b border-slate-200/80 pb-6 dark:border-slate-800/80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-black text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                  <Sparkles size={13} className="animate-pulse text-amber-400" aria-hidden="true" />
                  Aktivite &amp; Bildirim Akışı
                </span>
                {okunmamisSayisi > 0 && (
                  <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-extrabold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
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
                yukleniyorMu={hepsiniOkunduYapMutation.isPending}
                className="self-start rounded-xl border-slate-200/80 bg-white/80 text-xs font-bold shadow-sm backdrop-blur-md transition-all hover:shadow-md active:scale-95 sm:self-auto dark:border-slate-800 dark:bg-slate-900/80"
              >
                <CheckCheck size={15} className="text-indigo-500" aria-hidden="true" />
                Tümünü Okundu Yap
              </Dugme>
            )}
          </div>

          <div
            role="tablist"
            aria-label="Bildirim filtresi"
            className="flex items-center gap-1 rounded-xl border border-slate-200/60 bg-slate-200/50 p-1 dark:border-slate-800 dark:bg-slate-900/80"
          >
            {(
              [
                { deger: "tumu", etiket: `Tümü (${data?.length ?? 0})` },
                { deger: "okunmamis", etiket: `Okunmamış (${okunmamisSayisi})` },
                { deger: "okunmus", etiket: `Okunmuş (${(data?.length ?? 0) - okunmamisSayisi})` },
              ] as const
            ).map((sekme) => (
              <button
                key={sekme.deger}
                type="button"
                role="tab"
                aria-selected={filtre === sekme.deger}
                onClick={() => setFiltre(sekme.deger)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-black transition-all ${
                  filtre === sekme.deger
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                {sekme.etiket}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3" role="status" aria-label="Bildirimler yükleniyor">
            {YUKLENIYOR_ISKELET_ANAHTARLARI.map((i) => (
              <div
                key={i}
                className="h-24 w-full animate-pulse rounded-2xl border border-slate-200/60 bg-white/40 p-5 dark:border-slate-800 dark:bg-slate-900/40"
              />
            ))}
          </div>
        ) : filtrelenmisBildirimler.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
            <Kart className="rounded-3xl border border-dashed border-slate-200 bg-white/60 p-12 text-center backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60">
              <KartIcerik className="flex flex-col items-center justify-center p-0">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 shadow-inner dark:bg-slate-800/80">
                  <BellOff size={28} />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Bildirim Bulunamadı</h3>
                <p className="mt-1 max-w-sm text-xs font-medium text-slate-400">
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
                      className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${
                        okunmadi
                          ? "border-indigo-500/40 bg-white shadow-md shadow-indigo-500/5 hover:border-indigo-500 hover:shadow-xl dark:border-indigo-500/30 dark:bg-slate-900"
                          : "border-slate-200/80 bg-white/60 opacity-80 hover:border-slate-300 hover:bg-white hover:opacity-100 dark:border-slate-800/80 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                      }`}
                    >
                      {okunmadi && (
                        <div
                          className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-indigo-500 via-indigo-400 to-purple-500"
                          aria-hidden="true"
                        />
                      )}

                      <KartIcerik className="p-0">
                        <button
                          type="button"
                          onClick={() => bildirimeGit(bildirim)}
                          className="flex w-full items-start justify-between gap-4 p-5 text-left active:scale-[0.995]"
                        >
                          <div className="flex min-w-0 flex-1 items-start gap-3.5">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-105 ${
                                okunmadi
                                  ? "border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
                                  : "bg-slate-100 text-slate-400 dark:bg-slate-800"
                              }`}
                              aria-hidden="true"
                            >
                              <Bell size={18} />
                            </div>

                            <div className="min-w-0 flex-1 space-y-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${tip.renk}`}
                                >
                                  <TipIkonu size={11} aria-hidden="true" />
                                  {tip.etiket}
                                </span>

                                <p
                                  className={`truncate text-sm tracking-tight ${
                                    okunmadi
                                      ? "font-black text-slate-900 dark:text-white"
                                      : "font-bold text-slate-700 dark:text-slate-300"
                                  }`}
                                >
                                  {bildirim.baslik}
                                </p>

                                {okunmadi && (
                                  <span
                                    className="ml-auto h-2 w-2 animate-pulse rounded-full bg-indigo-500 sm:ml-0"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>

                              <p className="break-words text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                {bildirim.mesaj}
                              </p>

                              <div className="flex items-center gap-1.5 pt-1 text-[11px] font-bold text-slate-400">
                                <Clock size={12} aria-hidden="true" />
                                <span>{tarihiBicimlendir(bildirim.olusturulma_tarihi)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-2 self-center">
                            {okunmadi ? (
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  okunduYapMutation.mutate(bildirim.id);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    okunduYapMutation.mutate(bildirim.id);
                                  }
                                }}
                                aria-disabled={okunduYapMutation.isPending}
                                className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-extrabold text-indigo-600 shadow-sm transition-all active:scale-95 hover:bg-indigo-100 dark:border-indigo-800/50 dark:bg-indigo-950/50 dark:text-indigo-400 dark:hover:bg-indigo-900/50"
                                title="Okundu İşaretle"
                              >
                                <Check size={13} aria-hidden="true" />
                                <span className="hidden sm:inline">Okundu</span>
                              </span>
                            ) : (
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  okunmadiYapMutation.mutate(bildirim.id);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    okunmadiYapMutation.mutate(bildirim.id);
                                  }
                                }}
                                aria-disabled={okunmadiYapMutation.isPending}
                                className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-100 px-2.5 py-1.5 text-xs font-extrabold text-slate-600 shadow-sm transition-all active:scale-95 hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-600 sm:opacity-100 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:text-amber-400"
                                title="Okunmadı Olarak İşaretle"
                              >
                                <RotateCcw size={13} aria-hidden="true" />
                                <span className="hidden sm:inline">Okunmadı Yap</span>
                              </span>
                            )}

                            <span className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-300 transition-all group-hover:bg-indigo-50 group-hover:text-indigo-500 dark:text-slate-600 dark:group-hover:bg-indigo-950/30">
                              <ChevronRight
                                size={18}
                                className="transition-transform group-hover:translate-x-0.5"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </button>
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
