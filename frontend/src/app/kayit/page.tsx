"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { KimlikKarti } from "@/components/layout/kimlik-karti";
import { Dugme } from "@/components/ui/button";
import { FormAlani } from "@/components/ui/form-alani";
import { Girdi } from "@/components/ui/input";
import { SifreGirdisi } from "@/components/ui/sifre-girdisi";
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
    <KimlikKarti
      ikon={UserPlus}
      baslik="Hesap Oluştur"
      aciklama="Kapaklı Akıllı Belediye Platformu'na katılarak taleplerinizi dijital ortamda takip edin."
      genislik="genis"
      altBilgi={
        <>
          Zaten hesabınız var mı?{" "}
          <Link href="/giris" className="font-semibold text-birincil-600 hover:underline">
            Giriş Yapın
          </Link>
        </>
      }
    >
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormAlani id="ad" etiket="Ad" hata={errors.ad?.message}>
            <Girdi id="ad" placeholder="Ahmet" aria-invalid={!!errors.ad} {...register("ad")} />
          </FormAlani>

          <FormAlani id="soyad" etiket="Soyad" hata={errors.soyad?.message}>
            <Girdi id="soyad" placeholder="Yılmaz" aria-invalid={!!errors.soyad} {...register("soyad")} />
          </FormAlani>
        </div>

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

        <FormAlani id="telefon" etiket="Telefon Numarası" hata={errors.telefon?.message}>
          <Girdi
            id="telefon"
            type="tel"
            autoComplete="tel"
            placeholder="0555 123 45 67"
            aria-invalid={!!errors.telefon}
            {...register("telefon")}
          />
        </FormAlani>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormAlani id="sifre" etiket="Şifre" hata={errors.sifre?.message}>
            <SifreGirdisi
              id="sifre"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.sifre}
              {...register("sifre")}
            />
          </FormAlani>

          <FormAlani id="sifreTekrar" etiket="Şifre Tekrar" hata={errors.sifreTekrar?.message}>
            <SifreGirdisi
              id="sifreTekrar"
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={!!errors.sifreTekrar}
              {...register("sifreTekrar")}
            />
          </FormAlani>
        </div>

        <Dugme type="submit" varyant="birincil" boyut="buyuk" className="mt-2 w-full gap-2" disabled={gonderiliyor}>
          {gonderiliyor ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          )}
          {gonderiliyor ? "Kayıt Oluşturuluyor..." : "Kayıt Ol"}
        </Dugme>
      </form>
    </KimlikKarti>
  );
}
