import type { LucideIcon } from "lucide-react";

import { Kart, KartIcerik } from "@/components/ui/card";
import { VURGU_ROZET_SINIFLARI, type VurguRengi } from "@/constants/vurgu";
import { cn } from "@/lib/utils";

export function IstatistikKarti({
  ikon: Ikon,
  etiket,
  deger,
  vurgu,
  aciklama,
}: {
  ikon: LucideIcon;
  etiket: string;
  deger: string | number;
  vurgu?: VurguRengi;
  aciklama?: string;
}) {
  return (
    <Kart className="group border-kenarlik/80 bg-zemin/80 backdrop-blur-xl shadow-xl shadow-black/[0.02] transition-all duration-300 hover:border-birincil-500/40 hover:-translate-y-0.5">
      <KartIcerik className="flex items-center gap-4 py-5">
        <span
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105",
            VURGU_ROZET_SINIFLARI[vurgu ?? "birincil"]
          )}
        >
          <Ikon size={22} aria-hidden="true" />
        </span>
        <div className="space-y-0.5">
          <p className="text-2xl font-extrabold tracking-tight text-metin">{deger}</p>
          <p className="text-xs font-semibold text-metin-ikincil">{etiket}</p>
          {aciklama && <p className="text-[11px] font-medium text-metin-ikincil/70">{aciklama}</p>}
        </div>
      </KartIcerik>
    </Kart>
  );
}