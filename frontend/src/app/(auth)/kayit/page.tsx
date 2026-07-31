"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import { kayitOl } from "@/lib/api/auth";
import { apiHataMesaji } from "@/lib/api/client";

// Backend doğrulama kurallarıyla birebir aynı (bkz. backend/app/schemas/kullanici.py)
const semasi = z
  .object({
    ad: z.string().min(2, "En az 2 karakter olmalı."),
    soyad: z.string().min(2, "En az 2 karakter olmalı."),
    e_posta: z.string().email("Geçerli bir e-posta adresi girin."),
    telefon: z.string().regex(/^0(5\d{2})\d{7}$/, "05XXXXXXXXX formatında olmalı."),
    tc_kimlik_no: z
      .string()
      .regex(/^\d{11}$/, "T.C. Kimlik No 11 haneli olmalı.")
      .optional()
      .or(z.literal("")),
    adres: z.string().optional(),
    sifre: z
      .string()
      .min(8, "En az 8 karakter olmalı.")
      .regex(/[A-Za-z]/, "En az bir harf içermeli.")
      .regex(/\d/, "En az bir rakam içermeli."),
    sifreTekrar: z.string(),
    kosullariKabulEt: z.literal(true, {
      errorMap: () => ({ message: "Devam etmek için kullanım koşullarını kabul edin." }),
    }),
  })
  .refine((v) => v.sifre === v.sifreTekrar, {
    message: "Şifreler eşleşmiyor.",
    path: ["sifreTekrar"],
  });

type FormDegerleri = z.infer<typeof semasi>;

export default function KayitSayfasi() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDegerleri>({ resolver: zodResolver(semasi) });

  async function gonder(degerler: FormDegerleri) {
    try {
      await kayitOl({
        ad: degerler.ad,
        soyad: degerler.soyad,
        e_posta: degerler.e_posta,
        telefon: degerler.telefon,
        sifre: degerler.sifre,
        tc_kimlik_no: degerler.tc_kimlik_no || undefined,
        adres: degerler.adres || undefined,
      });
      toast.success("Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.");
      router.push("/giris");
    } catch (hata) {
      toast.error(apiHataMesaji(hata, "Kayıt sırasında bir sorun oluştu."));
    }
  }

  return (
    <Card>
      <CardContent className="p-7">
        <h1 className="font-display text-2xl font-bold text-foreground">Hesap Oluştur</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Belediye hizmetlerinden faydalanmak için hesap oluşturun.
        </p>

        <form onSubmit={handleSubmit(gonder)} className="mt-6 space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ad" htmlFor="ad" error={errors.ad?.message}>
              <Input id="ad" autoComplete="given-name" {...register("ad")} />
            </FormField>
            <FormField label="Soyad" htmlFor="soyad" error={errors.soyad?.message}>
              <Input id="soyad" autoComplete="family-name" {...register("soyad")} />
            </FormField>
          </div>

          <FormField label="E-posta" htmlFor="e_posta" error={errors.e_posta?.message}>
            <Input id="e_posta" type="email" placeholder="ornek@mail.com" autoComplete="email" {...register("e_posta")} />
          </FormField>

          <FormField label="Telefon" htmlFor="telefon" error={errors.telefon?.message}>
            <Input id="telefon" placeholder="05XXXXXXXXX" autoComplete="tel" {...register("telefon")} />
          </FormField>

          <FormField label="T.C. Kimlik No (isteğe bağlı)" htmlFor="tc_kimlik_no" error={errors.tc_kimlik_no?.message}>
            <Input id="tc_kimlik_no" placeholder="12345678901" maxLength={11} {...register("tc_kimlik_no")} />
          </FormField>

          <FormField label="Şifre" htmlFor="sifre" error={errors.sifre?.message}>
            <Input id="sifre" type="password" autoComplete="new-password" {...register("sifre")} />
          </FormField>

          <FormField label="Şifreyi Onayla" htmlFor="sifreTekrar" error={errors.sifreTekrar?.message}>
            <Input id="sifreTekrar" type="password" autoComplete="new-password" {...register("sifreTekrar")} />
          </FormField>

          <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded border-border text-primary-700 focus-visible:ring-primary-500/40"
              {...register("kosullariKabulEt")}
            />
            <span>
              <Link href="/kullanim-kosullari" className="text-primary-700 hover:underline">
                Kullanım koşullarını
              </Link>{" "}
              ve{" "}
              <Link href="/gizlilik" className="text-primary-700 hover:underline">
                gizlilik politikasını
              </Link>{" "}
              kabul ediyorum.
            </span>
          </label>
          {errors.kosullariKabulEt && <p className="text-xs text-danger">{errors.kosullariKabulEt.message}</p>}

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            <UserPlus className="h-4 w-4" aria-hidden />
            Kayıt Ol
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="font-medium text-primary-700 hover:underline">
            Giriş Yapın
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
