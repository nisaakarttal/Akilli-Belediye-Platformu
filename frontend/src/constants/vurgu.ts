/**
 * Uygulama genelinde "vurgu rengi" (accent) gerektiren rozet/ikon/istatistik
 * kartlarının kullandığı ortak renk sınıfı eşlemesi. Önceden yalnızca
 * `istatistik-karti.tsx` içinde yerel olarak tanımlıydı; artık admin panelinin
 * KPI kartları da aynı eşlemeyi kullanarak tüm uygulamada tutarlı bir vurgu
 * renk sistemi sağlanmış oluyor.
 */
export type VurguRengi = "birincil" | "ikincil" | "basarili" | "uyari" | "tehlike";

/** İkon rozeti gibi "hafif dolgu + koyu metin" gerektiren yerler için. */
export const VURGU_ROZET_SINIFLARI: Record<VurguRengi, string> = {
  birincil: "bg-birincil-600/10 text-birincil-600",
  ikincil: "bg-ikincil-500/10 text-sky-600",
  basarili: "bg-basarili/10 text-green-600",
  uyari: "bg-uyari/10 text-amber-600",
  tehlike: "bg-tehlike/10 text-red-600",
};

/** Avatar/vurgu şeridi gibi "düz dolgu + beyaz metin" gerektiren yerler için. */
export const VURGU_SOLID_SINIFLARI: Record<VurguRengi, string> = {
  birincil: "bg-birincil-600 text-white",
  ikincil: "bg-ikincil-500 text-white",
  basarili: "bg-basarili text-white",
  uyari: "bg-uyari text-white",
  tehlike: "bg-tehlike text-white",
};
