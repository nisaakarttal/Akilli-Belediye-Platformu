"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";

import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { apiHataMesaji } from "@/lib/api";
import { authApi } from "@/lib/api/auth";
import { type SifreSifirlaFormu, sifreSifirlaSemasi } from "@/lib/validasyon";

function SifreSifirlaFormu_() {
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
      setTimeout(() => router.push("/giris"), 2000);
    } catch (hata) {
      setSunucuHatasi(apiHataMesaji(hata, "Şifre sıfırlanamadı. Bağlantının süresi dolmuş olabilir."));
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Kart>
          <KartBasligi className="text-center">
            <KartBaslik>Yeni Şifre Belirle</KartBaslik>
            <p className="text-sm text-metin-ikincil">Hesabınız için yeni bir şifre oluşturun.</p>
          </KartBasligi>
          <KartIcerik>
            {!token && <Uyari tur="hata">Sıfırlama bağlantısı geçersiz. Lütfen e-postanızdaki bağlantıyı kullanın.</Uyari>}

            {basariMesaji ? (
              <Uyari tur="basari">{basariMesaji} Giriş sayfasına yönlendiriliyorsunuz...</Uyari>
            ) : (
              token && (
                <form onSubmit={handleSubmit(gonder)} className="space-y-4">
                  {sunucuHatasi && <Uyari tur="hata">{sunucuHatasi}</Uyari>}

                  <div>
                    <Etiket htmlFor="yeniSifre">Yeni Şifre</Etiket>
                    <Girdi id="yeniSifre" type="password" placeholder="••••••••" {...register("yeniSifre")} />
                    {errors.yeniSifre && <p className="mt-1 text-xs text-tehlike">{errors.yeniSifre.message}</p>}
                  </div>

                  <div>
                    <Etiket htmlFor="yeniSifreTekrar">Yeni Şifre Tekrar</Etiket>
                    <Girdi id="yeniSifreTekrar" type="password" placeholder="••••••••" {...register("yeniSifreTekrar")} />
                    {errors.yeniSifreTekrar && (
                      <p className="mt-1 text-xs text-tehlike">{errors.yeniSifreTekrar.message}</p>
                    )}
                  </div>

                  <Dugme type="submit" varyant="birincil" boyut="buyuk" className="w-full" disabled={gonderiliyor}>
                    {gonderiliyor ? "Kaydediliyor..." : "Şifreyi Güncelle"}
                  </Dugme>
                </form>
              )
            )}

            <p className="mt-6 text-center text-sm text-metin-ikincil">
              <Link href="/giris" className="font-medium text-birincil-600 hover:underline">
                Giriş sayfasına dön
              </Link>
            </p>
          </KartIcerik>
        </Kart>
      </motion.div>
    </div>
  );
}

export default function SifreSifirlaSayfasi() {
  return (
    <Suspense fallback={<TamSayfaYukleniyor />}>
      <SifreSifirlaFormu_ />
    </Suspense>
  );
}
