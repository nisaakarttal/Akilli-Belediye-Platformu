import Link from "next/link";
import {
  Droplets,
  Home as HomeIcon,
  Trash2,
  FileText,
  Heart,
  ArrowRight,
  ChevronRight,
  MapPin,
  Calendar,
  Megaphone,
  Landmark,
  CalendarCheck,
  BadgeCheck,
} from "lucide-react";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// NOT: "Duyurular", "Haberler" ve "Etkinlikler" için backend'de karşılık gelen bir
// endpoint bulunmuyor (yalnızca talepler, kategoriler, kullanıcılar, bildirimler,
// admin istatistikleri mevcut). Bu bölümler bilinçli olarak örnek/yer tutucu içerikle
// hazırlandı — ileride bir /haberler, /duyurular, /etkinlikler endpointi eklendiğinde
// TanStack Query ile buradaki mock dizilerin yerine gerçek veri bağlanabilir.

const HIZLI_ISLEMLER = [
  { ikon: Droplets, etiket: "Su Faturası Ödeme", href: "/e-belediye/su-faturasi" },
  { ikon: HomeIcon, etiket: "Emlak Vergisi", href: "/e-belediye/emlak-vergisi" },
  { ikon: Trash2, etiket: "Çevre Temizlik", href: "/e-belediye/cevre-temizlik" },
  { ikon: FileText, etiket: "İmar Durumu", href: "/e-belediye/imar-durumu" },
  { ikon: Heart, etiket: "Nikah Başvurusu", href: "/e-belediye/nikah" },
];

const DUYURULAR = [
  { baslik: "Su kesintisi hakkında duyuru", tarih: "Bugün 08:30" },
  { baslik: "Park ve bahçeler bakım çalışması", tarih: "Dün 14:30" },
  { baslik: "Yeni mobil uygulamamız yayında!", tarih: "22 Temmuz 2025" },
];

const HABERLER = [
  {
    baslik: "Belediyemizden Yeni Sosyal Tesis",
    tarih: "22 Temmuz 2025",
    gorsel: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop",
  },
  {
    baslik: "Yaz Etkinlikleri Başlıyor",
    tarih: "21 Temmuz 2025",
    gorsel: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=600&auto=format&fit=crop",
  },
  {
    baslik: "Altyapı Çalışmaları Devam Ediyor",
    tarih: "20 Temmuz 2025",
    gorsel: "https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=600&auto=format&fit=crop",
  },
];

const ETKINLIKLER = [
  { baslik: "Açık Hava Sineması", tarih: "26 Temmuz 2025 · 21:00", yer: "Kent Parkı" },
  { baslik: "Çocuk Tiyatrosu", tarih: "27 Temmuz 2025 · 16:00", yer: "Kültür Merkezi" },
  { baslik: "Yaz Konseri", tarih: "30 Temmuz 2025 · 20:00", yer: "Amfi Tiyatro" },
];

const ISTATISTIKLER = [
  { deger: "12.458", etiket: "Toplam Talep" },
  { deger: "9.325", etiket: "Çözülen Talep" },
  { deger: "2.156", etiket: "Devam Eden" },
  { deger: "%98", etiket: "Memnuniyet Oranı" },
];

export default function AnaSayfa() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-gradient-to-b from-primary-50/40 to-background">
          <div className="container grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
                <Landmark className="h-3.5 w-3.5" aria-hidden />
                Kapaklı Belediyesi Dijital Platformu
              </span>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
                Daha Akıllı Bir Şehir, <br className="hidden sm:block" />
                Daha İyi Bir Gelecek
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                Akıllı Belediye Platformu ile tüm işlemlerinizi hızlı, kolay ve güvenli bir
                şekilde gerçekleştirin.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/hizmetler" className={cn(buttonVariants({ size: "lg" }))}>
                  Hizmetleri Keşfet
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/giris" className={cn(buttonVariants({ size: "lg", variant: "secondary" }))}>
                  E-Devlet ile Giriş
                </Link>
              </div>
            </div>

            <div className="relative animate-scale-in">
              <div className="aspect-[4/4] overflow-hidden rounded-3xl border border-border shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://www.kapakli.bel.tr/_uploads/demo/kapakli-belediyesi.jpg"
                  alt="Şehir merkezi ve belediye binası"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Öne çıkan kısayollar */}
          <div className="container pb-10">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {[
                { ikon: FileText, baslik: "Talep Oluştur", alt: "Yeni talep oluşturun", href: "/panel/talep-olustur" },
                { ikon: BadgeCheck, baslik: "Borç Sorgulama", alt: "Borçlarınızı görüntüleyin", href: "/borc-sorgulama" },
                { ikon: Landmark, baslik: "E-Belediye", alt: "Online işlemler", href: "/e-belediye" },
                { ikon: CalendarCheck, baslik: "Randevu Al", alt: "Randevunuzu alın", href: "/randevu" },
                { ikon: FileText, baslik: "Bilgi Edinme", alt: "Başvuru oluşturun", href: "/bilgi-edinme" },
              ].map((oge) => (
                <Link key={oge.baslik} href={oge.href}>
                  <Card className="group flex h-full flex-col gap-3 p-4 transition-shadow hover:shadow-card-hover">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <oge.ikon className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground">{oge.baslik}</span>
                      <span className="block text-xs text-muted-foreground">{oge.alt}</span>
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Hızlı işlemler + Duyurular */}
        <section className="container grid gap-6 py-12 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-5">
            <h2 className="font-display text-base font-semibold text-foreground">Hızlı İşlemler</h2>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {HIZLI_ISLEMLER.map((oge) => (
                <Link
                  key={oge.etiket}
                  href={oge.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border p-3 text-center transition-colors hover:border-primary-200 hover:bg-primary-50/60"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                    <oge.ikon className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <span className="text-[11px] font-medium leading-tight text-muted-foreground">{oge.etiket}</span>
                </Link>
              ))}
              <Link
                href="/hizmetler"
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-3 text-center text-muted-foreground transition-colors hover:border-primary-200 hover:text-primary-700"
              >
                <ChevronRight className="h-4.5 w-4.5" aria-hidden />
                <span className="text-[11px] font-medium leading-tight">Daha Fazla</span>
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-foreground">Duyurular</h2>
              <Link href="/duyurular" className="text-xs font-medium text-primary-700 hover:underline">
                Tümünü Gör
              </Link>
            </div>
            <ul className="mt-4 space-y-1">
              {DUYURULAR.map((duyuru) => (
                <li key={duyuru.baslik} className="flex items-start gap-3 rounded-lg px-1 py-2.5 hover:bg-muted">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-info-bg text-info">
                    <Megaphone className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-medium leading-snug text-foreground">{duyuru.baslik}</span>
                    <span className="block text-xs text-muted-foreground">{duyuru.tarih}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Haberler + Etkinlikler */}
        <section className="container grid gap-6 pb-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-foreground">Son Haberler</h2>
              <Link href="/haberler" className="text-xs font-medium text-primary-700 hover:underline">
                Tümünü Gör
              </Link>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {HABERLER.map((haber) => (
                <Card key={haber.baslik} className="overflow-hidden">
                  <div className="aspect-[4/3] w-full bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={haber.gorsel} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold leading-snug text-foreground">{haber.baslik}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{haber.tarih}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-foreground">Yaklaşan Etkinlikler</h2>
              <Link href="/etkinlikler" className="text-xs font-medium text-primary-700 hover:underline">
                Tümünü Gör
              </Link>
            </div>
            <ul className="mt-4 space-y-1">
              {ETKINLIKLER.map((etkinlik) => (
                <li key={etkinlik.baslik} className="flex items-start gap-3 rounded-lg px-1 py-2.5 hover:bg-muted">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-medium leading-snug text-foreground">{etkinlik.baslik}</span>
                    <span className="block text-xs text-muted-foreground">
                      {etkinlik.tarih} · {etkinlik.yer}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* İstatistik şeridi */}
        <section className="border-y border-border bg-primary-900 text-white">
          <div className="container grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
            {ISTATISTIKLER.map((ist) => (
              <div key={ist.etiket} className="text-center sm:text-left">
                <p className="font-display text-3xl font-bold tracking-tight">{ist.deger}</p>
                <p className="mt-1 text-sm text-white/70">{ist.etiket}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Harita bandı */}
        <section className="container py-12">
          <Card className="flex flex-col items-center justify-center gap-2 p-10 text-center text-muted-foreground">
            <MapPin className="h-6 w-6 text-primary-700" aria-hidden />
            <p className="text-sm">
              Aktif taleplerin şehir haritası üzerindeki dağılımı{" "}
              <Link href="/panel/harita" className="font-medium text-primary-700 hover:underline">
                harita sayfasında
              </Link>{" "}
              (Leaflet + OpenStreetMap, <code className="text-xs"></code>) canlı olarak görüntülenir.
            </p>
          </Card>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
