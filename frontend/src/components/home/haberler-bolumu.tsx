import { Newspaper } from "lucide-react";

import { BolumBasligi } from "@/components/home/bolum-basligi";
import { FadeInStagger, StaggerOgesi } from "@/components/ui/animasyon";
import { Kart, KartIcerik } from "@/components/ui/card";
import { HABERLER } from "@/constants/anasayfa";

const HABERLER_BASLIK_ID = "haberler-baslik";

export function HaberlerBolumu() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6" aria-labelledby={HABERLER_BASLIK_ID}>
      <BolumBasligi
        id={HABERLER_BASLIK_ID}
        ikon={Newspaper}
        baslik="Haberler"
        aciklama="Kapaklı Belediyesi'nden son gelişmeler"
      />

      <FadeInStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HABERLER.map((haber) => (
          <StaggerOgesi key={haber.baslik}>
            <Kart className="flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <KartIcerik className="flex flex-1 flex-col pt-6">
                <span className="mb-2 w-fit rounded-full bg-birincil-600/10 px-2.5 py-1 text-xs font-medium text-birincil-700 dark:text-birincil-300">
                  {haber.kategori}
                </span>
                <h3 className="mb-2 font-semibold leading-snug text-metin">{haber.baslik}</h3>
                <p className="mb-3 flex-1 text-sm text-metin-ikincil">{haber.ozet}</p>
                <span className="text-xs text-metin-ikincil">{haber.tarih}</span>
              </KartIcerik>
            </Kart>
          </StaggerOgesi>
        ))}
      </FadeInStagger>
    </section>
  );
}
