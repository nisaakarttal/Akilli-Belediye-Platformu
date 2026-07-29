import { Check, Clock } from "lucide-react";

import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { tarihSaatFormatla } from "@/lib/tarih";
import { cn } from "@/lib/utils";
import type { DurumGecmisiKaydi } from "@/types";

export function ZamanTuneli({ gecmis }: { gecmis: DurumGecmisiKaydi[] }) {
  if (gecmis.length === 0) {
    return <p className="text-sm text-metin-ikincil">Henüz bir durum geçmişi bulunmuyor.</p>;
  }

  return (
    <ol className="space-y-6">
      {gecmis.map((kayit, i) => {
        const sonMu = i === gecmis.length - 1;
        return (
          <li key={kayit.id} className="relative flex gap-4 pl-1">
            {!sonMu && (
              <span className="absolute left-[15px] top-8 h-[calc(100%-0.5rem)] w-0.5 bg-kenarlik" aria-hidden="true" />
            )}
            <span
              className={cn(
                "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                sonMu ? "bg-birincil-600 text-white" : "bg-black/10 text-metin-ikincil dark:bg-white/10"
              )}
              aria-hidden="true"
            >
              {sonMu ? <Clock size={16} /> : <Check size={16} />}
            </span>
            <div className="flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <DurumRozeti durum={kayit.yeni_durum} />
                <span className="text-xs text-metin-ikincil">{tarihSaatFormatla(kayit.olusturulma_tarihi)}</span>
              </div>
              {kayit.aciklama && <p className="mt-1 text-sm text-metin-ikincil">{kayit.aciklama}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
