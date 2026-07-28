"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Uyari } from "@/components/ui/uyari";
import { apiHataMesaji } from "@/lib/api";
import { authApi } from "@/lib/api/auth";
import { type SifremiUnuttumFormu, sifremiUnuttumSemasi } from "@/lib/validasyon";

export default function SifremiUnuttumSayfasi() {
  const [sunucuHatasi, setSunucuHatasi] = useState<string | null>(null);
  const [basariMesaji, setBasariMesaji] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SifremiUnuttumFormu>({ resolver: zodResolver(sifremiUnuttumSemasi) });

  async function gonder(veri: SifremiUnuttumFormu) {
    setSunucuHatasi(null);
    setGonderiliyor(true);
    try {
      const yanit = await authApi.sifremiUnuttum(veri.e_posta);
      setBasariMesaji(yanit.mesaj);
    } catch (hata) {
      setSunucuHatasi(apiHataMesaji(hata));
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
            <KartBaslik>Şifremi Unuttum</KartBaslik>
            <p className="text-sm text-metin-ikincil">
              Kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
            </p>
          </KartBasligi>
          <KartIcerik>
            {basariMesaji ? (
              <Uyari tur="basari">{basariMesaji}</Uyari>
            ) : (
              <form onSubmit={handleSubmit(gonder)} className="space-y-4" noValidate>
                {sunucuHatasi && <Uyari tur="hata">{sunucuHatasi}</Uyari>}

                <div>
                  <Etiket htmlFor="e_posta">E-posta Adresi</Etiket>
                  <Girdi
                    id="e_posta"
                    type="email"
                    placeholder="ornek@kapakli.bel.tr"
                    hataliMi={!!errors.e_posta}
                    aria-describedby={errors.e_posta ? "e_posta-hata" : undefined}
                    {...register("e_posta")}
                  />
                  {errors.e_posta && (
                    <p id="e_posta-hata" className="mt-1 text-xs text-tehlike">
                      {errors.e_posta.message}
                    </p>
                  )}
                </div>

                <Dugme
                  type="submit"
                  varyant="birincil"
                  boyut="buyuk"
                  className="w-full"
                  yukleniyorMu={gonderiliyor}
                  yukleniyorMetni="Gönderiliyor..."
                >
                  Sıfırlama Bağlantısı Gönder
                </Dugme>
              </form>
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
