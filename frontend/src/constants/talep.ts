import type { TalepDurumu } from "@/types";

/**
 * Durum filtresi `<select>` ve hızlı filtre çiplerinde kullanılan seçenek
 * listesi. Önceden hem `taleplerim/page.tsx` (vatandaş) hem de
 * `admin/talepler/page.tsx` içinde birebir aynı şekilde tekrarlanıyordu.
 */
export const DURUM_SECENEKLERI: { deger: TalepDurumu | ""; etiket: string }[] = [
  { deger: "", etiket: "Tüm Durumlar" },
  { deger: "bekliyor", etiket: "Bekliyor" },
  { deger: "inceleniyor", etiket: "İnceleniyor" },
  { deger: "atandi", etiket: "Atandı" },
  { deger: "cozuldu", etiket: "Çözüldü" },
  { deger: "kapatildi", etiket: "Kapatıldı" },
];

/**
 * Bir talebin durumunu güncellemek için kullanılan seçenek listesi (filtre
 * seçeneklerinden farklı olarak "Tüm Durumlar" boş seçeneğini içermez).
 * Önceden `personel/[id]/page.tsx` içinde yerel olarak tanımlıydı.
 */
export const DURUM_GUNCELLEME_SECENEKLERI: { deger: TalepDurumu; etiket: string }[] = DURUM_SECENEKLERI.filter(
  (secenek): secenek is { deger: TalepDurumu; etiket: string } => secenek.deger !== ""
);
