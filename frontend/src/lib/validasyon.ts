import { z } from "zod";

const TELEFON_DESENI = /^0(5\d{2})\d{7}$/;

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

export const talepOlusturSemasi = z.object({
  baslik: z.string().min(5, "Başlık en az 5 karakter olmalıdır.").max(200),
  aciklama: z.string().min(10, "Açıklama en az 10 karakter olmalıdır."),
  kategori_id: z.string().min(1, "Lütfen bir kategori seçiniz."),
  mahalle_id: z.string().min(1, "Lütfen bir mahalle seçiniz."),
  adres_detay: z.string().max(500).optional().or(z.literal("")),
  oncelik: z.enum(["dusuk", "orta", "yuksek", "acil"]),
});
export type TalepOlusturFormu = z.infer<typeof talepOlusturSemasi>;
