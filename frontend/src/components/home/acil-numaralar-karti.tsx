import { Phone, Siren } from "lucide-react";

import { Kart, KartIcerik } from "@/components/ui/card";
import { ACIL_NUMARALAR } from "@/constants/anasayfa";

export function AcilNumaralarKarti() {
  return (
    <Kart className="border-kenarlik/80 bg-zemin/80 backdrop-blur-xl shadow-xl shadow-black/[0.02] transition-all duration-300 hover:border-tehlike/40 hover:shadow-2xl">
      <KartIcerik className="py-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="rounded-xl bg-tehlike/10 p-2 text-tehlike">
            <Siren size={20} aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold tracking-tight text-metin">Acil Durum Numaraları</h3>
            <p className="text-[11px] font-medium text-metin-ikincil">7/24 kesintisiz ulaşabileceğiniz hatlar</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {ACIL_NUMARALAR.map((satir) => (
            <a
              key={satir.numara}
              href={`tel:${satir.numara}`}
              className="group/item flex items-center justify-between rounded-xl border border-kenarlik/70 bg-zemin/60 backdrop-blur-md px-3.5 py-2.5 text-sm transition-all duration-200 hover:border-tehlike/40 hover:bg-tehlike/5 hover:shadow-sm"
              aria-label={`${satir.ad} — ${satir.numara} numarasını ara`}
            >
              <span className="text-xs font-semibold text-metin-ikincil transition-colors group-hover/item:text-metin">{satir.ad}</span>
              <span className="flex items-center gap-1.5 font-mono text-xs font-extrabold text-tehlike">
                <Phone size={13} className="transition-transform duration-200 group-hover/item:scale-110" aria-hidden="true" />
                {satir.numara}
              </span>
            </a>
          ))}
        </div>
      </KartIcerik>
    </Kart>
  );
}