"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AiOneriKarti } from "@/components/sikayet/ai-oneri-karti";
import { dosyaTuruTahminEt, DosyaSecici } from "@/components/sikayet/dosya-yukleme";
import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Secim } from "@/components/ui/select";
import { MetinAlani } from "@/components/ui/textarea";
import { Uyari } from "@/components/ui/uyari";
import { apiHataMesaji } from "@/lib/api";
import { aiApi } from "@/lib/api/ai";
import { kategorilerApi, konumApi } from "@/lib/api/konum";
import { taleplerApi } from "@/lib/api/talepler";
import { type TalepOlusturFormu, talepOlusturSemasi } from "@/lib/validasyon";
import type { AnalizYaniti, TalepOnceligi } from "@/types";

// 🌐 Harita bileşenini SSR kapalı olarak dinamik import ediyoruz (Harita çakışmasını engeller)
const HaritaSecici = dynamic(
  () => import("@/components/harita/harita-secici").then((mod) => mod.HaritaSecici),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">
        Harita yükleniyor...
      </div>
    ),
  }
);

const KAPAKLI_MERKEZ = { enlem: 41.3706, boylam: 27.9917 };

function SikayetOlusturIcerik() {
  const router = useRouter();

  const { data: kategoriler } = useQuery({ queryKey: ["kategoriler"], queryFn: kategorilerApi.listele });
  const { data: mahalleler } = useQuery({ queryKey: ["mahalleler"], queryFn: () => konumApi.mahalleleriListele() });

  const [konum, setKonum] = useState(KAPAKLI_MERKEZ);
  const [dosyalar, setDosyalar] = useState<File[]>([]);
  const [aiAnalizEdiliyor, setAiAnalizEdiliyor] = useState(false);
  const [aiSonucu, setAiSonucu] = useState<AnalizYaniti | null>(null);
  const [aiOneriUygulandi, setAiOneriUygulandi] = useState(false);
  const [sunucuHatasi, setSunucuHatasi] = useState<string | null>(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TalepOlusturFormu>({
    resolver: zodResolver(talepOlusturSemasi),
    defaultValues: { oncelik: "orta" },
  });

  const baslik = watch("baslik");
  const aciklama = watch("aciklama");

  async function aiIleAnalizEt() {
    if (!baslik || !aciklama || baslik.length < 5 || aciklama.length < 10) {
      setSunucuHatasi("Yapay zekâ analizi için önce başlık ve açıklamayı doldurunuz.");
      return;
    }
    setSunucuHatasi(null);
    setAiAnalizEdiliyor(true);
    setAiOneriUygulandi(false);
    try {
      const sonuc = await aiApi.analizEt(baslik, aciklama);
      setAiSonucu(sonuc);
    } catch (hata) {
      setSunucuHatasi(apiHataMesaji(hata, "Yapay zekâ analizi şu anda yapılamadı."));
    } finally {
      setAiAnalizEdiliyor(false);
    }
  }

  function oneriyiUygula() {
    if (!aiSonucu?.onerilen_kategori_id) return;
    setValue("kategori_id", aiSonucu.onerilen_kategori_id);
    setValue("oncelik", aiSonucu.onerilen_oncelik as TalepOnceligi);
    setAiOneriUygulandi(true);
  }

  async function gonder(veri: TalepOlusturFormu) {
    setSunucuHatasi(null);
    setGonderiliyor(true);
    try {
      const talep = await taleplerApi.olustur({
        baslik: veri.baslik,
        aciklama: veri.aciklama,
        kategori_id: veri.kategori_id,
        mahalle_id: veri.mahalle_id,
        adres_detay: veri.adres_detay || undefined,
        enlem: konum.enlem,
        boylam: konum.boylam,
        oncelik: veri.oncelik,
        ai_onerilen_kategori_id: aiOneriUygulandi ? aiSonucu?.onerilen_kategori_id : null,
        ai_onerilen_oncelik: aiOneriUygulandi ? aiSonucu?.onerilen_oncelik : null,
        ai_guven_skoru: aiOneriUygulandi ? aiSonucu?.guven_skoru : null,
      });

      for (const dosya of dosyalar) {
        await taleplerApi.dosyaYukle(talep.id, dosya, dosyaTuruTahminEt(dosya.name));
      }

      router.push(`/taleplerim/${talep.id}`);
    } catch (hata) {
      setSunucuHatasi(apiHataMesaji(hata, "Talep oluşturulamadı. Lütfen bilgilerinizi kontrol ediniz."));
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <>
      <Basli />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="mb-1 text-2xl font-bold text-metin sm:text-3xl">Şikâyet / Talep Oluştur</h1>
        <p className="mb-6 text-sm text-metin-ikincil">
          Sorununuzu aşağıdaki formla bildirin. Yapay zekâ asistanımız uygun kategoriyi ve önceliği
          önermenize yardımcı olabilir.
        </p>

        <Kart>
          <KartBasligi>
            <KartBaslik>Talep Bilgileri</KartBaslik>
          </KartBasligi>
          <KartIcerik className="space-y-5">
            {sunucuHatasi && <Uyari tur="hata">{sunucuHatasi}</Uyari>}

            <form onSubmit={handleSubmit(gonder)} className="space-y-5">
              <div>
                <Etiket htmlFor="baslik">Başlık</Etiket>
                <Girdi id="baslik" placeholder="Örn: Sokak lambası yanmıyor" {...register("baslik")} />
                {errors.baslik && <p className="mt-1 text-xs text-tehlike">{errors.baslik.message}</p>}
              </div>

              <div>
                <Etiket htmlFor="aciklama">Açıklama</Etiket>
                <MetinAlani
                  id="aciklama"
                  placeholder="Sorunu detaylı bir şekilde açıklayınız..."
                  {...register("aciklama")}
                />
                {errors.aciklama && <p className="mt-1 text-xs text-tehlike">{errors.aciklama.message}</p>}
              </div>

              <Dugme
                type="button"
                varyant="cam"
                boyut="kucuk"
                onClick={aiIleAnalizEt}
                disabled={aiAnalizEdiliyor}
                className="gap-2"
              >
                <Sparkles size={16} />
                {aiAnalizEdiliyor ? "Analiz Ediliyor..." : "Yapay Zekâ ile Analiz Et"}
              </Dugme>

              {aiSonucu && <AiOneriKarti analiz={aiSonucu} uygulandiMi={aiOneriUygulandi} onUygula={oneriyiUygula} />}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Etiket htmlFor="kategori_id">Kategori</Etiket>
                  <Secim id="kategori_id" {...register("kategori_id")}>
                    <option value="">Kategori seçiniz</option>
                    {kategoriler?.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.ad}
                      </option>
                    ))}
                  </Secim>
                  {errors.kategori_id && <p className="mt-1 text-xs text-tehlike">{errors.kategori_id.message}</p>}
                </div>

                <div>
                  <Etiket htmlFor="oncelik">Öncelik</Etiket>
                  <Secim id="oncelik" {...register("oncelik")}>
                    <option value="dusuk">Düşük</option>
                    <option value="orta">Orta</option>
                    <option value="yuksek">Yüksek</option>
                    <option value="acil">Acil</option>
                  </Secim>
                </div>
              </div>

              <div>
                <Etiket htmlFor="mahalle_id">Mahalle</Etiket>
                <Secim id="mahalle_id" {...register("mahalle_id")}>
                  <option value="">Mahalle seçiniz</option>
                  {mahalleler?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.ad}
                    </option>
                  ))}
                </Secim>
                {errors.mahalle_id && <p className="mt-1 text-xs text-tehlike">{errors.mahalle_id.message}</p>}
              </div>

              <div>
                <Etiket htmlFor="adres_detay">Adres Detayı (İsteğe Bağlı)</Etiket>
                <Girdi id="adres_detay" placeholder="Cadde, sokak, kapı no..." {...register("adres_detay")} />
              </div>

              <div>
                <Etiket>Konum</Etiket>
                <HaritaSecici
                  enlem={konum.enlem}
                  boylam={konum.boylam}
                  onDegistir={(enlem, boylam) => setKonum({ enlem, boylam })}
                />
              </div>

              <div>
                <Etiket>Ekler (Fotoğraf, Video, Ses, Belge)</Etiket>
                <DosyaSecici dosyalar={dosyalar} onDegistir={setDosyalar} />
              </div>

              <Dugme type="submit" varyant="birincil" boyut="buyuk" className="w-full" disabled={gonderiliyor}>
                {gonderiliyor ? "Gönderiliyor..." : "Talebi Gönder"}
              </Dugme>
            </form>
          </KartIcerik>
        </Kart>
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