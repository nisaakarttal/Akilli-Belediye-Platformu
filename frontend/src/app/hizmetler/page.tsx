import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  ClipboardList,
  MapPinned,
  Megaphone,
  MessageSquarePlus,
  Newspaper,
  UserRound,
} from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { Card } from "@/components/ui/card";

const HIZMETLER = [
  {
    baslik: "Talep Oluştur",
    aciklama: "Belediyeye yeni bir talep, şikâyet veya öneri iletin.",
    href: "/panel/talep-olustur",
    ikon: MessageSquarePlus,
    vurgu: true,
  },
  {
    baslik: "Taleplerim",
    aciklama: "Daha önce oluşturduğunuz talepleri ve güncel durumlarını takip edin.",
    href: "/panel/taleplerim",
    ikon: ClipboardList,
  },
  {
    baslik: "Şehir Haritası",
    aciklama: "Talep noktalarını ve belediye ile ilgili konumsal bilgileri haritada görüntüleyin.",
    href: "/panel/harita",
    ikon: MapPinned,
  },
  {
    baslik: "Bildirimler",
    aciklama: "Talepleriniz ve belediye işlemlerinizle ilgili güncel bildirimleri görüntüleyin.",
    href: "/panel/bildirimler",
    ikon: Bell,
  },
  {
    baslik: "Duyurular",
    aciklama: "Belediyenin güncel duyuru ve bilgilendirmelerine ulaşın.",
    href: "/duyurular",
    ikon: Megaphone,
  },
  {
    baslik: "Haberler",
    aciklama: "Kapaklı Belediyesi ile ilgili son haberleri inceleyin.",
    href: "/haberler",
    ikon: Newspaper,
  },
  {
    baslik: "Etkinlikler",
    aciklama: "Yaklaşan belediye etkinliklerini ve tarihlerini görüntüleyin.",
    href: "/etkinlikler",
    ikon: CalendarDays,
  },
  {
    baslik: "Profilim",
    aciklama: "Hesap ve iletişim bilgilerinizi görüntüleyin ve yönetin.",
    href: "/panel/profil",
    ikon: UserRound,
  },
] as const;

export default function HizmetlerSayfasi() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNavbar />

      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-primary-50/70 to-background">
          <div className="container py-12 sm:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
                Dijital Belediye Hizmetleri
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Hizmetler
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Talep oluşturma ve takip işlemlerinden duyuru, haber ve etkinliklere kadar
                platformda kullanabileceğiniz belediye hizmetlerine tek noktadan ulaşın.
              </p>
            </div>
          </div>
        </section>

        <section className="container py-10 sm:py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {HIZMETLER.map((hizmet) => {
              const Ikon = hizmet.ikon;

              return (
                <Link key={hizmet.href} href={hizmet.href} className="group block h-full">
                  <Card
                    className={`flex h-full min-h-48 flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${
                      hizmet.vurgu ? "border-primary-200 bg-primary-50/40" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Ikon className="h-5 w-5" aria-hidden />
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary-700" aria-hidden />
                    </div>

                    <div className="mt-5">
                      <h2 className="font-display text-base font-semibold text-foreground">
                        {hizmet.baslik}
                      </h2>
                      <p className="mt-2 text-sm leading-5 text-muted-foreground">
                        {hizmet.aciklama}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-muted/40 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <h2 className="font-display text-base font-semibold text-foreground">
                Aradığınız hizmeti bulamadınız mı?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Belediyeye doğrudan talep oluşturarak ilgili birime iletebilirsiniz.
              </p>
            </div>
            <Link
              href="/panel/talep-olustur"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:underline sm:mt-0"
            >
              Yeni talep oluştur
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
