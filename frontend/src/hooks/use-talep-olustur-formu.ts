"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { dosyaTuruTahminEt } from "@/components/sikayet/dosya-yukleme";
import { KAPAKLI_MERKEZ_KOORDINATLARI } from "@/constants/konum";
import { apiHataMesaji } from "@/lib/api";
import { aiApi } from "@/lib/api/ai";
import { kategorilerApi, konumApi } from "@/lib/api/konum";
import { taleplerApi } from "@/lib/api/talepler";
import {
  TALEP_ACIKLAMA_MIN_UZUNLUK,
  TALEP_BASLIK_MIN_UZUNLUK,
  talepOlusturSemasi,
  type TalepOlusturFormu,
} from "@/lib/validasyon";
import type { AnalizYaniti } from "@/types";

interface KonumKoordinati {
  enlem: number;
  boylam: number;
}

/**
 * "Şikâyet / Talep Oluştur" sayfasının tüm form durumunu, yapay zekâ analiz
 * akışını ve gönderim mantığını kapsayan custom hook. Sayfa bileşenini (JSX)
 * durum yönetiminden ayırarak tek sorumluluk ilkesini (SRP) sağlar ve mantığı
 * bağımsız olarak test edilebilir hâle getirir.
 *
 * Not: İş mantığı, API çağrıları ve doğrulama kuralları orijinal sayfa ile
 * birebir aynıdır — yalnızca konum değiştirilmiştir.
 */
export function useTalepOlusturFormu() {
  const router = useRouter();

  const { data: kategoriler, isLoading: kategorilerYukleniyor } = useQuery({
    queryKey: ["kategoriler"],
    queryFn: kategorilerApi.listele,
  });
  const { data: mahalleler, isLoading: mahallelerYukleniyor } = useQuery({
    queryKey: ["mahalleler"],
    queryFn: () => konumApi.mahalleleriListele(),
  });

  const [konum, setKonum] = useState<KonumKoordinati>(KAPAKLI_MERKEZ_KOORDINATLARI);
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
    if (
      !baslik ||
      !aciklama ||
      baslik.length < TALEP_BASLIK_MIN_UZUNLUK ||
      aciklama.length < TALEP_ACIKLAMA_MIN_UZUNLUK
    ) {
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
    setValue("oncelik", aiSonucu.onerilen_oncelik);
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

  return {
    register,
    errors,
    handleGonder: handleSubmit(gonder),
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
  };
}
