import { cn } from "@/lib/utils";
import type { TalepDurumu } from "@/types";

const DURUM_BILGISI: Record<TalepDurumu, { etiket: string; sinif: string }> = {
  bekliyor: { etiket: "Bekliyor", sinif: "bg-slate-500/15 text-slate-700 dark:text-slate-300" },
  inceleniyor: { etiket: "İnceleniyor", sinif: "bg-uyari/15 text-amber-700 dark:text-amber-300" },
  atandi: { etiket: "Atandı", sinif: "bg-ikincil-500/15 text-sky-700 dark:text-sky-300" },
  cozuldu: { etiket: "Çözüldü", sinif: "bg-basarili/15 text-green-700 dark:text-green-300" },
  kapatildi: { etiket: "Kapatıldı", sinif: "bg-black/10 text-metin-ikincil dark:bg-white/10" },
};

export function DurumRozeti({ durum, className }: { durum: TalepDurumu; className?: string }) {
  const bilgi = DURUM_BILGISI[durum];
  return (
    <span className={cn("inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium", bilgi.sinif, className)}>
      {bilgi.etiket}
    </span>
  );
}
