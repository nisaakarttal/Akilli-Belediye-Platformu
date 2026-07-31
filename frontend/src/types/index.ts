/**
 * Backend'deki Pydantic şemalarıyla birebir eşleşen tipler.
 * Kaynak: backend/app/schemas/*.py — alan adları kasıtlı olarak Türkçe ve
 * backend ile aynı tutulmuştur (API'ye hiçbir dönüşüm katmanı olmadan gider).
 */

// ---------- Ortak enum'lar ----------

export type KullaniciRolu = "vatandas" | "personel" | "admin";

export type TalepDurumu =
  | "bekliyor"
  | "inceleniyor"
  | "atandi"
  | "cozuldu"
  | "kapatildi";

export type TalepOnceligi = "dusuk" | "orta" | "yuksek" | "acil";

export type DosyaTuru =
  | "fotograf"
  | "video"
  | "ses"
  | "belge"
  | "sonuc_fotografi";

export type BildirimTuru = string;

// ---------- Kullanıcı ----------

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

export interface KullaniciKayitIstegi {
  ad: string;
  soyad: string;
  e_posta: string;
  telefon: string;
  sifre: string;
  tc_kimlik_no?: string | null;
  adres?: string | null;
}

export interface KullaniciGirisIstegi {
  e_posta: string;
  sifre: string;
}

export interface KullaniciGuncelleIstegi {
  ad?: string;
  soyad?: string;
  telefon?: string;
  adres?: string;
}

export interface TokenYaniti {
  erisim_tokeni: string;
  yenileme_tokeni: string;
  token_turu: string;
  kullanici: Kullanici;
}

// ---------- Kategori / Konum ----------

export interface Kategori {
  id: string;
  ad: string;
  aciklama: string | null;
  ikon: string | null;
  sorumlu_departman: string;
  renk: string;
  sla_saat: number;
  silindi_mi: boolean;
  silinme_tarihi: string | null;
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

// ---------- Talep ----------

export interface TalepOlusturIstegi {
  baslik: string;
  aciklama: string;
  kategori_id: string;
  mahalle_id: string;
  adres_detay?: string | null;
  enlem: number;
  boylam: number;
  oncelik?: TalepOnceligi;
  ai_onerilen_kategori_id?: string | null;
  ai_onerilen_oncelik?: TalepOnceligi | null;
  ai_guven_skoru?: number | null;
}

export interface TalepDosya {
  id: string;
  dosya_turu: DosyaTuru;
  dosya_yolu: string;
  orijinal_ad: string;
  boyut_bayt: number;
  olusturulma_tarihi: string;
}

export interface DurumGecmisi {
  id: string;
  onceki_durum: TalepDurumu | null;
  yeni_durum: TalepDurumu;
  aciklama: string | null;
  olusturulma_tarihi: string;
}

export interface TalepOlusturan {
  id: string;
  ad: string;
  soyad: string;
}

export interface TalepListe {
  id: string;
  takip_no: string;
  baslik: string;
  durum: TalepDurumu;
  oncelik: TalepOnceligi;
  kategori: Kategori;
  mahalle: Mahalle;
  son_cozum_tarihi: string | null;
  gecikti_mi: boolean;
  olusturulma_tarihi: string;
}

export interface TalepDetay {
  id: string;
  takip_no: string;
  baslik: string;
  aciklama: string;
  durum: TalepDurumu;
  oncelik: TalepOnceligi;
  kategori: Kategori;
  mahalle: Mahalle;
  adres_detay: string | null;
  enlem: number;
  boylam: number;
  ai_onerilen_oncelik: TalepOnceligi | null;
  ai_guven_skoru: number | null;
  olusturan: TalepOlusturan;
  cozum_notu: string | null;
  cozulme_tarihi: string | null;
  son_cozum_tarihi: string | null;
  gecikti_mi: boolean;
  olusturulma_tarihi: string;
  guncellenme_tarihi: string;
  dosyalar: TalepDosya[];
  durum_gecmisi: DurumGecmisi[];
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

export interface TalepFiltreleri {
  durum?: TalepDurumu;
  kategori_id?: string;
  mahalle_id?: string;
  oncelik?: TalepOnceligi;
  baslangic_tarihi?: string;
  bitis_tarihi?: string;
  sayfa?: number;
  sayfa_boyutu?: number;
}

export interface Memnuniyet {
  id: string;
  talep_id: string;
  puan: number;
  yorum: string | null;
  olusturulma_tarihi: string;
}

// ---------- Bildirim ----------

export interface Bildirim {
  id: string;
  tur: BildirimTuru;
  baslik: string;
  mesaj: string;
  ilgili_talep_id: string | null;
  okundu_mu: boolean;
  olusturulma_tarihi: string;
}

// ---------- İstatistik (Admin) ----------

export interface GenelIstatistikler {
  toplam_talep: number;
  bugunku_talep: number;
  bu_hafta_talep: number;
  bu_ay_talep: number;
  cozulen_talep: number;
  bekleyen_talep: number;
  tamamlanma_orani: number;
}

export interface KategoriDagilimi {
  kategori_adi: string;
  sayi: number;
}

export interface MahalleDagilimi {
  mahalle_adi: string;
  sayi: number;
}

export interface GunlukTalep {
  tarih: string;
  sayi: number;
}

export interface MahalleAnalizi {
  mahalle_adi: string;
  talep_sayisi: number;
  ortalama_cozum_suresi_saat: number | null;
  en_cok_sikayet_kategorisi: string | null;
}

export interface PersonelPerformansi {
  personel_id: string;
  ad_soyad: string;
  cozulen_talep: number;
  bekleyen_talep: number;
  ortalama_cozum_suresi_saat: number | null;
  tamamlanma_orani: number;
  memnuniyet_ortalamasi: number | null;
  performans_puani: number;
}

export interface MemnuniyetPersonel {
  personel_id: string;
  ad_soyad: string;
  ortalama_puan: number;
  degerlendirme_sayisi: number;
}

export interface MemnuniyetKategori {
  kategori_adi: string;
  ortalama_puan: number;
  degerlendirme_sayisi: number;
}

export interface AktiviteKaydi {
  id: string;
  kullanici_id: string | null;
  eylem: string;
  hedef_tablo: string;
  hedef_id: string | null;
  detay: string | null;
  ip_adresi: string | null;
  olusturulma_tarihi: string;
}

// ---------- Sayfalanmış liste zarfı (backend paginasyon döndürüyorsa) ----------

export interface SayfalanmisYanit<T> {
  veriler: T[];
  toplam: number;
  sayfa: number;
  sayfa_boyutu: number;
}

// ---------- API hata gövdesi (FastAPI varsayılanı) ----------

export interface ApiHata {
  detail: string | { msg: string; loc: (string | number)[] }[];
}
