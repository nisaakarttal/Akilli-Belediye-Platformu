import type { TalepDurumu, TalepOnceligi } from "@/types";

export const DURUM_ETIKETLERI: Record<TalepDurumu, string> = {
  bekliyor: "Bekliyor",
  inceleniyor: "İnceleniyor",
  atandi: "Atandı",
  cozuldu: "Çözüldü",
  kapatildi: "Kapatıldı",
};

export const DURUM_RENKLERI: Record<TalepDurumu, { bg: string; text: string; dot: string }> = {
  bekliyor: { bg: "bg-warning-bg", text: "text-warning", dot: "bg-warning" },
  inceleniyor: { bg: "bg-info-bg", text: "text-info", dot: "bg-info" },
  atandi: { bg: "bg-primary-50", text: "text-primary-700", dot: "bg-primary-700" },
  cozuldu: { bg: "bg-success-bg", text: "text-success", dot: "bg-success" },
  kapatildi: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
};

export const ONCELIK_ETIKETLERI: Record<TalepOnceligi, string> = {
  dusuk: "Düşük",
  orta: "Orta",
  yuksek: "Yüksek",
  acil: "Acil",
};

export const ONCELIK_RENKLERI: Record<TalepOnceligi, { bg: string; text: string }> = {
  dusuk: { bg: "bg-muted", text: "text-muted-foreground" },
  orta: { bg: "bg-info-bg", text: "text-info" },
  yuksek: { bg: "bg-warning-bg", text: "text-warning" },
  acil: { bg: "bg-danger-bg", text: "text-danger" },
};
