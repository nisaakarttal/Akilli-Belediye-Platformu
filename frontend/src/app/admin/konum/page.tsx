"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building, CheckCircle2, Globe, MapPin, RefreshCw } from "lucide-react";

import { IlceYonetimKarti } from "@/components/admin/ilce-yonetim-karti";
import { IstatistikKarti } from "@/components/admin/istatistik-karti";
import { MahalleYonetimKarti } from "@/components/admin/mahalle-yonetim-karti";
import { Dugme } from "@/components/ui/button";
import { Uyari } from "@/components/ui/uyari";
import { useAdminKonum } from "@/hooks/use-admin-konum";

export default function YoneticiKonumSayfasi() {
  const {
    ilceForm,
    setIlceForm,
    mahalleForm,
    setMahalleForm,
    mahalleArama,
    setMahalleArama,
    seciliIlceFiltresi,
    setSeciliIlceFiltresi,
    hata,
    basari,
    ilceler,
    ilcelerYukleniyor,
    mahalleler,
    mahallelerYukleniyor,
    ilceEkleMutation,
    mahalleEkleMutation,
    handleIlceEkle,
    handleMahalleEkle,
    verileriYenile,
    filtrelenmisMahalleler,
  } = useAdminKonum();

  return (
    <div className="space-y-8">
      {/* İstatistik özeti */}
      <div className="grid gap-4 sm:grid-cols-3">
        <IstatistikKarti ikon={Building} etiket="Tanımlı İlçeler" deger={ilceler.length} vurgu="birincil" aciklama="Coğrafi alanlar tanımlı" />
        <IstatistikKarti ikon={MapPin} etiket="Toplam Mahalle" deger={mahalleler.length} vurgu="ikincil" aciklama="Aktif yerleşim bölgesi" />
        <IstatistikKarti ikon={Globe} etiket="Geocoding Servisi" deger="Çevrimiçi" vurgu="basarili" aciklama="GPS koordinat doğrulama aktif" />
      </div>

      {/* Başlık ve yenileme eylemi */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-metin sm:text-3xl">Konum Yönetimi</h1>
          <p className="mt-1 text-sm text-metin-ikincil">
            Saha ekipleri ve vatandaş bildirimleri için ilçe ve mahalle sınırlarını yapılandırın.
          </p>
        </div>

        <Dugme varyant="anahat" boyut="kucuk" onClick={verileriYenile} className="gap-2 self-start sm:self-auto">
          <RefreshCw size={14} aria-hidden="true" />
          <span>Verileri Yenile</span>
        </Dugme>
      </div>

      {/* Bildirim alanı */}
      <AnimatePresence mode="wait">
        {hata && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Uyari tur="hata">{hata}</Uyari>
          </motion.div>
        )}
        {basari && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Uyari tur="basari">{basari}</Uyari>
          </motion.div>
        )}
      </AnimatePresence>

      {/* İlçe / Mahalle ikili grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <IlceYonetimKarti
          ilceler={ilceler}
          ilcelerYukleniyor={ilcelerYukleniyor}
          form={ilceForm}
          onFormDegistir={setIlceForm}
          kaydediliyorMu={ilceEkleMutation.isPending}
          onSubmit={handleIlceEkle}
        />

        <MahalleYonetimKarti
          ilceler={ilceler}
          mahallelerYukleniyor={mahallelerYukleniyor}
          filtrelenmisMahalleler={filtrelenmisMahalleler}
          form={mahalleForm}
          onFormDegistir={setMahalleForm}
          kaydediliyorMu={mahalleEkleMutation.isPending}
          onSubmit={handleMahalleEkle}
          arama={mahalleArama}
          onAramaDegistir={setMahalleArama}
          seciliIlceFiltresi={seciliIlceFiltresi}
          onIlceFiltresiDegistir={setSeciliIlceFiltresi}
        />
      </div>
    </div>
  );
}
