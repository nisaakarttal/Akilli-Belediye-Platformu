import type { TalepDurumu } from "@/types";

/**
 * Talep durumuna göre "vurgu şeridi" rengi. `DurumRozeti` bileşeniyle aynı
 * semantiği paylaşır (bekliyor→nötr, inceleniyor→uyarı, atandı→ikincil,
 * çözüldü→başarılı, kapatıldı→nötr-koyu). Önceden admin talep listesinde
 * bundan tamamen bağımsız, çelişen bir renk seti (`DURUM_VURGU_RENKLERI`)
 * tanımlıydı — aynı durum, rozette ve şeritte farklı renklerle gösteriliyordu.
 */
export const DURUM_VURGU_SINIFLARI: Record<TalepDurumu, string> = {
  bekliyor: "bg-slate-400",
  inceleniyor: "bg-uyari",
  atandi: "bg-ikincil-500",
  cozuldu: "bg-basarili",
  kapatildi: "bg-black/20 dark:bg-white/20",
};
