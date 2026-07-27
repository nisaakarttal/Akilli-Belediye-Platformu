import { DuyurularBolumu } from "@/components/home/duyurular-bolumu";
import { EtkinliklerBolumu } from "@/components/home/etkinlikler-bolumu";
import { HaberlerBolumu } from "@/components/home/haberler-bolumu";
import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { Bell, CalendarDays, Newspaper, ChevronRight } from "lucide-react";

export default function DuyurularSayfasi() {
  return (
    <>
      <Basli />

      <main className="bg-arka-plan">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-br from-white via-slate-50 to-blue-50">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-blue-200 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan-200 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-3xl">

              {/* Breadcrumb */}
              <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                <span>Ana Sayfa</span>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-slate-700">
                  Duyurular & Haberler
                </span>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                <Bell className="h-4 w-4" />
                Güncel Bilgilendirmeler
              </span>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                Duyurular,
                <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Haberler ve Etkinlikler
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Belediyemize ait en güncel haberleri, resmi duyuruları,
                organizasyonları ve yaklaşan etkinlikleri tek bir sayfadan
                kolayca takip edebilirsiniz.
              </p>
            </div>

            {/* İstatistik Kartları */}
            <div className="grid w-full max-w-md gap-4 sm:grid-cols-3 lg:grid-cols-1">

              <div className="rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-100 p-3">
                    <Newspaper className="h-5 w-5 text-blue-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Güncel Haberler
                    </p>
                    <p className="font-semibold text-slate-800">
                      Sürekli Güncellenir
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-100 p-3">
                    <Bell className="h-5 w-5 text-amber-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Resmî Duyurular
                    </p>
                    <p className="font-semibold text-slate-800">
                      Anlık Bilgilendirme
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-3">
                    <CalendarDays className="h-5 w-5 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Etkinlikler
                    </p>
                    <p className="font-semibold text-slate-800">
                      Yaklaşan Programlar
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* İçerikler */}
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