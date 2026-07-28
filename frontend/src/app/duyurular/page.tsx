import { Bell, CalendarDays, ChevronRight, Newspaper } from "lucide-react";

import { DuyurularBolumu } from "@/components/home/duyurular-bolumu";
import { EtkinliklerBolumu } from "@/components/home/etkinlikler-bolumu";
import { HaberlerBolumu } from "@/components/home/haberler-bolumu";
import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";

interface IstatistikKartVerisi {
  ikon: typeof Newspaper;
  renkSinifi: string;
  etiket: string;
  deger: string;
}

const ISTATISTIK_KARTLARI: IstatistikKartVerisi[] = [
  {
    ikon: Newspaper,
    renkSinifi: "bg-birincil-500/10 text-birincil-600",
    etiket: "Güncel Haberler",
    deger: "Sürekli Güncellenir",
  },
  {
    ikon: Bell,
    renkSinifi: "bg-uyari/10 text-amber-600",
    etiket: "Resmî Duyurular",
    deger: "Anlık Bilgilendirme",
  },
  {
    ikon: CalendarDays,
    renkSinifi: "bg-basarili/10 text-green-600",
    etiket: "Etkinlikler",
    deger: "Yaklaşan Programlar",
  },
];

export default function DuyurularSayfasi() {
  return (
    <>
      <Basli />

      <main className="bg-zemin">
        <section className="relative overflow-hidden border-b border-kenarlik bg-gradient-to-br from-white via-slate-50 to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
          <div className="absolute inset-0 opacity-40" aria-hidden="true">
            <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-birincil-200 blur-3xl dark:bg-birincil-900/40" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-200 blur-3xl dark:bg-cyan-900/30" />
          </div>

          <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <nav aria-label="Meta yol" className="mb-6 flex items-center gap-2 text-sm text-metin-ikincil">
                <span>Ana Sayfa</span>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium text-metin">Duyurular &amp; Haberler</span>
              </nav>

              <span className="inline-flex items-center gap-2 rounded-full border border-birincil-500/20 bg-birincil-500/10 px-4 py-2 text-sm font-semibold text-birincil-700 dark:text-birincil-300">
                <Bell className="h-4 w-4" aria-hidden="true" />
                Güncel Bilgilendirmeler
              </span>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-metin md:text-5xl">
                Duyurular,
                <span className="block bg-gradient-to-r from-birincil-600 to-ikincil-500 bg-clip-text text-transparent">
                  Haberler ve Etkinlikler
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-metin-ikincil">
                Belediyemize ait en güncel haberleri, resmi duyuruları, organizasyonları ve yaklaşan
                etkinlikleri tek bir sayfadan kolayca takip edebilirsiniz.
              </p>
            </div>

            <div className="grid w-full max-w-md gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {ISTATISTIK_KARTLARI.map(({ ikon: Ikon, renkSinifi, etiket, deger }) => (
                <div key={etiket} className="cam-kart rounded-2xl p-5">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl p-3 ${renkSinifi}`} aria-hidden="true">
                      <Ikon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-metin-ikincil">{etiket}</p>
                      <p className="font-semibold text-metin">{deger}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl space-y-20 px-4 py-12 sm:px-6">
          <HaberlerBolumu />
          <DuyurularBolumu />
          <EtkinliklerBolumu />
        </section>
      </main>

      <Altbilgi />
    </>
  );
}
