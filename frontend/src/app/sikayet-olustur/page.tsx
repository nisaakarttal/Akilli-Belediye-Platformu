"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles, AlertCircle, MapPin, FileText, CheckCircle2, ChevronRight, ChevronLeft, Paperclip } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { AiOneriKarti } from "@/components/sikayet/ai-oneri-karti";
import { DosyaSecici } from "@/components/sikayet/dosya-yukleme";
import { Button } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { FormAlani } from "@/components/ui/form-alani";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Secim } from "@/components/ui/select";
import { MetinAlani } from "@/components/ui/textarea";
import { Uyari } from "@/components/ui/uyari";
import { useTalepOlusturFormu } from "@/hooks/use-talep-olustur-formu";

// Harita bileşeni SSR kapalı dinamik import
const HaritaSecici = dynamic(
  () => import("@/components/harita/harita-secici").then((mod) => mod.HaritaSecici),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 w-full animate-pulse items-center justify-center rounded-2xl bg-kenarlik/40 text-sm font-medium text-metin-ikincil backdrop-blur-sm">
        Harita yükleniyor...
      </div>
    ),
  }
);

const ADIMLAR = [
  { id: 1, ad: "Temel Bilgiler", aciklama: "Sorun detayı ve AI analizi", ikon: FileText },
  { id: 2, ad: "Konum & Kategori", aciklama: "Bölge ve öncelik seçimi", ikon: MapPin },
  { id: 3, ad: "Ekler & Onay", aciklama: "Fotoğraf, belge ve gönderim", ikon: Paperclip },
];

function SikayetOlusturIcerik() {
  const [aktifAdim, setAktifAdim] = useState(1);
  const [yon, setYon] = useState(1); // Animasyon yönü için (-1 veya 1)

  const {
    register,
    errors,
    handleGonder,
    kategoriler,
    kategorilerYukleniyor,
    mahalleler,
    mahallelerYukleniyor,
    konum,
    setKonum,
    dosyalar,
    setDosyalar,
    aiAnalizEdiliyor,
    aiSonucu,
    aiOneriUygulandi,
    aiIleAnalizEt,
    oneriyiUygula,
    sunucuHatasi,
    gonderiliyor,
  } = useTalepOlusturFormu();

  const sonrakiAdim = () => {
    setYon(1);
    setAktifAdim((prev) => Math.min(prev + 1, 3));
  };

  const oncekiAdim = () => {
    setYon(-1);
    setAktifAdim((prev) => Math.max(prev - 1, 1));
  };

  const variantlar = {
    giris: (yon: number) => ({ opacity: 0, x: yon * 40 }),
    merkez: { opacity: 1, x: 0 },
    cikis: (yon: number) => ({ opacity: 0, x: yon * -40 }),
  };

  return (
    <>
      <Basli />
      <main className="relative min-h-[85vh] bg-zemin overflow-hidden">
        {/* Atmosferik Arka Plan Glow Efekti */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full bg-birincil-500/10 blur-[140px] dark:bg-birincil-500/5" />
          <div className="absolute bottom-10 right-1/4 h-[400px] w-[400px] rounded-full bg-ikincil-500/10 blur-[130px] dark:bg-ikincil-500/5" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6">
          {/* Başlık Grubu */}
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-birincil-500/25 bg-birincil-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-birincil-600 mb-3 dark:text-birincil-400">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Akıllı Çözüm Masası</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-metin sm:text-4xl">Şikâyet ve Talep Oluştur</h1>
            <p className="mt-2 text-sm leading-relaxed text-metin-ikincil">
              Belediyemize iletmek istediğiniz talebi 3 kolay adımda hızlıca oluşturun. Yapay zekâ asistanımız süreci sizin için hızlandırsın.
            </p>
          </div>

          {/* Master Seviye Adım Göstergesi (Stepper Wizard) */}
          <div className="mb-8 grid grid-cols-3 gap-3">
            {ADIMLAR.map((adim) => {
              const Ikon = adim.ikon;
              const aktifMi = aktifAdim === adim.id;
              const tamamlandiMi = aktifAdim > adim.id;

              return (
                <div
                  key={adim.id}
                  onClick={() => {
                    if (adim.id < aktifAdim) {
                      setYon(-1);
                      setAktifAdim(adim.id);
                    }
                  }}
                  className={`group relative flex flex-col sm:flex-row items-center gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                    aktifMi
                      ? "border-birincil-500 bg-birincil-500/10 shadow-md shadow-birincil-500/10"
                      : tamamlandiMi
                      ? "border-basarili/40 bg-basarili/5 cursor-pointer hover:border-basarili"
                      : "border-kenarlik/60 bg-zemin/40 opacity-60"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold transition-transform duration-300 group-hover:scale-105 ${
                      aktifMi
                        ? "bg-birincil-600 text-white shadow-md shadow-birincil-600/30"
                        : tamamlandiMi
                        ? "bg-basarili text-white shadow-md shadow-basarili/30"
                        : "bg-kenarlik text-metin-ikincil"
                    }`}
                  >
                    {tamamlandiMi ? <CheckCircle2 className="h-5 w-5" /> : <Ikon className="h-5 w-5" />}
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-metin-ikincil block">
                      Adım 0{adim.id}
                    </span>
                    <p className={`text-xs sm:text-sm font-bold ${aktifMi ? "text-birincil-600 dark:text-birincil-400" : "text-metin"}`}>
                      {adim.ad}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Kart className="border-kenarlik/80 bg-zemin/80 backdrop-blur-xl shadow-xl shadow-black/[0.02]">
              <KartBasligi className="border-b border-kenarlik/60 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <KartBaslik className="text-lg font-bold text-metin">{ADIMLAR[aktifAdim - 1].ad}</KartBaslik>
                    <p className="text-xs text-metin-ikincil mt-0.5">{ADIMLAR[aktifAdim - 1].aciklama}</p>
                  </div>
                  <span className="rounded-full bg-kenarlik px-3 py-1 text-xs font-semibold text-metin-ikincil">
                    {aktifAdim} / 3
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
                </AnimatePresence>

                <form onSubmit={handleGonder} className="space-y-6">

                  <AnimatePresence mode="wait" custom={yon}>

                    {/* ADIM 1: TEMEL BİLGİLER & AI */}
                    {aktifAdim === 1 && (
                      <motion.div
                        key="adim-1"
                        custom={yon}
                        variants={variantlar}
                        initial="giris"
                        animate="merkez"
                        exit="cikis"
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="space-y-5"
                      >
                        <div className="flex items-center justify-between rounded-2xl border border-birincil-500/20 bg-birincil-500/5 p-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-birincil-500/10 p-2.5 text-birincil-600 dark:text-birincil-400">
                              <Sparkles className="h-5 w-5 animate-pulse" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-metin">Yapay Zekâ Asistanı</p>
                              <p className="text-xs text-metin-ikincil">Sorununuzu yazıp analiz ettirerek otomatik kategori önerisi alın.</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            varyant="cam"
                            boyut="kucuk"
                            onClick={aiIleAnalizEt}
                            disabled={aiAnalizEdiliyor}
                            className="gap-2 border-birincil-500/40 bg-birincil-500/15 text-birincil-600 hover:bg-birincil-500/25 dark:text-birincil-400 shrink-0"
                          >
                            {aiAnalizEdiliyor ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                            <span>{aiAnalizEdiliyor ? "Analiz Ediliyor..." : "Analiz Et"}</span>
                          </Button>
                        </div>

                        <FormAlani id="baslik" etiket="Başlık" hata={errors.baslik?.message}>
                          <Input
                            id="baslik"
                            placeholder="Örn: Sokak lambası yanmıyor"
                            aria-invalid={!!errors.baslik}
                            className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20"
                            {...register("baslik")}
                          />
                        </FormAlani>

                        <FormAlani id="aciklama" etiket="Açıklama" hata={errors.aciklama?.message}>
                          <MetinAlani
                            id="aciklama"
                            placeholder="Sorunu detaylı bir şekilde açıklayınız..."
                            aria-invalid={!!errors.aciklama}
                            className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20 min-h-[130px]"
                            {...register("aciklama")}
                          />
                        </FormAlani>

                        <AnimatePresence initial={false}>
                          {aiSonucu && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                            >
                              <AiOneriKarti analiz={aiSonucu} uygulandiMi={aiOneriUygulandi} onUygula={oneriyiUygula} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}

                    {/* ADIM 2: KATEGORİ, ÖNCELİK VE KONUM */}
                    {aktifAdim === 2 && (
                      <motion.div
                        key="adim-2"
                        custom={yon}
                        variants={variantlar}
                        initial="giris"
                        animate="merkez"
                        exit="cikis"
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="space-y-5"
                      >
                        <div className="grid gap-5 sm:grid-cols-2">
                          <FormAlani id="kategori_id" etiket="Kategori" hata={errors.kategori_id?.message}>
                            <Secim
                              id="kategori_id"
                              aria-invalid={!!errors.kategori_id}
                              className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20"
                              {...register("kategori_id")}
                            >
                              <option value="">{kategorilerYukleniyor ? "Yükleniyor..." : "Kategori seçiniz"}</option>
                              {kategoriler?.map((k) => (
                                <option key={k.id} value={k.id}>{k.ad}</option>
                              ))}
                            </Secim>
                          </FormAlani>

                          <FormAlani id="oncelik" etiket="Öncelik Derecesi">
                            <Secim id="oncelik" className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20" {...register("oncelik")}>
                              <option value="dusuk">Düşük</option>
                              <option value="orta">Orta</option>
                              <option value="yuksek">Yüksek</option>
                              <option value="acil">Acil</option>
                            </Secim>
                          </FormAlani>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <FormAlani id="mahalle_id" etiket="Mahalle" hata={errors.mahalle_id?.message}>
                            <Secim
                              id="mahalle_id"
                              aria-invalid={!!errors.mahalle_id}
                              className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20"
                              {...register("mahalle_id")}
                            >
                              <option value="">{mahallelerYukleniyor ? "Yükleniyor..." : "Mahalle seçiniz"}</option>
                              {mahalleler?.map((m) => (
                                <option key={m.id} value={m.id}>{m.ad}</option>
                              ))}
                            </Secim>
                          </FormAlani>

                          <FormAlani id="adres_detay" etiket="Adres Detayı (İsteğe Bağlı)">
                            <Input id="adres_detay" placeholder="Cadde, sokak, kapı no..." className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20" {...register("adres_detay")} />
                          </FormAlani>
                        </div>

                        <div>
                          <Etiket className="mb-2 block text-xs font-semibold text-metin-ikincil">Harita Üzerinden Konum İşaretleyin</Etiket>
                          <div className="overflow-hidden rounded-2xl border border-kenarlik shadow-inner">
                            <HaritaSecici
                              enlem={konum.enlem}
                              boylam={konum.boylam}
                              onDegistir={(enlem, boylam) => setKonum({ enlem, boylam })}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* ADIM 3: EKLER VE ONAY */}
                    {aktifAdim === 3 && (
                      <motion.div
                        key="adim-3"
                        custom={yon}
                        variants={variantlar}
                        initial="giris"
                        animate="merkez"
                        exit="cikis"
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="space-y-6"
                      >
                        <div className="space-y-3 rounded-2xl border border-kenarlik/60 bg-zemin/50 p-5">
                          <Etiket className="text-xs font-bold uppercase tracking-wider text-metin-ikincil">Medya Ekleri (Fotoğraf, Video, Belge)</Etiket>
                          <DosyaSecici dosyalar={dosyalar} onDegistir={setDosyalar} />
                        </div>

                        <div className="rounded-2xl border border-basarili/30 bg-basarili/5 p-5 flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-basarili shrink-0 mt-0.5" />
                          <div className="text-xs space-y-1">
                            <p className="font-bold text-metin">Gönderime Hazır</p>
                            <p className="text-metin-ikincil">Talebiniz belediyemizin ilgili müdürlüğüne güvenli bir şekilde iletilmek üzere hazırlandı. Gönder butonuna basarak süreci tamamlayabilirsiniz.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>

                  {/* Adım Kontrol Butonları */}
                  <div className="flex items-center justify-between pt-4 border-t border-kenarlik/60">
                    {aktifAdim > 1 ? (
                      <Button
                        type="button"
                        varyant="cam"
                        boyut="normal"
                        onClick={oncekiAdim}
                        className="gap-2"
                      >
                        <ChevronLeft size={16} />
                        <span>Geri</span>
                      </Button>
                    ) : (
                      <div />
                    )}

                    {aktifAdim < 3 ? (
                      <Button
                        type="button"
                        varyant="birincil"
                        boyut="normal"
                        onClick={sonrakiAdim}
                        className="gap-2 px-6 shadow-md shadow-birincil-600/20"
                      >
                        <span>İleri</span>
                        <ChevronRight size={16} />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        varyant="birincil"
                        boyut="buyuk"
                        className="gap-2 px-8 shadow-lg shadow-birincil-600/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        disabled={gonderiliyor}
                      >
                        {gonderiliyor ? (
                          <>
                            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                            <span>Talebiniz Gönderiliyor...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={18} aria-hidden="true" />
                            <span>Talebi Kesin Olarak Gönder</span>
                          </>
                        )}
                      </Button>
                    )}
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

export default function SikayetOlusturSayfasi() {
  return (
    <KorumaliRota>
      <SikayetOlusturIcerik />
    </KorumaliRota>
  );
}