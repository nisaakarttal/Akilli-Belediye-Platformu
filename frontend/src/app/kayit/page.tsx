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
import { type KayitFormu, kayitSemasi } from "@/lib/validasyon";

export default function KayitSayfasi() {
  const { kayitOl } = useKimlik();
  const router = useRouter();
  const [sunucuHatasi, setSunucuHatasi] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KayitFormu>({ resolver: zodResolver(kayitSemasi) });

  async function gonder(veri: KayitFormu) {
    setSunucuHatasi(null);
    setGonderiliyor(true);
    try {
      await kayitOl({
        ad: veri.ad,
        soyad: veri.soyad,
        e_posta: veri.e_posta,
        telefon: veri.telefon,
        sifre: veri.sifre,
      });
      router.push("/");
    } catch (hata) {
      setSunucuHatasi(apiHataMesaji(hata, "Kayıt oluşturulamadı. Lütfen bilgilerinizi kontrol ediniz."));
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
        className="w-full max-w-lg"
      >
        <Kart>
          <KartBasligi className="text-center">
            <KartBaslik>Kayıt Ol</KartBaslik>
            <p className="text-sm text-metin-ikincil">
              Hesap oluşturarak şikâyet ve taleplerinizi dijital ortamda takip edin.
            </p>
          </KartBasligi>
          <KartIcerik>
            <form onSubmit={handleSubmit(gonder)} className="space-y-4">
              {sunucuHatasi && <Uyari tur="hata">{sunucuHatasi}</Uyari>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Etiket htmlFor="ad">Ad</Etiket>
                  <Girdi id="ad" placeholder="Ahmet" {...register("ad")} />
                  {errors.ad && <p className="mt-1 text-xs text-tehlike">{errors.ad.message}</p>}
                </div>
                <div>
                  <Etiket htmlFor="soyad">Soyad</Etiket>
                  <Girdi id="soyad" placeholder="Yılmaz" {...register("soyad")} />
                  {errors.soyad && <p className="mt-1 text-xs text-tehlike">{errors.soyad.message}</p>}
                </div>
              </div>

              <div>
                <Etiket htmlFor="e_posta">E-posta Adresi</Etiket>
                <Girdi id="e_posta" type="email" placeholder="ornek@kapakli.bel.tr" {...register("e_posta")} />
                {errors.e_posta && <p className="mt-1 text-xs text-tehlike">{errors.e_posta.message}</p>}
              </div>

              <div>
                <Etiket htmlFor="telefon">Telefon</Etiket>
                <Girdi id="telefon" placeholder="05551234567" {...register("telefon")} />
                {errors.telefon && <p className="mt-1 text-xs text-tehlike">{errors.telefon.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Etiket htmlFor="sifre">Şifre</Etiket>
                  <Girdi id="sifre" type="password" placeholder="••••••••" {...register("sifre")} />
                  {errors.sifre && <p className="mt-1 text-xs text-tehlike">{errors.sifre.message}</p>}
                </div>
                <div>
                  <Etiket htmlFor="sifreTekrar">Şifre Tekrar</Etiket>
                  <Girdi id="sifreTekrar" type="password" placeholder="••••••••" {...register("sifreTekrar")} />
                  {errors.sifreTekrar && (
                    <p className="mt-1 text-xs text-tehlike">{errors.sifreTekrar.message}</p>
                  )}
                </div>
              </div>

              <Dugme type="submit" varyant="birincil" boyut="buyuk" className="w-full" disabled={gonderiliyor}>
                {gonderiliyor ? "Kayıt Oluşturuluyor..." : "Kayıt Ol"}
              </Dugme>
            </form>

            <p className="mt-6 text-center text-sm text-metin-ikincil">
              Zaten hesabınız var mı?{" "}
              <Link href="/giris" className="font-medium text-birincil-600 hover:underline">
                Giriş Yapın
              </Link>
            </p>
          </KartIcerik>
        </Kart>
      </motion.div>
    </div>
  );
}
