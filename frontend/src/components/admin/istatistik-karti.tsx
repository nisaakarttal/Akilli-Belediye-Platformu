import type { LucideIcon } from "lucide-react";

import { Kart, KartIcerik } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function IstatistikKarti({
  ikon: Ikon,
  etiket,
  deger,
  vurgu,
}: {
  ikon: LucideIcon;
  etiket: string;
  deger: string | number;
  vurgu?: "birincil" | "basarili" | "uyari" | "tehlike";
}) {
  const renkSinifi = {
    birincil: "bg-birincil-600/10 text-birincil-600",
    basarili: "bg-basarili/10 text-green-600",
    uyari: "bg-uyari/10 text-amber-600",
    tehlike: "bg-tehlike/10 text-red-600",
  }[vurgu ?? "birincil"];

  return (
    <Kart>
      <KartIcerik className="flex items-center gap-3 pt-6">
        <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", renkSinifi)}>
          <Ikon size={20} />
        </span>
        <div>
          <p className="text-2xl font-bold text-metin">{deger}</p>
          <p className="text-xs text-metin-ikincil">{etiket}</p>
        </div>
      </KartIcerik>
    </Kart>
  );
}
