import { Newspaper } from "lucide-react";

import { BolumBasligi } from "@/components/home/bolum-basligi";
import { Kart, KartIcerik } from "@/components/ui/card";

interface HaberOgesi {
  baslik: string;
  ozet: string;
  tarih: string;
  kategori: string;
}

const HABERLER: HaberOgesi[] = [
  {
    baslik: "Dere Islah Çalışmaları Başladı",
    ozet:
      "Karaağaç Mahallesi'nden geçen dere yatağında taşkın riskini azaltmak amacıyla ıslah çalışmaları başlatıldı. Çalışmaların 2 ay içinde tamamlanması planlanıyor.",
    tarih: "18 Temmuz 2026",
    kategori: "Altyapı",
  },
  {
    baslik: "Yeni Çocuk Parkı Hizmete Açıldı",
    ozet:
      "Bahçelievler Mahallesi'nde yapımı tamamlanan çocuk parkı, düzenlenen açılış töreniyle vatandaşların hizmetine sunuldu.",
    tarih: "12 Temmuz 2026",
    kategori: "Park ve Bahçe",
  },
  {
    baslik: "Kapaklı Yaz Festivali Başlıyor",
    ozet:
      "Bu yıl üçüncüsü düzenlenecek Kapaklı Yaz Festivali, konserler, çocuk etkinlikleri ve yöresel lezzet standlarıyla Cumhuriyet Meydanı'nda vatandaşları ağırlayacak.",
    tarih: "9 Temmuz 2026",
    kategori: "Etkinlik",
  },
  {
    baslik: "Sokak Hayvanları için Yeni Bakım Merkezi",
    ozet:
      "Pınarça Mahallesi'nde inşa edilen sokak hayvanları bakım ve rehabilitasyon merkezi, kapasitesini artırarak hizmet vermeye başladı.",
    tarih: "3 Temmuz 2026",
    kategori: "Hayvan Refahı",
  },
];

export function HaberlerBolumu() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <BolumBasligi ikon={Newspaper} baslik="Haberler" aciklama="Kapaklı Belediyesi'nden son gelişmeler" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HABERLER.map((haber) => (
          <Kart key={haber.baslik} className="flex flex-col transition-transform hover:-translate-y-1">
            <KartIcerik className="flex flex-1 flex-col pt-6">
              <span className="mb-2 w-fit rounded-full bg-birincil-600/10 px-2.5 py-1 text-xs font-medium text-birincil-700 dark:text-birincil-300">
                {haber.kategori}
              </span>
              <h3 className="mb-2 font-semibold leading-snug text-metin">{haber.baslik}</h3>
              <p className="mb-3 flex-1 text-sm text-metin-ikincil">{haber.ozet}</p>
              <span className="text-xs text-metin-ikincil">{haber.tarih}</span>
            </KartIcerik>
          </Kart>
        ))}
      </div>
    </section>
  );
}
