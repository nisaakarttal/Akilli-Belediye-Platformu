"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { kullaniciGuncelle } from "@/lib/api/kullanicilar";
import { apiHataMesaji } from "@/lib/api/client";

// NOT: backend'in KullaniciGuncelleIstegi şeması yalnızca ad, soyad, telefon, adres
// alanlarını kabul ediyor — profil fotoğrafı yükleme için ayrı bir endpoint yok.
const semasi = z.object({
  ad: z.string().min(2, "En az 2 karakter olmalı."),
  soyad: z.string().min(2, "En az 2 karakter olmalı."),
  telefon: z.string().regex(/^0(5\d{2})\d{7}$/, "05XXXXXXXXX formatında olmalı."),
  adres: z.string().optional(),
});

type FormDegerleri = z.infer<typeof semasi>;

export default function ProfilSayfasi() {
  const { kullanici } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDegerleri>({
    resolver: zodResolver(semasi),
    defaultValues: kullanici
      ? { ad: kullanici.ad, soyad: kullanici.soyad, telefon: kullanici.telefon, adres: kullanici.adres ?? "" }
      : undefined,
  });

  if (!kullanici) return null;

  async function gonder(degerler: FormDegerleri) {
    try {
      const guncel = await kullaniciGuncelle(kullanici!.id, degerler);
      queryClient.setQueryData(["ben"], guncel);
      toast.success("Profiliniz güncellendi.");
    } catch (hata) {
      toast.error(apiHataMesaji(hata, "Profil güncellenirken bir sorun oluştu."));
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-xl font-bold text-foreground">Profilim</h1>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            <span className="flex items-center gap-3">
              <Avatar ad={kullanici.ad} soyad={kullanici.soyad} src={kullanici.profil_fotografi} className="h-12 w-12 text-sm" />
              <span>
                <span className="block text-base font-semibold text-foreground">{kullanici.ad} {kullanici.soyad}</span>
                <span className="block text-xs capitalize text-muted-foreground">{kullanici.rol} · {kullanici.e_posta}</span>
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(gonder)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Ad" htmlFor="ad" error={errors.ad?.message}>
                <Input id="ad" {...register("ad")} />
              </FormField>
              <FormField label="Soyad" htmlFor="soyad" error={errors.soyad?.message}>
                <Input id="soyad" {...register("soyad")} />
              </FormField>
            </div>

            <FormField label="Telefon" htmlFor="telefon" error={errors.telefon?.message}>
              <Input id="telefon" {...register("telefon")} />
            </FormField>

            <FormField label="Adres" htmlFor="adres" error={errors.adres?.message}>
              <Input id="adres" {...register("adres")} />
            </FormField>

            <FormField label="E-posta" htmlFor="e_posta">
              <Input id="e_posta" value={kullanici.e_posta} disabled />
            </FormField>
            <p className="text-xs text-muted-foreground">E-posta değişikliği desteklenmiyor.</p>

            <Button type="submit" loading={isSubmitting}>
              <Save className="h-4 w-4" aria-hidden />
              Değişiklikleri Kaydet
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
