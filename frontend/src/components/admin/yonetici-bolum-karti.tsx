import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface YoneticiBolumKartiProps {
  ikon: LucideIcon;
  baslik: string;
  /** Kartın üstündeki ince renkli şeridin arka plan sınıfı (ör. "bg-basarili"). */
  ustCubukSinifi: string;
  sagIcerik?: ReactNode;
  children: ReactNode;
}

/**
 * Talep detay sayfasındaki bölüm kartlarının (Personel Atama, Konum, Ekler,
 * Zaman Tüneli) ortak "renkli üst şerit + başlık + içerik" çerçevesi.
 */
export function YoneticiBolumKarti({ ikon: Ikon, baslik, ustCubukSinifi, sagIcerik, children }: YoneticiBolumKartiProps) {
  return (
    <Kart className="overflow-hidden">
      <div className={cn("h-1.5 w-full", ustCubukSinifi)} aria-hidden="true" />
      <KartBasligi className="border-b border-kenarlik pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <KartBaslik className="flex items-center gap-2 text-lg">
            <Ikon size={20} className="text-birincil-500" aria-hidden="true" /> {baslik}
          </KartBaslik>
          {sagIcerik}
        </div>
      </KartBasligi>
      <KartIcerik className="pt-4">{children}</KartIcerik>
    </Kart>
  );
}
