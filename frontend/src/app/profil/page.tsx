"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Save, UserCheck, Mail, Shield, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { FormAlani } from "@/components/ui/form-alani";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Uyari } from "@/components/ui/uyari";
import { ROL_ETIKETI } from "@/constants/kullanici";
import { useKimlik } from "@/hooks/use-kimlik";
import { apiHataMesaji } from "@/lib/api";
import { kullanicilarApi } from "@/lib/api/kullanicilar";
import { type ProfilFormu, profilSemasi } from "@/lib/validasyon";

function ProfilIcerik() {
  const { kullanici } = useKimlik();
  const [sunucuHatasi, setSunucuHatasi] = useState<string | null>(null);
  const [basariMesaji, setBasariMesaji] = useState<string | null>(null);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfilFormu>({
    resolver: zodResolver(profilSemasi),
    defaultValues: {
      ad: kullanici?.ad,
      soyad: kullanici?.soyad,
      telefon: kullanici?.telefon,
      adres: kullanici?.adres ?? "",
    },
  });

  async function gonder(veri: ProfilFormu) {
    if (!kullanici) return;
    setSunucuHatasi(null);
    setBasariMesaji(null);
    setKaydediliyor(true);
    try {
      await kullanicilarApi.guncelle(kullanici.id, { ...veri, adres: veri.adres || undefined });
      setBasariMesaji("Profil bilgileriniz başarıyla güncellendi.");
    } catch (hata) {
      setSunucuHatasi(apiHataMesaji(hata));
    } finally {
      setKaydediliyor(false);
    }
  }

  if (!kullanici) return null;

  return (
    <>
      <Basli />
      <main className="relative min-h-[85vh] bg-zemin">
        {/* Atmosferik Arka Plan Glow Efekti */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-1/4 h-[400px] w-[400px] rounded-full bg-birincil-500/10 blur-[120px] dark:bg-birincil-500/5" />
        </div>

        <div className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6">
          {/* Sayfa Başlığı */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-birincil-500/25 bg-birincil-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-birincil-600 mb-3 dark:text-birincil-400">
              <UserCheck className="h-3.5 w-3.5" />
              <span>Hesap Yönetimi</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-metin sm:text-4xl">Profil Bilgilerim</h1>
            <p className="mt-2 text-sm leading-relaxed text-metin-ikincil">
              Kişisel bilgilerinizi görüntüleyin, güncelleyin ve hesap güvenliğinizi yönetin.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Kart className="border-kenarlik/80 bg-zemin/80 backdrop-blur-xl shadow-lg shadow-black/[0.02]">
              <KartBasligi className="border-b border-kenarlik/60 pb-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-birincil-500/10 p-2.5 text-birincil-600 dark:text-birincil-400">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <KartBaslik className="text-lg font-bold text-metin">Kişisel Detaylar</KartBaslik>
                      <p className="text-xs text-metin-ikincil mt-0.5">Sistem üzerindeki kayıtlı kimlik bilgileriniz</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-birincil-500/20 bg-birincil-600/10 px-3.5 py-1 text-xs font-semibold text-birincil-700 dark:text-birincil-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-birincil-600 animate-pulse" />
                    {ROL_ETIKETI[kullanici.rol]}
                  </span>
                </div>
              </KartBasligi>

              <KartIcerik className="space-y-6 pt-6">
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
                  {basariMesaji && (
                    <motion.div
                      key="basari-mesaji"
                      initial={{ opacity: 0, height: 0, y: -8 }}
                      animate={{ opacity: 1, height: "auto", y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <Uyari tur="basari">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-basarili flex-shrink-0" />
                          <span>{basariMesaji}</span>
                        </div>
                      </Uyari>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* E-posta Alanı (Salt Okunur) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Etiket className="flex items-center gap-1.5 text-xs font-semibold text-metin-ikincil">
                      <Mail className="h-3.5 w-3.5" />
                      E-posta Adresi (Değiştirilemez)
                    </Etiket>
                  </div>
                  <div className="relative">
                    <Girdi
                      value={kullanici.e_posta}
                      disabled
                      className="bg-kenarlik/30 text-metin-ikincil cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                {/* Form Alanı */}
                <form onSubmit={handleSubmit(gonder)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormAlani id="ad" etiket="Ad" hata={errors.ad?.message}>
                      <Girdi
                        id="ad"
                        aria-invalid={!!errors.ad}
                        className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20"
                        {...register("ad")}
                      />
                    </FormAlani>
                    <FormAlani id="soyad" etiket="Soyad" hata={errors.soyad?.message}>
                      <Girdi
                        id="soyad"
                        aria-invalid={!!errors.soyad}
                        className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20"
                        {...register("soyad")}
                      />
                    </FormAlani>
                  </div>

                  <FormAlani id="telefon" etiket="Telefon Numarası" hata={errors.telefon?.message}>
                    <Girdi
                      id="telefon"
                      aria-invalid={!!errors.telefon}
                      placeholder="05XX XXX XX XX"
                      className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20"
                      {...register("telefon")}
                    />
                  </FormAlani>

                  <FormAlani id="adres" etiket="İkametgah Adresi" hata={errors.adres?.message}>
                    <Girdi
                      id="adres"
                      placeholder="Mahalle, Cadde, No, Kapaklı/Tekirdağ"
                      className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20"
                      {...register("adres")}
                    />
                  </FormAlani>

                  <div className="pt-2">
                    <Dugme
                      type="submit"
                      varyant="birincil"
                      boyut="normal"
                      disabled={kaydediliyor}
                      className="w-full sm:w-auto gap-2 shadow-lg shadow-birincil-600/20 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 px-6"
                    >
                      {kaydediliyor ? (
                        <>
                          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                          <span>Güncelleniyor...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} aria-hidden="true" />
                          <span>Değişiklikleri Kaydet</span>
                        </>
                      )}
                    </Dugme>
                  </div>
                </form>
              </KartIcerik>
            </Kart>
          </motion.div>
        </div>
      </main>
      <Altbilgi />
    </>
  );
}

export default function ProfilSayfasi() {
  return (
    <KorumaliRota>
      <ProfilIcerik />
    </KorumaliRota>
  );
}