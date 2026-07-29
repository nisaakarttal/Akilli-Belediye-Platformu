import type { LucideIcon } from "lucide-react";

import { VURGU_ROZET_SINIFLARI, type VurguRengi } from "@/constants/vurgu";
import { cn } from "@/lib/utils";

interface DetayBilgiKartiProps {
  ikon: LucideIcon;
  etiket: string;
  deger: string;
  vurgu: VurguRengi;
  className?: string;
}

/** Talep detay sayfasındaki özet kutularının master seviye sunumu. */
export function DetayBilgiKarti({ ikon: Ikon, etiket, deger, vurgu, className }: DetayBilgiKartiProps) {
  return (
    <div
      className={cn(
        "group flex items-center gap-3.5 rounded-2xl border border-kenarlik/70 bg-zemin/60 backdrop-blur-md p-4 transition-all duration-300 hover:border-birincil-500/40 hover:shadow-md hover:shadow-black/[0.02]",
        className
      )}
    >
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105", VURGU_ROZET_SINIFLARI[vurgu])}>
        <Ikon size={20} aria-hidden="true" />
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-metin-ikincil">{etiket}</p>
        <p className="text-sm font-bold tracking-tight text-metin">{deger}</p>
      </div>
    </div>
  );
}