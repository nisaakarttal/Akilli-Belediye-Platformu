import { Megaphone } from "lucide-react";

import { BolumBasligi } from "@/components/home/bolum-basligi";
import { Kart, KartIcerik } from "@/components/ui/card";

interface DuyuruOgesi {
  baslik: string;
  aciklama: string;
  tarih: string;
  onemli?: boolean;
}

const DUYURULAR: DuyuruOgesi[] = [
  {
    baslik: "29 Ekim Cumhuriyet Bayramı Kutlama Programı",
    aciklama:
      "Cumhuriyetimizin kuruluş yıl dönümü kapsamında düzenlenecek tören ve etkinlik programı açıklandı.",
    tarih: "20 Temmuz 2026",
  },
  {
    baslik: "Su Kesintisi Bilgilendirmesi",
    aciklama:
      "Altyapı yenileme çalışmaları nedeniyle 24 Temmuz Cuma günü 09:00-17:00 saatleri arasında Fatih ve Yeni Mahalle'de su kesintisi yaşanacaktır.",
    tarih: "19 Temmuz 2026",
    onemli: true,
  },
  {
    baslik: "Fen İşleri Müdürlüğü Yol Bakım Çalışması",
    aciklama:
      "Namık Kemal Mahallesi ana cadde üzerinde asfalt yenileme çalışması nedeniyle geçici trafik düzenlemesi uygulanacaktır.",
    tarih: "15 Temmuz 2026",
  },
  {
    baslik: "Emlak Vergisi 2. Taksit Ödeme Süresi",
    aciklama:
      "2026 yılı emlak vergisi ikinci taksit son ödeme tarihi 30 Kasım 2026'dır. Ödemeler belediye veznelerinden veya online tahsilat sisteminden yapılabilir.",
    tarih: "10 Temmuz 2026",
  },
];

export function DuyurularBolumu() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <BolumBasligi ikon={Megaphone} baslik="Duyurular" aciklama="Resmî belediye duyuruları" />

      <div className="space-y-3">
        {DUYURULAR.map((duyuru) => (
          <Kart key={duyuru.baslik} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <KartIcerik className="flex flex-1 flex-col gap-1 pt-6 sm:flex-row sm:items-center sm:gap-4 sm:pt-6">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {duyuru.onemli && (
                    <span className="rounded-full bg-uyari/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                      Önemli
                    </span>
                  )}
                  <h3 className="font-semibold text-metin">{duyuru.baslik}</h3>
                </div>
                <p className="mt-1 text-sm text-metin-ikincil">{duyuru.aciklama}</p>
              </div>
              <span className="shrink-0 text-xs text-metin-ikincil">{duyuru.tarih}</span>
            </KartIcerik>
          </Kart>
        ))}
      </div>
    </section>
  );
}
