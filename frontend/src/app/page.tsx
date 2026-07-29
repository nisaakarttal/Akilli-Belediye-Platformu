import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Ekran üstü (Above the fold) kritik bileşenler
import { Basli } from "@/components/layout/basli";
import { Altbilgi } from "@/components/layout/altbilgi";
import { Hero } from "@/components/home/hero";
import { BilgiKartlariBolumu } from "@/components/home/bilgi-kartlari-bolumu";
import { BolumIskeleti } from "@/components/home/bolum-iskeleti";

// Client Component üzerinden güvenli dynamic import
import { YuzenAsistanWrapper } from "@/components/ai/yuzen-asistan-wrapper";

// Sunucu tarafı optimize edilmiş dinamik bölüm yüklemeleri
const HaberlerBolumu = dynamic(() =>
  import("@/components/home/haberler-bolumu").then((m) => m.HaberlerBolumu)
);

const DuyurularBolumu = dynamic(() =>
  import("@/components/home/duyurular-bolumu").then((m) => m.DuyurularBolumu)
);

const EtkinliklerBolumu = dynamic(() =>
  import("@/components/home/etkinlikler-bolumu").then((m) => m.EtkinliklerBolumu)
);

export const metadata: Metadata = {
  title: "Kapaklı Belediyesi | Akıllı Şehir Hizmet Platformu",
  description:
    "Kapaklı Belediyesi resmi web portalı. Dijital belediyecilik hizmetleri, güncel haberler, duyurular, etkinlikler ve yapay zekâ destekli Kent Asistanı.",
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
    <div className="relative flex min-h-screen flex-col bg-zemin text-metin antialiased selection:bg-birincil-500/20 selection:text-birincil-600">

      {/* Atmosferik Arka Plan Glow Efektleri */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-full max-w-7xl rounded-full bg-birincil-500/5 blur-[160px]" />
      </div>

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

      {/* Güvenli ve akıllı konumlandırılmış asistan bileşeni */}
      <YuzenAsistanWrapper />
    </div>
  );
}