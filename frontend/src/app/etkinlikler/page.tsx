import { Calendar, MapPin } from "lucide-react";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";

// NOT: Backend'de /etkinlikler endpoint'i yok (bkz. ROADMAP.md). Örnek veri.
const ETKINLIKLER = [
  { baslik: "Açık Hava Sineması", tarih: "26 Temmuz 2025 · 21:00", yer: "Kent Parkı" },
  { baslik: "Çocuk Tiyatrosu", tarih: "27 Temmuz 2025 · 16:00", yer: "Kültür Merkezi" },
  { baslik: "Yaz Konseri", tarih: "30 Temmuz 2025 · 20:00", yer: "Amfi Tiyatro" },
];

export default function EtkinliklerSayfasi() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="container flex-1 py-10">
        <h1 className="font-display text-2xl font-bold text-foreground">Etkinlikler</h1>
        <p className="mt-1 text-sm text-muted-foreground">Yaklaşan belediye etkinlikleri.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ETKINLIKLER.map((etkinlik) => (
            <Card key={etkinlik.baslik} className="p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <Calendar className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-3 font-display text-base font-semibold text-foreground">{etkinlik.baslik}</p>
              <p className="mt-1 text-sm text-muted-foreground">{etkinlik.tarih}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {etkinlik.yer}
              </p>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
