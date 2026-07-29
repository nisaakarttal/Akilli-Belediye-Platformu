import { AlertCircle, ArrowRight, BellRing, CalendarDays, Megaphone } from "lucide-react";

import { BolumBasligi } from "@/components/home/bolum-basligi";
import { FadeInStagger, StaggerOgesi } from "@/components/ui/animasyon";
import { Kart, KartIcerik } from "@/components/ui/card";
import { DUYURULAR } from "@/constants/anasayfa";

const DUYURULAR_BASLIK_ID = "duyurular-baslik";

export function DuyurularBolumu() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby={DUYURULAR_BASLIK_ID}>
      <BolumBasligi
        id={DUYURULAR_BASLIK_ID}
        ikon={Megaphone}
        baslik="Duyurular"
        aciklama="Belediyemize ait güncel resmî duyuruları buradan takip edebilirsiniz."
      />

      <FadeInStagger className="mt-8 space-y-5">
        {DUYURULAR.map((duyuru) => (
          <StaggerOgesi key={duyuru.baslik}>
            <Kart
              className={`group relative overflow-hidden border bg-zemin/80 backdrop-blur-xl shadow-xl shadow-black/[0.02] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                duyuru.onemli
                  ? "border-kenarlik/80 hover:border-tehlike/40"
                  : "border-kenarlik/80 hover:border-birincil-500/40"
              }`}
            >
              <KartIcerik className="p-0">
                <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center">

                  {/* Sol İkon */}
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105 ${
                      duyuru.onemli
                        ? "bg-tehlike/10 text-tehlike"
                        : "bg-birincil-500/10 text-birincil-600 dark:text-birincil-400"
                    }`}
                    aria-hidden="true"
                  >
                    {duyuru.onemli ? <AlertCircle className="h-7 w-7" /> : <BellRing className="h-7 w-7" />}
                  </div>

                  {/* İçerik */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {duyuru.onemli && (
                        <span className="inline-flex items-center rounded-full border border-tehlike/20 bg-tehlike/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-tehlike shadow-sm">
                          Önemli Duyuru
                        </span>
                      )}
                      <h3 className="text-xl font-bold tracking-tight text-metin transition-colors duration-200 group-hover:text-birincil-600 dark:group-hover:text-birincil-400">
                        {duyuru.baslik}
                      </h3>
                    </div>

                    <p className="text-sm font-medium leading-relaxed text-metin-ikincil sm:text-base">
                      {duyuru.aciklama}
                    </p>

                    <div className="flex items-center gap-1.5 pt-2 text-xs font-bold text-metin-ikincil">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      <span>{duyuru.tarih}</span>
                    </div>
                  </div>

                  {/* Sağ Ok */}
                  <div className="hidden md:flex shrink-0 pl-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-kenarlik/60 bg-black/5 dark:bg-white/5 text-metin-ikincil transition-all duration-300 group-hover:bg-birincil-600 group-hover:border-birincil-600 group-hover:text-white group-hover:shadow-lg">
                      <ArrowRight
                        className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>

                {/* Alt Çizgi İndikatörü */}
                <div
                  className={`absolute bottom-0 left-0 h-1 w-full opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:h-1.5 ${
                    duyuru.onemli
                      ? "bg-gradient-to-r from-tehlike to-uyari"
                      : "bg-gradient-to-r from-birincil-500 to-ikincil-500"
                  }`}
                  aria-hidden="true"
                />
              </KartIcerik>
            </Kart>
          </StaggerOgesi>
        ))}
      </FadeInStagger>
    </section>
  );
}