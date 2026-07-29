"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { KimlikKarti } from "@/components/layout/kimlik-karti";
import { Dugme } from "@/components/ui/button";
import { FormAlani } from "@/components/ui/form-alani";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { SifreGirdisi } from "@/components/ui/sifre-girdisi";
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
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12">
      {/* Atmosferik Arka Plan Glow Efektleri */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-birincil-500/10 blur-[120px] dark:bg-birincil-500/5" />
      </div>

      <div className="relative w-full max-w-md">
        <KimlikKarti
          ikon={LogIn}
          baslik="Kapaklı Akıllı Belediye"
          aciklama="Belediye hizmetlerine erişmek için giriş yapın"
          altBilgi={
            <div className="flex items-center justify-center gap-1.5 text-sm">
              <span className="text-metin-ikincil">Hesabınız yok mu?</span>
              <Link
                href="/kayit"
                className="font-semibold text-birincil-600 transition-colors hover:text-birincil-700 hover:underline underline-offset-4"
              >
                Hemen Kayıt Olun
              </Link>
            </div>
          }
        >
          <form onSubmit={handleSubmit(gonder)} className="space-y-5">
            <AnimatePresence initial={false}>
              {sunucuHatasi && (
                <motion.div
                  key="sunucu-hatasi"
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Uyari tur="hata">{sunucuHatasi}</Uyari>
                </motion.div>
              )}
            </AnimatePresence>

            <FormAlani id="e_posta" etiket="E-posta Adresi" hata={errors.e_posta?.message}>
              <div className="relative">
                <Girdi
                  id="e_posta"
                  type="email"
                  autoComplete="email"
                  placeholder="ornek@kapakli.bel.tr"
                  aria-invalid={!!errors.e_posta}
                  className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20"
                  {...register("e_posta")}
                />
              </div>
            </FormAlani>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <Etiket htmlFor="sifre">Şifre</Etiket>
                <Link
                  href="/sifremi-unuttum"
                  className="text-xs font-semibold text-birincil-600 transition-colors hover:text-birincil-700 hover:underline underline-offset-4"
                >
                  Şifremi Unuttum?
                </Link>
              </div>
              <SifreGirdisi
                id="sifre"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={!!errors.sifre}
                className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20"
                {...register("sifre")}
              />
              {errors.sifre && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1.5 text-xs font-medium text-tehlike"
                  role="alert"
                >
                  {errors.sifre.message}
                </motion.p>
              )}
            </div>

            <Dugme
              type="submit"
              varyant="birincil"
              boyut="buyuk"
              className="w-full gap-2 shadow-lg shadow-birincil-600/20 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              disabled={gonderiliyor}
            >
              {gonderiliyor ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  <span>Giriş Yap</span>
                </>
              )}
            </Dugme>

            {/* Güvenlik rozeti */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-metin-ikincil/80">
              <ShieldCheck className="h-4 w-4 text-basarili" />
              <span>256-bit SSL Güvenli Kurumsal Oturum</span>
            </div>
          </form>
        </KimlikKarti>
      </div>
    </div>
  );
}