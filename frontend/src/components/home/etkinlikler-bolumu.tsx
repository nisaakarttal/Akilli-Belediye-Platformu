import { CalendarDays, MapPin } from "lucide-react";

import { BolumBasligi } from "@/components/home/bolum-basligi";
import { FadeInStagger, StaggerOgesi } from "@/components/ui/animasyon";
import { Kart, KartIcerik } from "@/components/ui/card";
import { ETKINLIKLER } from "@/constants/anasayfa";

const ETKINLIKLER_BASLIK_ID = "etkinlikler-baslik";

export function EtkinliklerBolumu() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6" aria-labelledby={ETKINLIKLER_BASLIK_ID}>
      <BolumBasligi
        id={ETKINLIKLER_BASLIK_ID}
        ikon={CalendarDays}
        baslik="Yaklaşan Etkinlikler"
        aciklama="Kapaklı'da bu ay neler oluyor?"
      />

      <FadeInStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ETKINLIKLER.map((etkinlik) => (
          <StaggerOgesi key={etkinlik.baslik}>
            <Kart className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <KartIcerik className="pt-6">
                <h3 className="mb-2 font-semibold text-metin">{etkinlik.baslik}</h3>
                <div className="mb-1 flex items-center gap-2 text-xs text-metin-ikincil">
                  <CalendarDays size={14} aria-hidden="true" /> {etkinlik.tarih}
                </div>
                <div className="mb-3 flex items-center gap-2 text-xs text-metin-ikincil">
                  <MapPin size={14} aria-hidden="true" /> {etkinlik.yer}
                </div>
                <p className="text-sm text-metin-ikincil">{etkinlik.aciklama}</p>
              </KartIcerik>
            </Kart>
          </StaggerOgesi>
        ))}
      </FadeInStagger>
    </section>
  );
}
