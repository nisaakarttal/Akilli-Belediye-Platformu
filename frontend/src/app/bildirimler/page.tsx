"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BellOff, CheckCheck, Sparkles } from "lucide-react";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { BildirimSatiri } from "@/components/bildirimler/bildirim-satiri";
import { Button } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { useBildirimler, type BildirimFiltresi } from "@/hooks/use-bildirimler";
import { cn } from "@/lib/utils";

const FILTRE_SEKMELERI: { deger: BildirimFiltresi; etiket: string }[] = [
  { deger: "tumu", etiket: "Tümü" },
  { deger: "okunmamis", etiket: "Okunmamış" },
  { deger: "okunmus", etiket: "Okunmuş" },
];

function BildirimlerIcerik() {
  const {
    data,
    isLoading,
    filtre,
    setFiltre,
    okunmamisSayisi,
    filtrelenmisBildirimler,
    hepsiniOkunduYap,
    hepsiniOkunduYapMutation,
    okunduYapMutation,
    okunmadiYapMutation,
    bildirimeTikla,
  } = useBildirimler();

  return (
    <div className="flex min-h-screen flex-col justify-between bg-zemin selection:bg-birincil-500 selection:text-white">
      <Basli />

      <main className="relative mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:py-12">
        {/* Dekoratif glow arka plan */}
        <div className="pointer-events-none absolute -top-20 right-0 h-96 w-96 rounded-full bg-birincil-500/10 blur-[120px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -left-20 top-40 h-96 w-96 rounded-full bg-ikincil-500/10 blur-[120px]" aria-hidden="true" />

        {/* Başlık alanı */}
        <div className="relative z-10 mb-8 space-y-6 border-b border-kenarlik pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-birincil-500/20 bg-birincil-600/10 px-3 py-1 text-xs font-black text-birincil-600">
                  <Sparkles size={13} className="animate-pulse text-amber-400" aria-hidden="true" />
                  Aktivite &amp; Bildirim Akışı
                </span>
                {okunmamisSayisi > 0 && (
                  <span className="inline-flex items-center rounded-full border border-uyari/20 bg-uyari/10 px-2.5 py-0.5 text-xs font-extrabold text-amber-600">
                    {okunmamisSayisi} Yeni
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black tracking-tight text-metin sm:text-4xl">Bildirimler</h1>
            </div>

            {data && okunmamisSayisi > 0 && (
              <Button
                varyant="anahat"
                boyut="kucuk"
                onClick={hepsiniOkunduYap}
                disabled={hepsiniOkunduYapMutation.isPending}
                className="gap-2 self-start text-xs font-bold sm:self-auto"
              >
                <CheckCheck size={15} className="text-birincil-500" aria-hidden="true" />
                Tümünü Okundu Yap
              </Button>
            )}
          </div>

          {/* Filtre sekmeleri */}
          <div className="flex items-center gap-1 rounded-xl border border-kenarlik bg-black/5 p-1 dark:bg-white/5">
            {FILTRE_SEKMELERI.map((sekme) => (
              <button
                key={sekme.deger}
                type="button"
                onClick={() => setFiltre(sekme.deger)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-xs font-black transition-all",
                  filtre === sekme.deger ? "bg-zemin text-metin shadow-sm" : "text-metin-ikincil hover:text-metin"
                )}
                aria-pressed={filtre === sekme.deger}
              >
                {sekme.etiket} (
                {sekme.deger === "tumu"
                  ? data?.length || 0
                  : sekme.deger === "okunmamis"
                    ? okunmamisSayisi
                    : (data?.length || 0) - okunmamisSayisi}
                )
              </button>
            ))}
          </div>
        </div>

        {/* Bildirim listesi */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 w-full animate-pulse rounded-2xl border border-kenarlik bg-black/5 p-5 dark:bg-white/5" />
            ))}
          </div>
        ) : filtrelenmisBildirimler.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
            <Kart className="border border-dashed p-12 text-center">
              <KartIcerik className="flex flex-col items-center justify-center p-0">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5 text-metin-ikincil shadow-inner dark:bg-white/5">
                  <BellOff size={28} aria-hidden="true" />
                </div>
                <h3 className="text-base font-black text-metin">Bildirim Bulunamadı</h3>
                <p className="mt-1 max-w-sm text-xs font-medium text-metin-ikincil">
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
              {filtrelenmisBildirimler.map((bildirim) => (
                <motion.div
                  key={bildirim.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <BildirimSatiri
                    bildirim={bildirim}
                    onTikla={() => bildirimeTikla(bildirim)}
                    onOkunduYap={() => okunduYapMutation.mutate(bildirim.id)}
                    onOkunmadiYap={() => okunmadiYapMutation.mutate(bildirim.id)}
                    okunduIsleniyorMu={okunduYapMutation.isPending}
                    okunmadiIsleniyorMu={okunmadiYapMutation.isPending}
                  />
                </motion.div>
              ))}
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
