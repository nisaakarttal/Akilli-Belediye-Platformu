"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Etiket } from "@/components/ui/label";
import { Girdi } from "@/components/ui/input";
import { Uyari } from "@/components/ui/uyari";
import { useKimlik } from "@/hooks/use-kimlik";
import { apiHataMesaji } from "@/lib/api";
import { type GirisFormu, girisSemasi } from "@/lib/validasyon";

export default function GirisSayfasi() {
  const { girisYap } = useKimlik();
  const router = useRouter();
  const [sunucuHatasi, setSunucuHatasi] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GirisFormu>({ resolver: zodResolver(girisSemasi) });

  async function gonder(veri: GirisFormu) {
    setSunucuHatasi(null);
    setGonderiliyor(true);
    try {
      await girisYap(veri);
      router.push("/");
    } catch (hata) {
      setSunucuHatasi(apiHataMesaji(hata, "Giriş yapılamadı. Bilgilerinizi kontrol ediniz."));
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
            <KartBaslik>Giriş Yap</KartBaslik>
            <p className="text-sm text-metin-ikincil">
              Kapaklı Akıllı Belediye Platformu&apos;na hoş geldiniz.
            </p>
          </KartBasligi>
          <KartIcerik>
            <form onSubmit={handleSubmit(gonder)} className="space-y-4">
              {sunucuHatasi && <Uyari tur="hata">{sunucuHatasi}</Uyari>}

              <div>
                <Etiket htmlFor="e_posta">E-posta Adresi</Etiket>
                <Girdi id="e_posta" type="email" placeholder="ornek@kapakli.bel.tr" {...register("e_posta")} />
                {errors.e_posta && <p className="mt-1 text-xs text-tehlike">{errors.e_posta.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Etiket htmlFor="sifre">Şifre</Etiket>
                  <Link href="/sifremi-unuttum" className="text-xs text-birincil-600 hover:underline">
                    Şifremi Unuttum
                  </Link>
                </div>
                <Girdi id="sifre" type="password" placeholder="••••••••" {...register("sifre")} />
                {errors.sifre && <p className="mt-1 text-xs text-tehlike">{errors.sifre.message}</p>}
              </div>

              <Dugme type="submit" varyant="birincil" boyut="buyuk" className="w-full" disabled={gonderiliyor}>
                {gonderiliyor ? "Giriş Yapılıyor..." : "Giriş Yap"}
              </Dugme>
            </form>

            <p className="mt-6 text-center text-sm text-metin-ikincil">
              Hesabınız yok mu?{" "}
              <Link href="/kayit" className="font-medium text-birincil-600 hover:underline">
                Kayıt Olun
              </Link>
            </p>
          </KartIcerik>
        </Kart>
      </motion.div>
    </div>
  );
}
