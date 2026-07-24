import type { Metadata } from "next";
import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";

import { Saglayicilar } from "@/components/providers";

export const metadata: Metadata = {
  title: "Kapaklı Akıllı Belediye Platformu",
  description: "Kapaklı Belediyesi yapay zekâ destekli dijital belediyecilik platformu.",
};

export default function KokDuzen({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <Saglayicilar>{children}</Saglayicilar>
      </body>
    </html>
  );
}
