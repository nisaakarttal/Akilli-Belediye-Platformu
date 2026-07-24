import { Clock, MapPin, Phone, Pill } from "lucide-react";

import { Kart, KartIcerik } from "@/components/ui/card";

interface NobetciEczane {
  ad: string;
  mahalle: string;
  adres: string;
  telefon: string;
}

// Not: Aşağıdaki liste örnek/temsili veridir. Güncel nöbetçi eczane bilgisi
// üretim ortamında Tekirdağ Eczacılar Odası'nın günlük nöbet listesinden
// otomatik olarak çekilecektir.
const NOBETCI_ECZANELER: NobetciEczane[] = [
  {
    ad: "Kapaklı Eczanesi",
    mahalle: "Atatürk Mahallesi",
    adres: "Atatürk Mah. Cumhuriyet Cad. No: 24",
    telefon: "0282 891 12 34",
  },
  {
    ad: "Yeni Nesil Eczanesi",
    mahalle: "Cumhuriyet Mahallesi",
    adres: "Cumhuriyet Mah. Belediye Cad. No: 7",
    telefon: "0282 891 56 78",
  },
];

export function NobetciEczaneKarti() {
  return (
    <Kart>
      <KartIcerik className="pt-6">
        <div className="mb-3 flex items-center gap-2">
          <Pill className="text-birincil-500" size={20} />
          <h3 className="font-semibold text-metin">Nöbetçi Eczaneler</h3>
        </div>

        <div className="space-y-3">
          {NOBETCI_ECZANELER.map((eczane) => (
            <div key={eczane.ad} className="rounded-xl bg-black/5 p-3 text-sm dark:bg-white/5">
              <p className="font-medium text-metin">{eczane.ad}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-metin-ikincil">
                <MapPin size={12} /> {eczane.adres}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-metin-ikincil">
                <Phone size={12} /> {eczane.telefon}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-metin-ikincil">
          <Clock size={12} /> Güncel nöbetçi eczane bilgisi için 182 SABİM&apos;i arayabilirsiniz.
        </p>
      </KartIcerik>
    </Kart>
  );
}
