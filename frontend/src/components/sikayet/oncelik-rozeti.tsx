import { cn } from "@/lib/utils";
import type { TalepOnceligi } from "@/types";

const ONCELIK_BILGISI: Record<TalepOnceligi, { etiket: string; sinif: string }> = {
  dusuk: { etiket: "Düşük Öncelik", sinif: "bg-black/10 text-metin-ikincil dark:bg-white/10" },
  orta: { etiket: "Orta Öncelik", sinif: "bg-ikincil-500/15 text-sky-700 dark:text-sky-300" },
  yuksek: { etiket: "Yüksek Öncelik", sinif: "bg-uyari/15 text-amber-700 dark:text-amber-300" },
  acil: { etiket: "Acil", sinif: "bg-tehlike/15 text-red-700 dark:text-red-300" },
};

export function OncelikRozeti({ oncelik, className }: { oncelik: TalepOnceligi; className?: string }) {
  const bilgi = ONCELIK_BILGISI[oncelik];
  return (
    <span className={cn("inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium", bilgi.sinif, className)}>
      {bilgi.etiket}
    </span>
  );
}
