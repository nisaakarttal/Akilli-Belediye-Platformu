import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface BolumBasligiProps {
  ikon: LucideIcon;
  baslik: string;
  aciklama?: string;
  sag?: ReactNode;
  /** Üst bölümün `aria-labelledby` ile referans verebilmesi için başlık `id`'si. */
  id?: string;
}

export function BolumBasligi({ ikon: Ikon, baslik, aciklama, sag, id }: BolumBasligiProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-birincil-500/20 bg-birincil-500/10 text-birincil-600 dark:text-birincil-400 backdrop-blur-md shadow-sm"
          aria-hidden="true"
        >
          <Ikon size={21} />
        </span>
        <div className="space-y-0.5">
          <h2 id={id} className="text-xl font-bold tracking-tight text-metin sm:text-2xl">
            {baslik}
          </h2>
          {aciklama && <p className="text-xs sm:text-sm font-medium text-metin-ikincil">{aciklama}</p>}
        </div>
      </div>
      {sag && <div className="flex items-center gap-2">{sag}</div>}
    </div>
  );
}