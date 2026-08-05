"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import { useAuth } from "@/providers/auth-provider";
import { apiHataMesaji } from "@/lib/api/client";

const semasi = z.object({
  e_posta: z.string().email("Geçerli bir e-posta adresi girin."),
  sifre: z.string().min(1, "Şifrenizi girin."),
});

type FormDegerleri = z.infer<typeof semasi>;

export default function GirisSayfasi() {
  const router = useRouter();
  const { girisYap } = useAuth();
  const [sifreGoster, setSifreGoster] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormDegerleri>({ resolver: zodResolver(semasi) });

  async function gonder(degerler: FormDegerleri) {
    try {
      const kullanici = await girisYap(degerler);
      toast.success(`Hoş geldiniz, ${kullanici.ad}!`);
      router.push(kullanici.rol === "admin" ? "/admin" : kullanici.rol === "personel" ? "/personel" : "/panel");
    } catch (hata) {
      toast.error(apiHataMesaji(hata, "E-posta veya şifre hatalı."));
    }
  }

  return (
    <Card>
      <CardContent className="p-7">
        <h1 className="font-display text-2xl font-bold text-foreground">Hoş Geldiniz!</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Hesabınıza giriş yaparak işlemlerinize devam edebilirsiniz.
        </p>

        <form onSubmit={handleSubmit(gonder)} className="mt-6 space-y-4" noValidate>
          <FormField label="E-posta" htmlFor="e_posta" error={errors.e_posta?.message}>
            <Input id="e_posta" type="email" placeholder="ornek@mail.com" autoComplete="email" {...register("e_posta")} />
          </FormField>

          <FormField label="Şifre" htmlFor="sifre" error={errors.sifre?.message}>
            <div className="relative">
              <Input
                id="sifre"
                type={sifreGoster ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="pr-10"
                {...register("sifre")}
              />
              <button
                type="button"
                onClick={() => setSifreGoster((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={sifreGoster ? "Şifreyi gizle" : "Şifreyi göster"}
              >
                {sifreGoster ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border-border text-primary-700 focus-visible:ring-primary-500/40" />
              Beni Hatırla
            </label>
            <Link href="/sifremi-unuttum" className="font-medium text-primary-700 hover:underline">
              Şifremi Unuttum
            </Link>
          </div>

          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            <LogIn className="h-4 w-4" aria-hidden />
            Giriş Yap
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Hesabınız yok mu?{" "}
          <Link href="/kayit" className="font-medium text-primary-700 hover:underline">
            Kayıt Olun
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
