import type { LucideIcon } from "lucide-react";

import { Kart, KartIcerik } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type VurguRengi = "birincil" | "basarili" | "uyari" | "tehlike";

const VURGU_SINIFLARI: Record<VurguRengi, string> = {
  birincil: "bg-birincil-600/10 text-birincil-600",
  basarili: "bg-basarili/10 text-green-600",
  uyari: "bg-uyari/10 text-amber-600",
  tehlike: "bg-tehlike/10 text-red-600",
};

const IKON_KUTU_BOYUTU = "h-11 w-11";
const IKON_BOYUTU = 20;

interface IstatistikKartiProps {
  ikon: LucideIcon;
  etiket: string;
  deger: string | number;
  vurgu?: VurguRengi;
}

export function IstatistikKarti({ ikon: Ikon, etiket, deger, vurgu = "birincil" }: IstatistikKartiProps) {
  return (
    <Kart className="transition-shadow duration-200 hover:shadow-md">
      <KartIcerik className="flex items-center gap-3 pt-6">
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-xl",
            IKON_KUTU_BOYUTU,
            VURGU_SINIFLARI[vurgu]
          )}
          aria-hidden="true"
        >
          <Ikon size={IKON_BOYUTU} />
        </span>
        <div>
          <p className="text-2xl font-bold text-metin">{deger}</p>
          <p className="text-xs text-metin-ikincil">{etiket}</p>
        </div>
      </KartIcerik>
    </Kart>
  );
}
