"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";

import { KimlikKarti } from "@/components/layout/kimlik-karti";
import { Button } from "@/components/ui/button";
import { FormAlani } from "@/components/ui/form-alani";
import { SifreGirdisi } from "@/components/ui/sifre-girdisi";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { apiHataMesaji } from "@/lib/api";
import { authApi } from "@/lib/api/auth";
import { type SifreSifirlaFormu, sifreSifirlaSemasi } from "@/lib/validasyon";

/** Başarılı sıfırlamadan sonra giriş sayfasına yönlendirilene kadar geçen süre (ms). */
const YONLENDIRME_GECIKMESI_MS = 2000;

function SifreSifirlaIcerik() {
  const router = useRouter();
  const aramaParametreleri = useSearchParams();
  const token = aramaParametreleri.get("token");

  const [sunucuHatasi, setSunucuHatasi] = useState<string | null>(null);
  const [basariMesaji, setBasariMesaji] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SifreSifirlaFormu>({ resolver: zodResolver(sifreSifirlaSemasi) });

  async function gonder(veri: SifreSifirlaFormu) {
    if (!token) {
      setSunucuHatasi("Sıfırlama bağlantısı geçersiz. Lütfen yeniden talep edin.");
      return;
    }
    setSunucuHatasi(null);
    setGonderiliyor(true);
    try {
      const yanit = await authApi.sifreSifirla(token, veri.yeniSifre);
      setBasariMesaji(yanit.mesaj);
      setTimeout(() => router.push("/giris"), YONLENDIRME_GECIKMESI_MS);
    } catch (hata) {
      setSunucuHatasi(apiHataMesaji(hata, "Şifre sıfırlanamadı. Bağlantının süresi dolmuş olabilir."));
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <KimlikKarti
      ikon={KeyRound}
      baslik="Yeni Şifre Belirle"
      aciklama="Hesabınız için yeni bir şifre oluşturun."
      altBilgi={
        <Link href="/giris" className="font-semibold text-birincil-600 hover:underline">
          Giriş sayfasına dön
        </Link>
      }
    >
      {!token && (
        <Uyari tur="hata">Sıfırlama bağlantısı geçersiz. Lütfen e-postanızdaki bağlantıyı kullanın.</Uyari>
      )}

      {basariMesaji ? (
        <Uyari tur="basari">{basariMesaji} Giriş sayfasına yönlendiriliyorsunuz...</Uyari>
      ) : (
        token && (
          <form onSubmit={handleSubmit(gonder)} className="space-y-4">
            <AnimatePresence initial={false}>
              {sunucuHatasi && (
                <motion.div
                  key="sunucu-hatasi"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Uyari tur="hata">{sunucuHatasi}</Uyari>
                </motion.div>
              )}
            </AnimatePresence>

            <FormAlani id="yeniSifre" etiket="Yeni Şifre" hata={errors.yeniSifre?.message}>
              <SifreGirdisi
                id="yeniSifre"
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.yeniSifre}
                {...register("yeniSifre")}
              />
            </FormAlani>

            <FormAlani id="yeniSifreTekrar" etiket="Yeni Şifre Tekrar" hata={errors.yeniSifreTekrar?.message}>
              <SifreGirdisi
                id="yeniSifreTekrar"
                autoComplete="new-password"
                placeholder="••••••••"
                aria-invalid={!!errors.yeniSifreTekrar}
                {...register("yeniSifreTekrar")}
              />
            </FormAlani>

            <Button type="submit" varyant="birincil" boyut="buyuk" className="w-full gap-2" disabled={gonderiliyor}>
              {gonderiliyor && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
              {gonderiliyor ? "Kaydediliyor..." : "Şifreyi Güncelle"}
            </Button>
          </form>
        )
      )}
    </KimlikKarti>
  );
}

export default function SifreSifirlaSayfasi() {
  return (
    <Suspense fallback={<TamSayfaYukleniyor />}>
      <SifreSifirlaIcerik />
    </Suspense>
  );
}
