// Backend `app/models` ve `app/schemas` ile birebir uyumlu tip tanımları.

export type KullaniciRolu = "vatandas" | "personel" | "admin";

export interface Kullanici {
  id: string;
  ad: string;
  soyad: string;
  e_posta: string;
  telefon: string;
  rol: KullaniciRolu;
  profil_fotografi: string | null;
  adres: string | null;
  departman: string | null;
  aktif_mi: boolean;
  olusturulma_tarihi: string;
}

export interface TokenYaniti {
  erisim_tokeni: string;
  yenileme_tokeni: string;
  token_turu: string;
  kullanici: Kullanici;
}

export interface Kategori {
  id: string;
  ad: string;
  aciklama: string | null;
  ikon: string | null;
  sorumlu_departman: string;
  renk: string;
}

export interface Ilce {
  id: string;
  ad: string;
  il: string;
  merkez_enlem: number;
  merkez_boylam: number;
}

export interface Mahalle {
  id: string;
  ad: string;
  ilce_id: string;
  merkez_enlem: number;
  merkez_boylam: number;
}

export type TalepDurumu = "bekliyor" | "inceleniyor" | "atandi" | "cozuldu" | "kapatildi";
export type TalepOnceligi = "dusuk" | "orta" | "yuksek" | "acil";
export type DosyaTuru = "fotograf" | "video" | "ses" | "belge" | "sonuc_fotografi";

export interface TalepDosyasi {
  id: string;
  dosya_turu: DosyaTuru;
  dosya_yolu: string;
  orijinal_ad: string;
  boyut_bayt: number;
  olusturulma_tarihi: string;
}

export interface DurumGecmisiKaydi {
  id: string;
  onceki_durum: TalepDurumu | null;
  yeni_durum: TalepDurumu;
  aciklama: string | null;
  olusturulma_tarihi: string;
}

export interface TalepListe {
  id: string;
  takip_no: string;
  baslik: string;
  durum: TalepDurumu;
  oncelik: TalepOnceligi;
  kategori: Kategori;
  mahalle: Mahalle;
  olusturulma_tarihi: string;

  atanan_personel_id: string | null;
}

export interface TalepDetay extends Omit<TalepListe, never> {
  aciklama: string;
  adres_detay: string | null;
  enlem: number;
  boylam: number;
  ai_onerilen_oncelik: TalepOnceligi | null;
  ai_guven_skoru: number | null;
  olusturan: { id: string; ad: string; soyad: string };
  cozum_notu: string | null;
  cozulme_tarihi: string | null;
  guncellenme_tarihi: string;
  dosyalar: TalepDosyasi[];
  durum_gecmisi: DurumGecmisiKaydi[];
}

export interface TalepHaritaNoktasi {
  id: string;
  takip_no: string;
  baslik: string;
  enlem: number;
  boylam: number;
  durum: TalepDurumu;
  oncelik: TalepOnceligi;
  kategori_adi: string;
}

export type BildirimTuru =
  | "yeni_talep"
  | "durum_degisti"
  | "talep_atandi"
  | "talep_cozuldu"
  | "sistem";

export interface Bildirim {
  id: string;
  tur: BildirimTuru;
  baslik: string;
  mesaj: string;
  ilgili_talep_id: string | null;
  okundu_mu: boolean;
  olusturulma_tarihi: string;
}

export interface SayfalanmisYanit<T> {
  toplam: number;
  sayfa: number;
  sayfa_boyutu: number;
  veriler: T[];
}

export interface AnalizYaniti {
  onerilen_kategori_id: string | null;
  onerilen_kategori_adi: string | null;
  onerilen_oncelik: TalepOnceligi;
  guven_skoru: number;
  eksik_bilgiler: string[];
  ai_mesaji: string;
}

export interface ApiHata {
  detail: string;
}
