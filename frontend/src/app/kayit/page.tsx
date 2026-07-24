"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, UserPlus, ShieldCheck } from "lucide-react"; // İkonlar eklendi

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

  // Şifre görünürlüğü durumları
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
    // Yumuşak ve modern arka plan
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-arkaplan-ikincil">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <Kart className="border-border/50 shadow-xl backdrop-blur-sm bg-beyaz/95">
          <KartBasligi className="space-y-2 text-center pb-2">
            {/* Vurgulu Rozet ve İkon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ikincil-50 text-ikincil-600 mb-3 border-4 border-beyaz shadow-md">
              <UserPlus className="h-7 w-7 text-ikincil-600" />
            </div>
            <KartBaslik className="text-3xl font-extrabold tracking-tight text-metin-birincil">
              Hesap Oluştur
            </KartBaslik>
            <p className="text-sm text-metin-ikincil font-medium max-w-sm mx-auto">
              Kapaklı Akıllı Belediye Platformu&apos;na katılarak taleplerinizi dijital ortamda takip edin.
            </p>
          </KartBasligi>

          <KartIcerik className="pt-5 pb-7 px-6 sm:px-8">
            <form onSubmit={handleSubmit(gonder)} className="space-y-4" noValidate>

              {/* Animasyonlu Sunucu Hatası */}
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

              {/* Ad & Soyad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Etiket htmlFor="ad" className="text-sm font-semibold text-metin-birincil">Ad</Etiket>
                  <Girdi
                    id="ad"
                    placeholder="Ahmet"
                    aria-invalid={!!errors.ad}
                    className="border-border focus:border-uyari-400 focus:ring-uyari-100 placeholder:text-metin-ikincil/60"
                    {...register("ad")}
                  />
                  {errors.ad && <p className="text-xs font-medium text-tehlike pl-1">{errors.ad.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Etiket htmlFor="soyad" className="text-sm font-semibold text-metin-birincil">Soyad</Etiket>
                  <Girdi
                    id="soyad"
                    placeholder="Yılmaz"
                    aria-invalid={!!errors.soyad}
                    className="border-border focus:border-uyari-400 focus:ring-uyari-100 placeholder:text-metin-ikincil/60"
                    {...register("soyad")}
                  />
                  {errors.soyad && <p className="text-xs font-medium text-tehlike pl-1">{errors.soyad.message}</p>}
                </div>
              </div>

              {/* E-posta */}
              <div className="space-y-1.5">
                <Etiket htmlFor="e_posta" className="text-sm font-semibold text-metin-birincil">E-posta Adresi</Etiket>
                <Girdi
                  id="e_posta"
                  type="email"
                  autoComplete="email"
                  placeholder="ornek@kapakli.bel.tr"
                  aria-invalid={!!errors.e_posta}
                  className="border-border focus:border-uyari-400 focus:ring-uyari-100 placeholder:text-metin-ikincil/60"
                  {...register("e_posta")}
                />
                {errors.e_posta && <p className="text-xs font-medium text-tehlike pl-1">{errors.e_posta.message}</p>}
              </div>

              {/* Telefon */}
              <div className="space-y-1.5">
                <Etiket htmlFor="telefon" className="text-sm font-semibold text-metin-birincil">Telefon Numarası</Etiket>
                <Girdi
                  id="telefon"
                  type="tel"
                  autoComplete="tel"
                  placeholder="0555 123 45 67"
                  aria-invalid={!!errors.telefon}
                  className="border-border focus:border-uyari-400 focus:ring-uyari-100 placeholder:text-metin-ikincil/60"
                  {...register("telefon")}
                />
                {errors.telefon && <p className="text-xs font-medium text-tehlike pl-1">{errors.telefon.message}</p>}
              </div>

              {/* Şifre ve Şifre Tekrarı */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Şifre */}
                <div className="space-y-1.5">
                  <Etiket htmlFor="sifre" className="text-sm font-semibold text-metin-birincil">Şifre</Etiket>
                  <div className="relative">
                    <Girdi
                      id="sifre"
                      type={sifreGoster ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      aria-invalid={!!errors.sifre}
                      className="pr-10 border-border focus:border-uyari-400 focus:ring-uyari-100 placeholder:text-metin-ikincil/60"
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
                  {errors.sifre && <p className="text-xs font-medium text-tehlike pl-1">{errors.sifre.message}</p>}
                </div>

                {/* Şifre Tekrar */}
                <div className="space-y-1.5">
                  <Etiket htmlFor="sifreTekrar" className="text-sm font-semibold text-metin-birincil">Şifre Tekrar</Etiket>
                  <div className="relative">
                    <Girdi
                      id="sifreTekrar"
                      type={sifreTekrarGoster ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      aria-invalid={!!errors.sifreTekrar}
                      className="pr-10 border-border focus:border-uyari-400 focus:ring-uyari-100 placeholder:text-metin-ikincil/60"
                      {...register("sifreTekrar")}
                    />
                    <button
                      type="button"
                      onClick={() => setSifreTekrarGoster(!sifreTekrarGoster)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-metin-ikincil hover:text-metin-birincil transition-colors"
                      aria-label={sifreTekrarGoster ? "Şifreyi gizle" : "Şifreyi göster"}
                    >
                      {sifreTekrarGoster ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.sifreTekrar && (
                    <p className="text-xs font-medium text-tehlike pl-1">{errors.sifreTekrar.message}</p>
                  )}
                </div>
              </div>

              {/* Gönder Butonu */}
              <Dugme
                type="submit"
                varyant="birincil"
                boyut="buyuk"
                className="w-full flex items-center justify-center gap-2 mt-6 bg-birincil-600 hover:bg-ikincil-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                disabled={gonderiliyor}
              >
                {gonderiliyor ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Kayıt Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    <span>Kayıt Ol</span>
                  </>
                )}
              </Dugme>
            </form>

            {/* Giriş Yap Linki */}
            <div className="mt-8 border-t border-border/60 pt-6 text-center">
              <p className="text-sm text-metin-ikincil font-medium">
                Zaten hesabınız var mı?{" "}
                <Link
                  href="/giris"
                  className="font-bold text-ikincil-600 hover:text-ikincil-700 hover:underline transition-colors"
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