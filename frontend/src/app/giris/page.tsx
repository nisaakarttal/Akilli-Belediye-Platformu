"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react"; // İkonlar

// UI Bileşenleri (Bu bileşenlerin tasarım sınıfları tailwind.config.js'de tanımlanmalıdır)
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
    // Arka plan rengi daha açık ve sıcak bir tona (örn. çok açık gri veya fildişi) güncellendi.
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-arkaplan-ikincil">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Kart className="border-border/50 shadow-xl backdrop-blur-sm bg-beyaz/90">
          <KartBasligi className="space-y-2 text-center pb-2">
            {/* Kapaklı Belediyesi'nin resmi mavi ve kırmızı renklerini yansıtan ikon alanı */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-birincil-50 text-birincil-600 mb-3 border-4 border-beyaz shadow-md">
              <LogIn className="h-7 w-7 text-birincil-700" />
            </div>
            <KartBaslik className="text-3xl font-extrabold tracking-tighter text-metin-birincil">
              Kapaklı Akıllı Belediye
            </KartBaslik>
            <p className="text-base text-metin-ikincil font-medium">
              Platforma giriş yapın
            </p>
          </KartBasligi>

          <KartIcerik className="pt-5 pb-7 px-8">
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
                <Etiket htmlFor="e_posta" className="text-sm font-semibold text-metin-birincil">E-posta Adresi</Etiket>
                <Girdi
                  id="e_posta"
                  type="email"
                  autoComplete="email"
                  placeholder="ornek@kapakli.bel.tr"
                  aria-invalid={!!errors.e_posta}
                  // Odaklanıldığında (focus) belediyenin sarı/altın rengini yansıtan efekt
                  className="border-border focus:border-uyari-400 focus:ring-uyari-100 placeholder:text-metin-ikincil/70"
                  {...register("e_posta")}
                />
                {errors.e_posta && (
                  <p className="text-xs font-medium text-tehlike animate-fadeIn pl-1">
                    {errors.e_posta.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Etiket htmlFor="sifre" className="text-sm font-semibold text-metin-birincil">Şifre</Etiket>
                  <Link
                    href="/sifremi-unuttum"
                    // Kurumsal kırmızı tonuna daha yakın bir etkileşim rengi
                    className="text-xs font-semibold text-birincil-700 hover:text-ikincil-600 hover:underline transition-colors"
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
                    aria-invalid={!!errors.sifre}
                    className="pr-10 border-border focus:border-uyari-400 focus:ring-uyari-100 placeholder:text-metin-ikincil/70"
                    {...register("sifre")}
                  />
                  <button
                    type="button"
                    onClick={() => setSifreGoster(!sifreGoster)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-metin-ikincil hover:text-metin-birincil transition-colors"
                    aria-label={sifreGoster ? "Şifreyi gizle" : "Şifreyi göster"}
                  >
                    {sifreGoster ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.sifre && (
                  <p className="text-xs font-medium text-tehlike animate-fadeIn pl-1">
                    {errors.sifre.message}
                  </p>
                )}
              </div>

              <Dugme
                type="submit"
                varyant="birincil"
                boyut="buyuk"
                // Kurumsal mavi ana renk, üzerine gelindiğinde kurumsal kırmızıya yumuşak geçiş
                className="w-full flex items-center justify-center gap-2 mt-4 bg-birincil-600 hover:bg-ikincil-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                disabled={gonderiliyor}
              >
                {gonderiliyor ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Giriş Yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span>Giriş Yap</span>
                  </>
                )}
              </Dugme>
            </form>

            <div className="mt-8 border-t border-border/60 pt-6 text-center">
              <p className="text-sm text-metin-ikincil font-medium">
                Hesabınız yok mu?{" "}
                <Link
                  href="/kayit"
                  // Kayıt ol linki kurumsal kırmızı tonunda
                  className="font-bold text-ikincil-600 hover:text-ikincil-700 hover:underline transition-colors"
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