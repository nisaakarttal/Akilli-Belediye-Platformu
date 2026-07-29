import { KAPAKLI_MERKEZ_KOORDINATLARI } from "@/constants/konum";
import type { HavaDurumuGosterimi, HavaDurumuVerisi } from "@/types/anasayfa";

/** Open-Meteo verisinin ISR ile yeniden doğrulanma sıklığı (saniye). */
const YENIDEN_DOGRULAMA_SANIYESI = 1800; // 30 dakika

interface AcikMeteoYaniti {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

/** Open-Meteo "weather_code" değerini arayüzde gösterilecek Türkçe metne ve ikon anahtarına çevirir. */
export function havaKoduAciklamasi(kod: number): HavaDurumuGosterimi {
  if (kod === 0) return { metin: "Açık", ikonAdi: "acik" };
  if ([1, 2, 3].includes(kod)) return { metin: "Parçalı Bulutlu", ikonAdi: "parcali-bulutlu" };
  if ([45, 48].includes(kod)) return { metin: "Sisli", ikonAdi: "sisli" };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(kod)) return { metin: "Yağmurlu", ikonAdi: "yagmurlu" };
  if ([71, 73, 75].includes(kod)) return { metin: "Karlı", ikonAdi: "karli" };
  if ([95, 96, 99].includes(kod)) return { metin: "Gök Gürültülü Fırtına", ikonAdi: "firtinali" };
  return { metin: "Parçalı Bulutlu", ikonAdi: "parcali-bulutlu" };
}

/**
 * Kapaklı, Tekirdağ için güncel hava durumunu Open-Meteo API'sinden getirir.
 * Ağ hatası veya başarısız yanıt durumunda `null` döner; bileşen bu durumda
 * kullanıcıya nazik bir "veri alınamıyor" mesajı gösterir.
 */
export async function kapakliHavaDurumunuGetir(): Promise<HavaDurumuVerisi | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${KAPAKLI_MERKEZ_KOORDINATLARI.enlem}&longitude=${KAPAKLI_MERKEZ_KOORDINATLARI.boylam}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe%2FIstanbul`;

    const yanit = await fetch(url, { next: { revalidate: YENIDEN_DOGRULAMA_SANIYESI } });
    if (!yanit.ok) return null;

    const veri: AcikMeteoYaniti = await yanit.json();

    return {
      sicaklik: veri.current.temperature_2m,
      nemOrani: veri.current.relative_humidity_2m,
      ruzgarHizi: veri.current.wind_speed_10m,
      havaKodu: veri.current.weather_code,
    };
  } catch {
    return null;
  }
}
