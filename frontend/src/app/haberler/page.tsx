import { SiteNavbar } from "@/components/layout/site-navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { Card } from "@/components/ui/card";

// NOT: Backend'de /haberler endpoint'i yok (bkz. ROADMAP.md). Bu sayfa örnek
// veriyle hazırlandı; endpoint eklendiğinde `useQuery` ile gerçek veriye bağlanmalı.
const HABERLER = [
  {
    baslik: "Belediyemizden Yeni Sosyal Tesis",
    ozet: "Merkez mahallede hizmete giren yeni sosyal tesis, spor ve etkinlik alanlarıyla vatandaşlarımızın hizmetinde.",
    tarih: "22 Temmuz 2025",
    gorsel: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
  },
  {
    baslik: "Yaz Etkinlikleri Başlıyor",
    ozet: "Bu yaz boyunca sürecek konser, tiyatro ve sinema etkinlikleri programı açıklandı.",
    tarih: "21 Temmuz 2025",
    gorsel: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800&auto=format&fit=crop",
  },
  {
    baslik: "Altyapı Çalışmaları Devam Ediyor",
    ozet: "Yol ve kaldırım yenileme çalışmaları kapsamında bazı bölgelerde geçici trafik düzenlemeleri yapılacak.",
    tarih: "20 Temmuz 2025",
    gorsel: "https://images.unsplash.com/photo-1541976590-713941681591?q=80&w=800&auto=format&fit=crop",
  },
];

export default function HaberlerSayfasi() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="container flex-1 py-10">
        <h1 className="font-display text-2xl font-bold text-foreground">Haberler</h1>
        <p className="mt-1 text-sm text-muted-foreground">Belediyemizden son gelişmeler.</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HABERLER.map((haber) => (
            <Card key={haber.baslik} className="overflow-hidden">
              <div className="aspect-[16/10] w-full bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={haber.gorsel} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="p-5">
                <p className="text-xs text-muted-foreground">{haber.tarih}</p>
                <p className="mt-1 font-display text-base font-semibold text-foreground">{haber.baslik}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{haber.ozet}</p>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
