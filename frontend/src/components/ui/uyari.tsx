import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type UyariTuru = "hata" | "basari" | "bilgi";

const SIMGE_HARITASI: Record<UyariTuru, typeof Info> = {
  hata: AlertTriangle,
  basari: CheckCircle2,
  bilgi: Info,
};

const RENK_HARITASI: Record<UyariTuru, string> = {
  hata: "border-tehlike/30 bg-tehlike/10 text-red-700 dark:text-red-300",
  basari: "border-basarili/30 bg-basarili/10 text-green-700 dark:text-green-300",
  bilgi: "border-birincil-500/30 bg-birincil-500/10 text-birincil-700 dark:text-birincil-300",
};

export function Uyari({ tur = "bilgi", children }: { tur?: UyariTuru; children: ReactNode }) {
  const Simge = SIMGE_HARITASI[tur];
  return (
    <div className={cn("flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm", RENK_HARITASI[tur])}>
      <Simge size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
