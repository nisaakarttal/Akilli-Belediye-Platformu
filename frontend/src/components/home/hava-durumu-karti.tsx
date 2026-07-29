import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Wind, type LucideIcon } from "lucide-react";

import { Kart, KartIcerik } from "@/components/ui/card";
import { havaKoduAciklamasi, kapakliHavaDurumunuGetir } from "@/lib/hava-durumu";
import type { HavaIkonAdi } from "@/types/anasayfa";

/** Hava durumu ikon anahtarlarını Lucide ikon bileşenlerine eşler. */
const HAVA_IKONLARI: Record<HavaIkonAdi, LucideIcon> = {
  acik: Sun,
  "parcali-bulutlu": Cloud,
  sisli: CloudFog,
  yagmurlu: CloudRain,
  karli: CloudSnow,
  firtinali: CloudLightning,
};

export async function HavaDurumuKarti() {
  const havaDurumu = await kapakliHavaDurumunuGetir();

  if (!havaDurumu) {
    return (
      <Kart>
        <KartIcerik className="pt-6 text-sm text-metin-ikincil">
          Hava durumu bilgisi şu anda alınamıyor.
        </KartIcerik>
      </Kart>
    );
  }

  const { metin, ikonAdi } = havaKoduAciklamasi(havaDurumu.havaKodu);
  const HavaIkonu = HAVA_IKONLARI[ikonAdi];

  return (
    <Kart className="overflow-hidden transition-shadow hover:shadow-xl">
      <KartIcerik className="flex items-center justify-between pt-6">
        <div>
          <p className="text-xs text-metin-ikincil">Kapaklı, Tekirdağ</p>
          <p className="text-3xl font-bold text-metin">{Math.round(havaDurumu.sicaklik)}°C</p>
          <p className="text-sm text-metin-ikincil">{metin}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <HavaIkonu className="text-birincil-500" size={40} aria-hidden="true" />
          <div className="flex items-center gap-1 text-xs text-metin-ikincil">
            <Wind size={12} aria-hidden="true" /> {Math.round(havaDurumu.ruzgarHizi)} km/s
          </div>
        </div>
      </KartIcerik>
    </Kart>
  );
}
