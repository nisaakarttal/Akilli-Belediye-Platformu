"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { KeyRound, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { KimlikKarti } from "@/components/layout/kimlik-karti";
import { Dugme } from "@/components/ui/button";
import { FormAlani } from "@/components/ui/form-alani";
import { Girdi } from "@/components/ui/input";
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
    <KimlikKarti
      ikon={KeyRound}
      baslik="Şifremi Unuttum"
      aciklama="Kayıtlı e-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim."
      altBilgi={
        <Link href="/giris" className="font-semibold text-birincil-600 hover:underline">
          Giriş sayfasına dön
        </Link>
      }
    >
      {basariMesaji ? (
        <Uyari tur="basari">{basariMesaji}</Uyari>
      ) : (
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

          <FormAlani id="e_posta" etiket="E-posta Adresi" hata={errors.e_posta?.message}>
            <Girdi
              id="e_posta"
              type="email"
              autoComplete="email"
              placeholder="ornek@kapakli.bel.tr"
              aria-invalid={!!errors.e_posta}
              {...register("e_posta")}
            />
          </FormAlani>

          <Dugme type="submit" varyant="birincil" boyut="buyuk" className="w-full gap-2" disabled={gonderiliyor}>
            {gonderiliyor && <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />}
            {gonderiliyor ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
          </Dugme>
        </form>
      )}
    </KimlikKarti>
  );
}
