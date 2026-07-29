import type { Metadata, Viewport } from "viewport"; // veya Next metadata standartları
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";

import { Saglayicilar } from "@/components/providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://kapakli.bel.tr"),
  title: {
    default: "Kapaklı Akıllı Belediye Platformu | Dijital Çözüm Masası",
    template: "%s | Kapaklı Akıllı Belediye Platformu",
  },
  description: "Kapaklı Belediyesi yapay zekâ destekli yeni nesil dijital belediyecilik, şikâyet ve akıllı çözüm masası platformu.",
  keywords: ["Kapaklı Belediyesi", "Akıllı Belediye", "Çözüm Masası", "Şikâyet Bildir", "Tekirdağ Kapaklı"],
  authors: [{ name: "Kapaklı Belediyesi Bilgi İşlem Müdürlüğü" }],
  creator: "Kapaklı Belediyesi",
  publisher: "Kapaklı Belediyesi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://kapakli.bel.tr",
    title: "Kapaklı Akıllı Belediye Platformu",
    description: "Yapay zekâ destekli akıllı çözüm masası ve dijital belediyecilik hizmetleri.",
    siteName: "Kapaklı Akıllı Belediye",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kapaklı Akıllı Belediye Platformu",
    description: "Yapay zekâ destekli akıllı çözüm masası ve dijital belediyecilik hizmetleri.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function KokDuzen({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning className="scroll-smooth">
      <head />
      <body className="min-h-screen bg-zemin text-metin antialiased selection:bg-birincil-500/20 selection:text-birincil-600">
        <Saglayicilar>
          {children}
        </Saglayicilar>
      </body>
    </html>
  );
}