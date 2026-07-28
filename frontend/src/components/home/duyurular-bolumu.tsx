import { AlertCircle, ArrowRight, BellRing, CalendarDays, Megaphone } from "lucide-react";

import { BolumBasligi } from "@/components/home/bolum-basligi";
import { Kart, KartIcerik } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DuyuruOgesi {
  baslik: string;
  aciklama: string;
  tarih: string;
  onemli?: boolean;
}

const DUYURULAR: DuyuruOgesi[] = [
  {
    baslik: "29 Ekim Cumhuriyet Bayramı Kutlama Programı",
    aciklama:
      "Cumhuriyetimizin kuruluş yıl dönümü kapsamında düzenlenecek tören ve etkinlik programı açıklandı.",
    tarih: "20 Temmuz 2026",
  },
  {
    baslik: "Su Kesintisi Bilgilendirmesi",
    aciklama:
      "Altyapı yenileme çalışmaları nedeniyle 24 Temmuz Cuma günü 09:00-17:00 saatleri arasında Fatih ve Yeni Mahalle'de su kesintisi yaşanacaktır.",
    tarih: "19 Temmuz 2026",
    onemli: true,
  },
  {
    baslik: "Fen İşleri Müdürlüğü Yol Bakım Çalışması",
    aciklama:
      "Namık Kemal Mahallesi ana cadde üzerinde asfalt yenileme çalışması nedeniyle geçici trafik düzenlemesi uygulanacaktır.",
    tarih: "15 Temmuz 2026",
  },
  {
    baslik: "Emlak Vergisi 2. Taksit Ödeme Süresi",
    aciklama:
      "2026 yılı emlak vergisi ikinci taksit son ödeme tarihi 30 Kasım 2026'dır. Ödemeler belediye veznelerinden veya online tahsilat sisteminden yapılabilir.",
    tarih: "10 Temmuz 2026",
  },
];

export function DuyurularBolumu() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <BolumBasligi
        ikon={Megaphone}
        baslik="Duyurular"
        aciklama="Belediyemize ait güncel resmî duyuruları buradan takip edebilirsiniz."
      />

      <div className="mt-10 space-y-5">
        {DUYURULAR.map((duyuru) => (
          <Kart
            key={duyuru.baslik}
            className="group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <KartIcerik className="p-0">
              <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl",
                    duyuru.onemli ? "bg-tehlike/10 text-tehlike" : "bg-birincil-600/10 text-birincil-600"
                  )}
                  aria-hidden="true"
                >
                  {duyuru.onemli ? <AlertCircle className="h-7 w-7" /> : <BellRing className="h-7 w-7" />}
                </div>

                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    {duyuru.onemli && (
                      <span className="rounded-full bg-tehlike/10 px-3 py-1 text-xs font-semibold text-tehlike">
                        Önemli Duyuru
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-metin transition-colors group-hover:text-birincil-600">
                      {duyuru.baslik}
                    </h3>
                  </div>

                  <p className="leading-7 text-metin-ikincil">{duyuru.aciklama}</p>

                  <div className="mt-5 flex items-center gap-2 text-sm text-metin-ikincil">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    {duyuru.tarih}
                  </div>
                </div>

                <div className="hidden md:flex">
                  <div className="rounded-full bg-black/5 p-3 transition-all duration-300 group-hover:bg-birincil-600 group-hover:text-white dark:bg-white/10">
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "h-1 w-full transition-all duration-500",
                  duyuru.onemli
                    ? "bg-gradient-to-r from-tehlike to-amber-400"
                    : "bg-gradient-to-r from-birincil-600 to-ikincil-500"
                )}
              />
            </KartIcerik>
          </Kart>
        ))}
      </div>
    </section>
  );
}
