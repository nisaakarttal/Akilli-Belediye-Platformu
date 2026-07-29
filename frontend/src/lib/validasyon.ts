import { z } from "zod";

export const TELEFON_DESENI = /^0(5\d{2})\d{7}$/;

export const girisSemasi = z.object({
  e_posta: z.string().min(1, "E-posta adresi zorunludur.").email("Geçerli bir e-posta adresi giriniz."),
  sifre: z.string().min(1, "Şifre zorunludur."),
});
export type GirisFormu = z.infer<typeof girisSemasi>;

export const kayitSemasi = z
  .object({
    ad: z.string().min(2, "Ad en az 2 karakter olmalıdır.").max(100),
    soyad: z.string().min(2, "Soyad en az 2 karakter olmalıdır.").max(100),
    e_posta: z.string().min(1, "E-posta adresi zorunludur.").email("Geçerli bir e-posta adresi giriniz."),
    telefon: z
      .string()
      .regex(TELEFON_DESENI, "Telefon numarası 05XXXXXXXXX formatında olmalıdır."),
    sifre: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır.")
      .regex(/[A-Za-z]/, "Şifre en az bir harf içermelidir.")
      .regex(/\d/, "Şifre en az bir rakam içermelidir."),
    sifreTekrar: z.string().min(1, "Şifre tekrarı zorunludur."),
  })
  .refine((veri) => veri.sifre === veri.sifreTekrar, {
    message: "Şifreler eşleşmiyor.",
    path: ["sifreTekrar"],
  });
export type KayitFormu = z.infer<typeof kayitSemasi>;

export const sifremiUnuttumSemasi = z.object({
  e_posta: z.string().min(1, "E-posta adresi zorunludur.").email("Geçerli bir e-posta adresi giriniz."),
});
export type SifremiUnuttumFormu = z.infer<typeof sifremiUnuttumSemasi>;

export const sifreSifirlaSemasi = z
  .object({
    yeniSifre: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalıdır.")
      .regex(/[A-Za-z]/, "Şifre en az bir harf içermelidir.")
      .regex(/\d/, "Şifre en az bir rakam içermelidir."),
    yeniSifreTekrar: z.string().min(1, "Şifre tekrarı zorunludur."),
  })
  .refine((veri) => veri.yeniSifre === veri.yeniSifreTekrar, {
    message: "Şifreler eşleşmiyor.",
    path: ["yeniSifreTekrar"],
  });
export type SifreSifirlaFormu = z.infer<typeof sifreSifirlaSemasi>;

/**
 * Talep oluşturma formunun minimum/maksimum uzunluk kuralları.
 * `sikayet-olustur` sayfası, yapay zekâ analiz butonunu etkinleştirmeden önce
 * aynı eşikleri kontrol eder — tek kaynaktan yönetilerek iki dosya arasında
 * değer tekrarı (magic number) önlenir.
 */
export const TALEP_BASLIK_MIN_UZUNLUK = 5;
export const TALEP_BASLIK_MAKS_UZUNLUK = 200;
export const TALEP_ACIKLAMA_MIN_UZUNLUK = 10;
export const TALEP_ADRES_DETAY_MAKS_UZUNLUK = 500;

export const talepOlusturSemasi = z.object({
  baslik: z
    .string()
    .min(TALEP_BASLIK_MIN_UZUNLUK, `Başlık en az ${TALEP_BASLIK_MIN_UZUNLUK} karakter olmalıdır.`)
    .max(TALEP_BASLIK_MAKS_UZUNLUK),
  aciklama: z
    .string()
    .min(TALEP_ACIKLAMA_MIN_UZUNLUK, `Açıklama en az ${TALEP_ACIKLAMA_MIN_UZUNLUK} karakter olmalıdır.`),
  kategori_id: z.string().min(1, "Lütfen bir kategori seçiniz."),
  mahalle_id: z.string().min(1, "Lütfen bir mahalle seçiniz."),
  adres_detay: z.string().max(TALEP_ADRES_DETAY_MAKS_UZUNLUK).optional().or(z.literal("")),
  oncelik: z.enum(["dusuk", "orta", "yuksek", "acil"]),
});
export type TalepOlusturFormu = z.infer<typeof talepOlusturSemasi>;

export const profilSemasi = z.object({
  ad: z.string().min(2, "Ad en az 2 karakter olmalıdır.").max(100),
  soyad: z.string().min(2, "Soyad en az 2 karakter olmalıdır.").max(100),
  telefon: z.string().regex(TELEFON_DESENI, "Telefon numarası 05XXXXXXXXX formatında olmalıdır."),
  adres: z.string().max(500).optional().or(z.literal("")),
});
export type ProfilFormu = z.infer<typeof profilSemasi>;
