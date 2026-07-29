export const ZAMAN_FILTRE_SECENEKLERI = [7, 14, 30] as const;
export type ZamanFiltresi = (typeof ZAMAN_FILTRE_SECENEKLERI)[number];

export const VARSAYILAN_ZAMAN_FILTRESI: ZamanFiltresi = 30;

interface VeriPaletiRengi {
  hex: string;
  /** Kategori kırılımı çubuklarında kullanılan Tailwind arka plan sınıfı. */
  barSinifi: string;
}

/**
 * Kategori dağılımı (donut grafik + alt liste) için kullanılan master seviye
 * veri görselleştirme paleti. Marka renklerinden bağımsız olarak çoklu
 * veri setlerinde maksimum görsel ayrışma sağlar.
 */
export const KATEGORI_VERI_PALETI: VeriPaletiRengi[] = [
  { hex: "#6366F1", barSinifi: "bg-indigo-500" },
  { hex: "#0EA5E9", barSinifi: "bg-sky-500" },
  { hex: "#10B981", barSinifi: "bg-emerald-500" },
  { hex: "#F59E0B", barSinifi: "bg-amber-500" },
  { hex: "#EC4899", barSinifi: "bg-pink-500" },
];

export const MAHALLE_CUBUK_RENGI = "#0EA5E9";
export const MAHALLE_CUBUK_HOVER_RENGI = "#0284C7";
export const TREND_CIZGI_RENGI = "#6366F1";

/** Chart.js ve Recharts tooltip/eksen bileşenleri için ortak master tema renkleri. */
export const GRAFIK_TEMA_RENKLERI = {
  tooltipArkaPlan: "#0F172A",
  eksenMetin: "#64748B",
  izgara: "rgba(148, 163, 184, 0.08)",
} as const;

/**
 * Not: "Haftalık Performans" KPI kartındaki ilerleme çubuğu orijinal
 * tasarımda gerçek veriye değil, sabit bir görsel değere dayanıyordu.
 * Davranışı değiştirmemek için aynen korunmuştur; backend'den gerçek bir
 * haftalık hedef yüzdesi sağlanınca bu sabit kaldırılabilir.
 */
export const HAFTALIK_PERFORMANS_SABIT_ILERLEME_YUZDESI = 75;