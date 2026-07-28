"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, UserPlus } from "lucide-react";
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
import { type KayitFormu, kayitSemasi } from "@/lib/validasyon";

export default function KayitSayfasi() {
  const { kayitOl } = useKimlik();
  const router = useRouter();
  const [sunucuHatasi, setSunucuHatasi] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const [sifreGoster, setSifreGoster] = useState(false);
  const [sifreTekrarGoster, setSifreTekrarGoster] = useState(false);

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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zemin-ikincil px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <Kart className="border-kenarlik/50 bg-white/95 shadow-xl backdrop-blur-sm dark:bg-slate-900/95">
          <KartBasligi className="space-y-2 pb-2 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-ikincil-500/10 text-ikincil-600 shadow-md dark:border-slate-800">
              <UserPlus className="h-7 w-7" />
            </div>
            <KartBaslik className="text-3xl font-extrabold tracking-tight text-metin">Hesap Oluştur</KartBaslik>
            <p className="mx-auto max-w-sm text-sm font-medium text-metin-ikincil">
              Kapaklı Akıllı Belediye Platformu&apos;na katılarak taleplerinizi dijital ortamda takip edin.
            </p>
          </KartBasligi>

          <KartIcerik className="px-6 pb-7 pt-5 sm:px-8">
            <form onSubmit={handleSubmit(gonder)} className="space-y-4" noValidate>
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Etiket htmlFor="ad" className="text-sm font-semibold text-metin">
                    Ad
                  </Etiket>
                  <Girdi id="ad" placeholder="Ahmet" hataliMi={!!errors.ad} {...register("ad")} />
                  {errors.ad && <p className="pl-1 text-xs font-medium text-tehlike">{errors.ad.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Etiket htmlFor="soyad" className="text-sm font-semibold text-metin">
                    Soyad
                  </Etiket>
                  <Girdi id="soyad" placeholder="Yılmaz" hataliMi={!!errors.soyad} {...register("soyad")} />
                  {errors.soyad && <p className="pl-1 text-xs font-medium text-tehlike">{errors.soyad.message}</p>}
                </div>
              </div>

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
                <Etiket htmlFor="telefon" className="text-sm font-semibold text-metin">
                  Telefon Numarası
                </Etiket>
                <Girdi
                  id="telefon"
                  type="tel"
                  autoComplete="tel"
                  placeholder="0555 123 45 67"
                  hataliMi={!!errors.telefon}
                  {...register("telefon")}
                />
                {errors.telefon && (
                  <p className="pl-1 text-xs font-medium text-tehlike">{errors.telefon.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Etiket htmlFor="sifre" className="text-sm font-semibold text-metin">
                    Şifre
                  </Etiket>
                  <div className="relative">
                    <Girdi
                      id="sifre"
                      type={sifreGoster ? "text" : "password"}
                      autoComplete="new-password"
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

                <div className="space-y-1.5">
                  <Etiket htmlFor="sifreTekrar" className="text-sm font-semibold text-metin">
                    Şifre Tekrar
                  </Etiket>
                  <div className="relative">
                    <Girdi
                      id="sifreTekrar"
                      type={sifreTekrarGoster ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      hataliMi={!!errors.sifreTekrar}
                      className="pr-10"
                      {...register("sifreTekrar")}
                    />
                    <button
                      type="button"
                      onClick={() => setSifreTekrarGoster((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-metin-ikincil transition-colors hover:text-metin"
                      aria-label={sifreTekrarGoster ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {sifreTekrarGoster ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.sifreTekrar && (
                    <p className="pl-1 text-xs font-medium text-tehlike">{errors.sifreTekrar.message}</p>
                  )}
                </div>
              </div>

              <Dugme
                type="submit"
                varyant="birincil"
                boyut="buyuk"
                className="mt-6 w-full gap-2 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                yukleniyorMu={gonderiliyor}
                yukleniyorMetni="Kayıt Oluşturuluyor..."
              >
                <ShieldCheck className="h-5 w-5" />
                Kayıt Ol
              </Dugme>
            </form>

            <div className="mt-8 border-t border-kenarlik pt-6 text-center">
              <p className="text-sm font-medium text-metin-ikincil">
                Zaten hesabınız var mı?{" "}
                <Link
                  href="/giris"
                  className="font-bold text-ikincil-600 transition-colors hover:text-sky-700 hover:underline"
                >
                  Giriş Yapın
                </Link>
              </p>
            </div>
          </KartIcerik>
        </Kart>
      </motion.div>
    </div>
  );
}
