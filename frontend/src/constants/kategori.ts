import type { KategoriIstegi } from "@/lib/api/kategoriler";

export const VARSAYILAN_KATEGORI_RENGI = "#6366F1";

export const BOS_KATEGORI_FORMU: KategoriIstegi = {
  ad: "",
  aciklama: "",
  ikon: "",
  sorumlu_departman: "",
  renk: VARSAYILAN_KATEGORI_RENGI,
};

/**
 * Kategori kimlik rengi için hazır seçim paleti. Marka token'larından
 * bilinçli olarak bağımsızdır — her kategori kendi ayırt edici rengini
 * taşıyabilmelidir (uygulamanın 5 renkli marka sistemiyle sınırlanamaz).
 */
export const HAZIR_KATEGORI_RENKLERI = [
  "#6366F1", // Indigo
  "#38BDF8", // Sky Blue
  "#EF4444", // Rose Red
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#64748B", // Slate
];
