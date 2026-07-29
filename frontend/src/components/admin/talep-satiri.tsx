import { Building, Calendar, ChevronRight, Tag } from "lucide-react";
import Link from "next/link";

import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
import { Kart, KartIcerik } from "@/components/ui/card";
import { DURUM_VURGU_SINIFLARI } from "@/constants/durum";
import { tarihFormatla } from "@/lib/tarih";
import { cn } from "@/lib/utils";
import type { TalepListe } from "@/types";

interface AdminTalepSatiriProps {
  talep: TalepListe;
}

/** Admin "Talep & Şikâyet Yönetimi" listesindeki tek bir satır. */
export function AdminTalepSatiri({ talep }: AdminTalepSatiriProps) {
  return (
    <Link
      href={`/admin/talepler/${talep.id}`}
      className="group block"
      aria-label={`${talep.baslik} talebinin detayını görüntüle`}
    >
      <Kart className="relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        <div
          className={cn("absolute left-0 top-0 h-full w-1.5 transition-all group-hover:w-2", DURUM_VURGU_SINIFLARI[talep.durum])}
          aria-hidden="true"
        />

        <KartIcerik className="flex flex-wrap items-center justify-between gap-4 p-4 pl-6 sm:p-5 sm:pl-6">
          <div className="min-w-[260px] flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded border border-birincil-600/20 bg-birincil-600/10 px-2 py-0.5 font-mono text-[11px] font-black tracking-wider text-birincil-600">
                <Tag size={10} aria-hidden="true" /> #{talep.takip_no}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-medium text-metin-ikincil">
                <Calendar size={11} className="text-birincil-400" aria-hidden="true" />
                {tarihFormatla(talep.olusturulma_tarihi)}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-metin transition-colors group-hover:text-birincil-600">
              {talep.baslik}
            </h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-metin-ikincil">
              <span className="flex items-center gap-1 font-semibold text-metin">
                <Building size={12} className="text-birincil-500" aria-hidden="true" />
                {talep.kategori.ad}
              </span>
              <span aria-hidden="true">•</span>
              <span>{talep.mahalle.ad}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end gap-1.5">
              <DurumRozeti durum={talep.durum} />
              <OncelikRozeti oncelik={talep.oncelik} />
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-birincil-600/10 text-birincil-600 transition-all group-hover:bg-birincil-600 group-hover:text-white">
              <ChevronRight size={18} aria-hidden="true" />
            </div>
          </div>
        </KartIcerik>
      </Kart>
    </Link>
  );
}
