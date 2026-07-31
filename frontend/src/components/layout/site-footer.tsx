import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Landmark, Phone, Mail, MapPin } from "lucide-react";

const SUTUNLAR = [
  {
    baslik: "Hızlı Linkler",
    linkler: [
      { href: "/", etiket: "Ana Sayfa" },
      { href: "/hizmetler", etiket: "Hizmetler" },
      { href: "/duyurular", etiket: "Duyurular" },
      { href: "/haberler", etiket: "Haberler" },
      { href: "/etkinlikler", etiket: "Etkinlikler" },
    ],
  },
  {
    baslik: "Hizmetler",
    linkler: [
      { href: "/panel/talep-olustur", etiket: "Talep Oluştur" },
      { href: "/borc-sorgulama", etiket: "Borç Sorgulama" },
      { href: "/e-belediye", etiket: "E-Belediye" },
      { href: "/randevu", etiket: "Randevu Al" },
      { href: "/bilgi-edinme", etiket: "Bilgi Edinme" },
    ],
  },
  {
    baslik: "Yardım",
    linkler: [
      { href: "/sss", etiket: "Sıkça Sorulan Sorular" },
      { href: "/kullanim-rehberi", etiket: "Kullanım Rehberi" },
      { href: "/gizlilik", etiket: "Gizlilik Politikası" },
      { href: "/kvkk", etiket: "KVKK Aydınlatma Metni" },
    ],
  },
];

const SOSYAL = [
  { href: "#", Icon: Facebook, etiket: "Facebook" },
  { href: "#", Icon: Twitter, etiket: "Twitter" },
  { href: "#", Icon: Instagram, etiket: "Instagram" },
  { href: "#", Icon: Youtube, etiket: "YouTube" },
  { href: "#", Icon: Linkedin, etiket: "LinkedIn" },
];

export function SiteFooter() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Landmark className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-display text-sm font-bold tracking-tight text-white">AKILLI BELEDİYE</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-sidebar-foreground/70">
            Daha yaşanabilir bir şehir için teknolojiyi kullanıyoruz. Talep oluşturun, takip
            edin, belediyemizle birlikte çalışın.
          </p>
          <div className="mt-5 flex gap-2">
            {SOSYAL.map(({ href, Icon, etiket }) => (
              <a
                key={etiket}
                href={href}
                aria-label={etiket}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-sidebar-foreground/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {SUTUNLAR.map((sutun) => (
          <nav key={sutun.baslik} aria-label={sutun.baslik}>
            <h3 className="text-sm font-semibold text-white">{sutun.baslik}</h3>
            <ul className="mt-4 space-y-2.5">
              {sutun.linkler.map((link) => (
                <li key={link.etiket}>
                  <Link href={link.href} className="text-sm text-sidebar-foreground/70 hover:text-white">
                    {link.etiket}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-sm font-semibold text-white">İletişim</h3>
          <ul className="mt-4 space-y-3 text-sm text-sidebar-foreground/70">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>0 (850) 123 45 67</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>info@belediye.gov.tr</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>Merkez Mah. Belediye Cad. No: 1 / Kapaklı</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-sidebar-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Akıllı Belediye Platformu. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
