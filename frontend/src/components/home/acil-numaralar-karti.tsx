import { Phone, Siren } from "lucide-react";

import { Kart, KartIcerik } from "@/components/ui/card";

const ACIL_NUMARALAR = [
  { ad: "Acil Çağrı Merkezi", numara: "112" },
  { ad: "Polis İmdat", numara: "155" },
  { ad: "İtfaiye", numara: "110" },
  { ad: "Su Arıza", numara: "185" },
  { ad: "Doğalgaz Arıza", numara: "187" },
  { ad: "AFAD", numara: "122" },
];

export function AcilNumaralarKarti() {
  return (
    <Kart>
      <KartIcerik className="pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Siren className="text-tehlike" size={20} />
          <h3 className="font-semibold text-metin">Acil Durum Numaraları</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ACIL_NUMARALAR.map((satir) => (
            <a
              key={satir.numara}
              href={`tel:${satir.numara}`}
              className="flex items-center justify-between rounded-xl bg-black/5 px-3 py-2 text-sm transition-colors hover:bg-tehlike/10 dark:bg-white/5"
            >
              <span className="text-metin-ikincil">{satir.ad}</span>
              <span className="flex items-center gap-1 font-semibold text-tehlike">
                <Phone size={12} /> {satir.numara}
              </span>
            </a>
          ))}
        </div>
      </KartIcerik>
    </Kart>
  );
}
