import { Bell, CalendarDays, ChevronRight, Newspaper, ArrowUpRight, Filter } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { DuyurularBolumu } from "@/components/home/duyurular-bolumu";
import { EtkinliklerBolumu } from "@/components/home/etkinlikler-bolumu";
import { HaberlerBolumu } from "@/components/home/haberler-bolumu";
import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { VURGU_ROZET_SINIFLARI, type VurguRengi } from "@/constants/vurgu";
import { cn } from "@/lib/utils";

interface OneCikanBaslik {
  ikon: LucideIcon;
  vurgu: VurguRengi;
  etiket: string;
  deger: string;
  hedefId: string;
}

const ONE_CIKAN_BASLIKLAR: OneCikanBaslik[] = [
  { ikon: Newspaper, vurgu: "birincil", etiket: "Güncel Haberler", deger: "Sürekli Güncellenir", hedefId: "#haberler" },
  { ikon: Bell, vurgu: "uyari", etiket: "Resmî Duyurular", deger: "Anlık Bilgilendirme", hedefId: "#duyurular" },
  { ikon: CalendarDays, vurgu: "basarili", etiket: "Etkinlikler", deger: "Yaklaşan Programlar", hedefId: "#etkinlikler" },
];

export default function DuyurularSayfasi() {
  return (
    <>
      <Basli />

      <main className="bg-zemin selection:bg-birincil-500/20 selection:text-birincil-600">
        {/* Master Seviye Hero Alanı */}
        <section className="relative overflow-hidden border-b border-kenarlik bg-gradient-to-b from-zemin via-birincil-50/20 to-zemin dark:via-birincil-950/10">
          {/* Atmosferik Arka Plan Efektleri */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full bg-birincil-500/10 blur-[120px] dark:bg-birincil-500/5" />
            <div className="absolute top-1/2 left-[-10%] h-[400px] w-[400px] rounded-full bg-ikincil-500/10 blur-[100px] dark:bg-ikincil-500/5" />
          </div>

          <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-24">

            {/* Sol İçerik Grubu */}
            <div className="max-w-3xl">
              <nav className="mb-6 flex items-center gap-2 text-sm text-metin-ikincil" aria-label="Meta yolu">
                <Link href="/" className="transition-colors hover:text-metin hover:underline underline-offset-4">
                  Ana Sayfa
                </Link>
                <ChevronRight className="h-4 w-4 text-metin-ikincil/60" aria-hidden="true" />
                <span className="font-medium text-metin">Duyurular &amp; Haberler</span>
              </nav>

              <div className="inline-flex items-center gap-2 rounded-full border border-birincil-500/25 bg-birincil-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-birincil-600 shadow-sm dark:border-birincil-400/20 dark:bg-birincil-400/10 dark:text-birincil-400">
                <Bell className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
                <span>Kurumsal İletişim Ağı</span>
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-metin sm:text-5xl lg:text-6xl text-balance">
                Belediye Gündemi,{" "}
                <span className="block bg-gradient-to-r from-birincil-600 via-birincil-500 to-ikincil-500 bg-clip-text text-transparent pb-1">
                  Tüm Gelişmeler Tek Yerde
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg font-normal leading-relaxed text-metin-ikincil">
                Şehrimizin dönüşümüne dair en güncel haberleri, resmi duyuruları, kültür-sanat etkinliklerini ve belediye projelerini şeffaf bir biçimde keşfedin.
              </p>

              {/* Hızlı Erişim Çubuğu */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#haberler"
                  className="inline-flex items-center gap-2 rounded-xl bg-birincil-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-birincil-600/25 transition-all duration-200 hover:bg-birincil-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Newspaper className="h-4 w-4" />
                  Haberleri Keşfet
                </a>
                <a
                  href="#etkinlikler"
                  className="inline-flex items-center gap-2 rounded-xl border border-kenarlik bg-zemin/50 px-5 py-3 text-sm font-semibold text-metin shadow-sm transition-all duration-200 hover:bg-kenarlik/40 hover:border-metin-ikincil/30"
                >
                  <CalendarDays className="h-4 w-4 text-metin-ikincil" />
                  Etkinlik Takvimi
                </a>
              </div>
            </div>

            {/* Sağ Öne Çıkan Başlık Kartları (Master Seviye Etkileşim) */}
            <div className="grid w-full max-w-md gap-3.5 sm:grid-cols-3 lg:grid-cols-1">
              {ONE_CIKAN_BASLIKLAR.map(({ ikon: Ikon, vurgu, etiket, deger, hedefId }) => (
                <a
                  key={etiket}
                  href={hedefId}
                  className="group relative flex items-center justify-between rounded-2xl border border-kenarlik/80 bg-zemin/60 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-birincil-500/40 hover:bg-zemin hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={cn("rounded-xl p-3 transition-transform duration-300 group-hover:scale-110", VURGU_ROZET_SINIFLARI[vurgu])}>
                      <Ikon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-metin-ikincil">{etiket}</p>
                      <p className="text-sm font-bold text-metin mt-0.5">{deger}</p>
                    </div>
                  </div>
                  <div className="rounded-lg p-2 text-metin-ikincil opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2">
                    <ArrowUpRight className="h-4 w-4 text-birincil-600" />
                  </div>
                </a>
              ))}
            </div>

          </div>
        </section>

        {/* Ana İçerik Akışı (Modüler Bölümler) */}
        <section id="haberler" className="mx-auto max-w-7xl space-y-24 px-4 py-16 sm:px-6 scroll-mt-12">
          <div className="relative">
            <HaberlerBolumu />
          </div>
          <div id="duyurular" className="scroll-mt-12">
            <DuyurularBolumu />
          </div>
          <div id="etkinlikler" className="scroll-mt-12">
            <EtkinliklerBolumu />
          </div>
        </section>
      </main>

      <Altbilgi />
    </>
  );
}