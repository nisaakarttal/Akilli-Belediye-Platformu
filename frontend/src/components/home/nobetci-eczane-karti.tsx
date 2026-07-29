import { Clock, MapPin, Phone, Pill } from "lucide-react";

import { Kart, KartIcerik } from "@/components/ui/card";
import { NOBETCI_ECZANELER } from "@/constants/anasayfa";

export function NobetciEczaneKarti() {
  return (
    <Kart className="transition-shadow hover:shadow-xl">
      <KartIcerik className="pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Pill className="text-birincil-500" size={20} aria-hidden="true" />
          <h3 className="font-semibold text-metin">Nöbetçi Eczaneler</h3>
        </div>

        <div className="space-y-3">
          {NOBETCI_ECZANELER.map((eczane) => (
            <div key={eczane.ad} className="rounded-xl bg-black/5 p-3 text-sm dark:bg-white/5">
              <p className="font-medium text-metin">{eczane.ad}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-metin-ikincil">
                <MapPin size={12} aria-hidden="true" /> {eczane.adres}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-metin-ikincil">
                <Phone size={12} aria-hidden="true" /> {eczane.telefon}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-metin-ikincil">
          <Clock size={12} aria-hidden="true" /> Güncel nöbetçi eczane bilgisi için 182 SABİM&apos;i arayabilirsiniz.
        </p>
      </KartIcerik>
    </Kart>
  );
}
