import { AlertTriangle, CheckCircle2, Info, Sparkles, type LucideIcon } from "lucide-react";

import type { VurguRengi } from "@/constants/vurgu";

export interface BildirimTipi {
  etiket: string;
  vurgu: VurguRengi;
  ikon: LucideIcon;
}

/**
 * Bildirim başlığındaki anahtar kelimelere göre görsel kategori belirler.
 * Backend bildirim "tipini" ayrı bir alan olarak döndürmediği için mevcut
 * (orijinal) başlık-tabanlı sezgisel sınıflandırma korunmuştur — yalnızca
 * çıktısı hardcoded renkler yerine marka token'larına bağlanmıştır.
 */
export function bildirimTipiGetir(baslik: string): BildirimTipi {
  const metin = baslik.toLowerCase();

  if (metin.includes("atandı") || metin.includes("görev")) {
    return { etiket: "Atama", vurgu: "birincil", ikon: Sparkles };
  }
  if (metin.includes("tamamlandı") || metin.includes("çözüldü") || metin.includes("onay")) {
    return { etiket: "Çözüldü", vurgu: "basarili", ikon: CheckCircle2 };
  }
  if (metin.includes("iptal") || metin.includes("hata") || metin.includes("acil")) {
    return { etiket: "Önemli", vurgu: "tehlike", ikon: AlertTriangle };
  }
  return { etiket: "Güncelleme", vurgu: "ikincil", ikon: Info };
}
