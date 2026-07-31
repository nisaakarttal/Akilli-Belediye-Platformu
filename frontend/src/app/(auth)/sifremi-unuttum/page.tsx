"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import { sifremiUnuttum } from "@/lib/api/auth";
import { apiHataMesaji } from "@/lib/api/client";

const semasi = z.object({ e_posta: z.string().email("Geçerli bir e-posta adresi girin.") });
type FormDegerleri = z.infer<typeof semasi>;

export default function SifremiUnuttumSayfasi() {
  const [gonderildi, setGonderildi] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDegerleri>({ resolver: zodResolver(semasi) });

  async function gonder(degerler: FormDegerleri) {
    try {
      await sifremiUnuttum(degerler.e_posta);
      setGonderildi(true);
    } catch (hata) {
      toast.error(apiHataMesaji(hata));
    }
  }

  return (
    <Card>
      <CardContent className="p-7">
        <Link href="/giris" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Girişe dön
        </Link>

        {gonderildi ? (
          <div className="animate-fade-up">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success-bg text-success">
              <Mail className="h-5 w-5" aria-hidden />
            </span>
            <h1 className="mt-4 font-display text-xl font-bold text-foreground">E-postanızı kontrol edin</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Hesabınıza ait bir e-posta varsa, şifre sıfırlama bağlantısı gönderildi.
            </p>
          </div>
        ) : (
          <>
            <h1 className="font-display text-xl font-bold text-foreground">Şifremi Unuttum</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Hesabınızla ilişkili e-posta adresini girin, sıfırlama bağlantısı gönderelim.
            </p>
            <form onSubmit={handleSubmit(gonder)} className="mt-6 space-y-4" noValidate>
              <FormField label="E-posta" htmlFor="e_posta" error={errors.e_posta?.message}>
                <Input id="e_posta" type="email" placeholder="ornek@mail.com" {...register("e_posta")} />
              </FormField>
              <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                Sıfırlama Bağlantısı Gönder
              </Button>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
