/**
 * Ana sayfa (src/app/page.tsx) bölümlerinde kullanılan içerik tiplerinin
 * merkezi ve tip güvenli tanım dosyası. Bileşenler bu tipleri import ederek
 * statik veri (bkz. `@/constants/anasayfa`) ile arayüz sözleşmesini tek noktadan korur.
 */

export interface HaberOgesi {
  id?: string;
  baslik: string;
  ozet: string;
  tarih: string;
  kategori: string;
  gorselUrl?: string;
}

export interface DuyuruOgesi {
  id?: string;
  baslik: string;
  aciklama: string;
  tarih: string;
  onemli?: boolean;
}

export interface EtkinlikOgesi {
  id?: string;
  baslik: string;
  tarih: string;
  saat?: string;
  yer: string;
  aciklama: string;
  gorselUrl?: string;
}

export interface AcilNumaraOgesi {
  ad: string;
  numara: string;
  kategori?: string;
}

export interface NobetciEczaneOgesi {
  ad: string;
  mahalle: string;
  adres: string;
  telefon: string;
  konumUrl?: string;
  tarih?: string;
}

/** Open-Meteo API'sinden normalize edilerek dönen güncel hava durumu verisi. */
export interface HavaDurumuVerisi {
  sicaklik: number;
  nemOrani: number;
  ruzgarHizi: number;
  havaKodu: number;
  guncellenmeZamani?: string;
}

/** `havaKoduAciklamasi` fonksiyonunun döndürdüğü, ikon seçimi için kullanılan anahtar. */
export type HavaIkonAdi =
  | "acik"
  | "parcali-bulutlu"
  | "sisli"
  | "yagmurlu"
  | "karli"
  | "firtinali";

export interface HavaDurumuGosterimi {
  metin: string;
  ikonAdi: HavaIkonAdi;
}