"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Uyari } from "@/components/ui/uyari";
import { useKimlik } from "@/hooks/use-kimlik";
import { apiHataMesaji } from "@/lib/api";
import { type GirisFormu, girisSemasi } from "@/lib/validasyon";

export default function GirisSayfasi() {
  const { girisYap } = useKimlik();
  const router = useRouter();
  const [sunucuHatasi, setSunucuHatasi] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [sifreGoster, setSifreGoster] = useState(false);

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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zemin-ikincil px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Kart className="border-kenarlik/50 bg-white/90 shadow-xl backdrop-blur-sm dark:bg-slate-900/90">
          <KartBasligi className="space-y-2 pb-2 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-birincil-50 text-birincil-600 shadow-md dark:border-slate-800">
              <LogIn className="h-7 w-7 text-birincil-700" />
            </div>
            <KartBaslik className="text-3xl font-extrabold tracking-tighter text-metin">
              Kapaklı Akıllı Belediye
            </KartBaslik>
            <p className="text-base font-medium text-metin-ikincil">Platforma giriş yapın</p>
          </KartBasligi>

          <KartIcerik className="px-8 pb-7 pt-5">
            <form onSubmit={handleSubmit(gonder)} className="space-y-5" noValidate>
              <AnimatePresence>
                {sunucuHatasi && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Uyari tur="hata">{sunucuHatasi}</Uyari>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <Etiket htmlFor="e_posta" className="text-sm font-semibold text-metin">
                  E-posta Adresi
                </Etiket>
                <Girdi
                  id="e_posta"
                  type="email"
                  autoComplete="email"
                  placeholder="ornek@kapakli.bel.tr"
                  hataliMi={!!errors.e_posta}
                  {...register("e_posta")}
                />
                {errors.e_posta && (
                  <p className="pl-1 text-xs font-medium text-tehlike">{errors.e_posta.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Etiket htmlFor="sifre" className="text-sm font-semibold text-metin">
                    Şifre
                  </Etiket>
                  <Link
                    href="/sifremi-unuttum"
                    className="text-xs font-semibold text-birincil-700 transition-colors hover:text-ikincil-600 hover:underline dark:text-birincil-300"
                  >
                    Şifremi Unuttum
                  </Link>
                </div>
                <div className="relative">
                  <Girdi
                    id="sifre"
                    type={sifreGoster ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    hataliMi={!!errors.sifre}
                    className="pr-10"
                    {...register("sifre")}
                  />
                  <button
                    type="button"
                    onClick={() => setSifreGoster((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-metin-ikincil transition-colors hover:text-metin"
                    aria-label={sifreGoster ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    {sifreGoster ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.sifre && <p className="pl-1 text-xs font-medium text-tehlike">{errors.sifre.message}</p>}
              </div>

              <Dugme
                type="submit"
                varyant="birincil"
                boyut="buyuk"
                className="mt-4 w-full gap-2 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                yukleniyorMu={gonderiliyor}
                yukleniyorMetni="Giriş Yapılıyor..."
              >
                <LogIn className="h-5 w-5" />
                Giriş Yap
              </Dugme>
            </form>

            <div className="mt-8 border-t border-kenarlik pt-6 text-center">
              <p className="text-sm font-medium text-metin-ikincil">
                Hesabınız yok mu?{" "}
                <Link
                  href="/kayit"
                  className="font-bold text-ikincil-600 transition-colors hover:text-sky-700 hover:underline"
                >
                  Kayıt Olun
                </Link>
              </p>
            </div>
          </KartIcerik>
        </Kart>
      </motion.div>
    </div>
  );
}
