import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function BolumBasligi({
  ikon: Ikon,
  baslik,
  aciklama,
  sag,
}: {
  ikon: LucideIcon;
  baslik: string;
  aciklama?: string;
  sag?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-birincil-600/10 text-birincil-600">
          <Ikon size={20} />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-metin sm:text-2xl">{baslik}</h2>
          {aciklama && <p className="text-sm text-metin-ikincil">{aciklama}</p>}
        </div>
      </div>
      {sag}
    </div>
  );
}
