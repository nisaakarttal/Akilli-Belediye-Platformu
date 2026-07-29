import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AnalitikKartiProps {
  ikon: LucideIcon;
  ikonSinifi?: string;
  baslik: string;
  aciklama?: string;
  /** Başlığın sağında gösterilen ek kontrol (ör. zaman filtresi butonları). */
  sagIcerik?: ReactNode;
  className?: string;
  children: ReactNode;
}

/**
 * Admin "Genel Bakış" sayfasındaki grafik ve istatistik bölümleri için
 * master seviye ortak başlık + çerçeve deseni.
 */
export function AnalitikKarti({
  ikon: Ikon,
  ikonSinifi = "text-birincil-500",
  baslik,
  aciklama,
  sagIcerik,
  className,
  children,
}: AnalitikKartiProps) {
  return (
    <div className={cn("rounded-3xl border border-kenarlik/80 bg-zemin/80 backdrop-blur-xl p-6 shadow-xl shadow-black/[0.02] transition-all duration-300", className)}>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-kenarlik/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-birincil-500/10 p-2 text-birincil-600 dark:text-birincil-400">
              <Ikon size={18} className={ikonSinifi} aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-metin">{baslik}</h2>
          </div>
          {aciklama && <p className="mt-1 ml-11 text-xs leading-relaxed text-metin-ikincil">{aciklama}</p>}
        </div>
        {sagIcerik}
      </div>
      <div className="pt-6">{children}</div>
    </div>
  );
}