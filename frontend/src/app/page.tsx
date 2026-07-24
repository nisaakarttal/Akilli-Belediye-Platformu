import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Ekran üstü (Above the fold) temel bileşenler
import { Basli } from "@/components/layout/basli";
import { Altbilgi } from "@/components/layout/altbilgi";
import { Hero } from "@/components/home/hero";
import { BilgiKartlariBolumu } from "@/components/home/bilgi-kartlari-bolumu";

// Client Component üzerinden güvenli dynamic import
import { YuzenAsistanWrapper } from "@/components/ai/yuzen-asistan-wrapper";

// Server-side lazy loading (ssr: false OLMADAN)
const HaberlerBolumu = dynamic(
  () => import("@/components/home/haberler-bolumu").then((m) => m.HaberlerBolumu)
);

const DuyurularBolumu = dynamic(
  () => import("@/components/home/duyurular-bolumu").then((m) => m.DuyurularBolumu)
);

const EtkinliklerBolumu = dynamic(
  () => import("@/components/home/etkinlikler-bolumu").then((m) => m.EtkinliklerBolumu)
);

export const metadata: Metadata = {
  title: "Kapaklı Belediyesi | Akıllı Şehir Hizmet Platformu",
  description:
    "Kapaklı Belediyesi resmi web portalı. Dijital belediyecilik hizmetleri, güncel haberler, duyurular, etkinlikler ve yapay zeka destekli Kent Asistanı.",
  keywords: ["Kapaklı Belediyesi", "Akıllı Belediye", "Tekirdağ Kapaklı", "E-Belediye", "Kent Asistanı"],
  openGraph: {
    title: "Kapaklı Belediyesi | Akıllı Şehir Hizmet Platformu",
    description: "Kapaklı Belediyesi dijital hizmet portalı ve güncel duyurular.",
    url: "https://kapakli.bel.tr",
    siteName: "Kapaklı Belediyesi",
    locale: "tr_TR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AnaSayfa() {
  return (
    <div className="flex min-h-screen flex-col bg-arkaplan text-metin-birincil antialiased selection:bg-birincil-500 selection:text-beyaz">
      <Basli />

      <main id="ana-icerik" className="flex-1">
        <Hero />
        <BilgiKartlariBolumu />

        <Suspense fallback={<BolumIskeleti />}>
          <HaberlerBolumu />
        </Suspense>

        <Suspense fallback={<BolumIskeleti />}>
          <DuyurularBolumu />
        </Suspense>

        <Suspense fallback={<BolumIskeleti />}>
          <EtkinliklerBolumu />
        </Suspense>
      </main>

      <Altbilgi />

      {/* Güvenli yüklenen asistan */}
      <YuzenAsistanWrapper />
    </div>
  );
}

function BolumIskeleti() {
  return (
    <div className="w-full py-16 px-4 max-w-7xl mx-auto animate-pulse">
      <div className="h-8 w-48 bg-metin-ikincil/10 rounded-md mb-8 mx-auto" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-64 bg-metin-ikincil/10 rounded-2xl" />
        <div className="h-64 bg-metin-ikincil/10 rounded-2xl" />
        <div className="h-64 bg-metin-ikincil/10 rounded-2xl" />
      </div>
    </div>
  );
}