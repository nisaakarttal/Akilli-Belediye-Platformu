const YEREL_AYAR = "tr-TR";

/**
 * ISO tarih dizesini "18 Temmuz 2026" biçiminde gösterir.
 * Önceden `taleplerim/page.tsx` içinde yerel bir fonksiyon olarak tanımlıydı.
 */
export function tarihFormatla(isoTarih: string): string {
  return new Date(isoTarih).toLocaleDateString(YEREL_AYAR, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * ISO tarih dizesini "18 Temmuz 2026 14:30" biçiminde gösterir.
 * Önceden `taleplerim/[id]/page.tsx` ve `zaman-tuneli.tsx` içinde birebir
 * aynı şekilde tekrarlanan fonksiyondu.
 */
export function tarihSaatFormatla(isoTarih: string): string {
  return new Date(isoTarih).toLocaleString(YEREL_AYAR, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * ISO tarih dizesini "18 Temmuz 14:30" biçiminde (yıl olmadan) gösterir.
 * Önceden `bildirimler/page.tsx` içinde yerel bir fonksiyon olarak tanımlıydı.
 */
export function tarihSaatKisaFormatla(isoTarih: string): string {
  return new Date(isoTarih).toLocaleString(YEREL_AYAR, {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * ISO tarih dizesini "18 Tem" biçiminde gösterir (grafik ekseni etiketleri için).
 * Önceden `admin/page.tsx` içinde yerel bir fonksiyon olarak tanımlıydı.
 */
export function tarihKisaFormatla(isoTarih: string): string {
  return new Date(isoTarih).toLocaleDateString(YEREL_AYAR, { day: "numeric", month: "short" });
}
