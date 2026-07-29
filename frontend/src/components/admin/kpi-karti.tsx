"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { VURGU_ROZET_SINIFLARI, type VurguRengi } from "@/constants/vurgu";
import { cn } from "@/lib/utils";

const ILERLEME_ARKA_SINIFLARI: Record<VurguRengi, string> = {
  birincil: "bg-birincil-500",
  ikincil: "bg-ikincil-500",
  basarili: "bg-basarili",
  uyari: "bg-uyari",
  tehlike: "bg-tehlike",
};

const HOVER_KENAR_SINIFLARI: Record<VurguRengi, string> = {
  birincil: "hover:border-birincil-500/50",
  ikincil: "hover:border-ikincil-500/50",
  basarili: "hover:border-basarili/50",
  uyari: "hover:border-uyari/50",
  tehlike: "hover:border-tehlike/50",
};

const VURGU_METIN_SINIFLARI: Record<VurguRengi, string> = {
  birincil: "text-birincil-500",
  ikincil: "text-sky-500",
  basarili: "text-green-500",
  uyari: "text-amber-500",
  tehlike: "text-red-500",
};

interface KpiKartiProps {
  ikon: LucideIcon;
  etiket: string;
  deger: string | number;
  /** Değerin sağındaki kısa bağlam etiketi (ör. "Sistem Geneli"). */
  vurguEtiketi: string;
  vurgu: VurguRengi;
  /** 0-100 arası ilerleme çubuğu değeri. */
  ilerlemeYuzdesi: number;
  /** Belirsiz/canlı veri hissi vermek için ilerleme çubuğunu nabız gibi attırır. */
  nabizAnimasyonu?: boolean;
}

/** Admin "Genel Bakış" sayfasındaki 4 KPI kartının ortak, yeniden kullanılabilir sunumu. */
export function KpiKarti({ ikon: Ikon, etiket, deger, vurguEtiketi, vurgu, ilerlemeYuzdesi, nabizAnimasyonu }: KpiKartiProps) {
  const yuzde = Math.min(100, Math.max(0, ilerlemeYuzdesi));

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-kenarlik bg-zemin p-6 shadow-sm transition-all hover:shadow-xl",
        HOVER_KENAR_SINIFLARI[vurgu]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-metin-ikincil">{etiket}</span>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-2xl transition-transform group-hover:scale-110",
            VURGU_ROZET_SINIFLARI[vurgu]
          )}
        >
          <Ikon size={20} aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-3xl font-black text-metin">{deger}</h3>
        <span className={cn("text-xs font-bold", VURGU_METIN_SINIFLARI[vurgu])}>{vurguEtiketi}</span>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
        <div
          className={cn("h-full rounded-full", ILERLEME_ARKA_SINIFLARI[vurgu], nabizAnimasyonu && "animate-pulse")}
          style={{ width: `${yuzde}%` }}
        />
      </div>
    </motion.div>
  );
}
