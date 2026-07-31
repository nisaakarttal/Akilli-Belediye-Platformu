import { Megaphone } from "lucide-react";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";

// NOT: Backend'de /duyurular endpoint'i yok (bkz. ROADMAP.md). Örnek veri.
const DUYURULAR = [
  { baslik: "Su kesintisi hakkında duyuru", detay: "Bakım çalışması nedeniyle Merkez Mahallesi'nde 08:00–14:00 saatleri arasında su kesintisi yaşanacaktır.", tarih: "Bugün 08:30" },
  { baslik: "Park ve bahçeler bakım çalışması", detay: "Kent Parkı'nda peyzaj bakım çalışması yapılacak, park geçici olarak kapatılacaktır.", tarih: "Dün 14:30" },
  { baslik: "Yeni mobil uygulamamız yayında!", detay: "Akıllı Belediye mobil uygulaması artık App Store ve Google Play'de.", tarih: "22 Temmuz 2025" },
];

export default function DuyurularSayfasi() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="container flex-1 py-10">
        <h1 className="font-display text-2xl font-bold text-foreground">Duyurular</h1>
        <p className="mt-1 text-sm text-muted-foreground">Güncel duyuru ve bilgilendirmeler.</p>

        <div className="mt-6 space-y-3">
          {DUYURULAR.map((duyuru) => (
            <Card key={duyuru.baslik} className="flex items-start gap-4 p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-info-bg text-info">
                <Megaphone className="h-4.5 w-4.5" aria-hidden />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-foreground">{duyuru.baslik}</p>
                <p className="mt-1 text-sm text-muted-foreground">{duyuru.detay}</p>
                <p className="mt-2 text-xs text-muted-foreground">{duyuru.tarih}</p>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
