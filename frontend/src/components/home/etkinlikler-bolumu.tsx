import { CalendarDays, MapPin } from "lucide-react";

import { BolumBasligi } from "@/components/home/bolum-basligi";
import { Kart, KartIcerik } from "@/components/ui/card";

interface EtkinlikOgesi {
  baslik: string;
  tarih: string;
  yer: string;
  aciklama: string;
}

const ETKINLIKLER: EtkinlikOgesi[] = [
  {
    baslik: "Çocuk Şenliği",
    tarih: "26 Temmuz 2026, 10:00",
    yer: "Cumhuriyet Meydanı",
    aciklama: "Oyunlar, tiyatro gösterisi ve atölyelerle dolu bir gün çocuklarımızı bekliyor.",
  },
  {
    baslik: "Yaz Konseri",
    tarih: "2 Ağustos 2026, 20:30",
    yer: "Kapaklı Kültür Merkezi Açık Hava Sahnesi",
    aciklama: "Yerel sanatçıların sahne alacağı yaz konseri tüm vatandaşlarımıza açıktır.",
  },
  {
    baslik: "Ağaç Dikme Etkinliği",
    tarih: "9 Ağustos 2026, 08:30",
    yer: "Pınarça Mahallesi Fidanlık Alanı",
    aciklama: "Belediyemizin yeşillendirme kampanyası kapsamında gönüllü ağaç dikim etkinliği düzenlenecektir.",
  },
  {
    baslik: "Sokak Hayvanları Sahiplendirme Günü",
    tarih: "16 Ağustos 2026, 11:00",
    yer: "Veteriner İşleri Müdürlüğü Bakım Merkezi",
    aciklama: "Bakım merkezimizdeki dostlarımız yeni yuvalarına kavuşmayı bekliyor.",
  },
  {
    baslik: "Gençlik Festivali",
    tarih: "23 Ağustos 2026, 14:00",
    yer: "Kapaklı Gençlik Merkezi",
    aciklama: "Spor turnuvaları, müzik dinletileri ve kariyer atölyeleriyle gençlere özel bir festival.",
  },
  {
    baslik: "Kadın Girişimciler Pazarı",
    tarih: "30 Ağustos 2026, 09:00",
    yer: "Atatürk Mahallesi Pazar Yeri",
    aciklama: "Kapaklılı kadın girişimcilerin ürünlerini sergileyeceği pazar etkinliği.",
  },
];

export function EtkinliklerBolumu() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <BolumBasligi ikon={CalendarDays} baslik="Yaklaşan Etkinlikler" aciklama="Kapaklı'da bu ay neler oluyor?" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ETKINLIKLER.map((etkinlik) => (
          <Kart key={etkinlik.baslik} className="transition-transform hover:-translate-y-1">
            <KartIcerik className="pt-6">
              <h3 className="mb-2 font-semibold text-metin">{etkinlik.baslik}</h3>
              <div className="mb-1 flex items-center gap-2 text-xs text-metin-ikincil">
                <CalendarDays size={14} /> {etkinlik.tarih}
              </div>
              <div className="mb-3 flex items-center gap-2 text-xs text-metin-ikincil">
                <MapPin size={14} /> {etkinlik.yer}
              </div>
              <p className="text-sm text-metin-ikincil">{etkinlik.aciklama}</p>
            </KartIcerik>
          </Kart>
        ))}
      </div>
    </section>
  );
}
