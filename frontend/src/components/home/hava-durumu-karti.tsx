import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, Wind } from "lucide-react";

import { Kart, KartIcerik } from "@/components/ui/card";

// Kapaklı, Tekirdağ merkez koordinatları
const ENLEM = 41.3706;
const BOYLAM = 27.9917;

interface AcikMeteoYaniti {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

function durumBilgisiGetir(kod: number): { metin: string; Simge: typeof Sun } {
  if (kod === 0) return { metin: "Açık", Simge: Sun };
  if ([1, 2, 3].includes(kod)) return { metin: "Parçalı Bulutlu", Simge: Cloud };
  if ([45, 48].includes(kod)) return { metin: "Sisli", Simge: CloudFog };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(kod)) return { metin: "Yağmurlu", Simge: CloudRain };
  if ([71, 73, 75].includes(kod)) return { metin: "Karlı", Simge: CloudSnow };
  if ([95, 96, 99].includes(kod)) return { metin: "Gök Gürültülü Fırtına", Simge: CloudLightning };
  return { metin: "Parçalı Bulutlu", Simge: Cloud };
}

async function havaDurumuGetir() {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${ENLEM}&longitude=${BOYLAM}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Europe%2FIstanbul`;

    const yanit = await fetch(url, { next: { revalidate: 1800 } }); // 30 dakikada bir yenile
    if (!yanit.ok) return null;

    const veri: AcikMeteoYaniti = await yanit.json();
    return veri.current;
  } catch {
    return null;
  }
}

export async function HavaDurumuKarti() {
  const havaDurumu = await havaDurumuGetir();

  if (!havaDurumu) {
    return (
      <Kart>
        <KartIcerik className="pt-6 text-sm text-metin-ikincil">
          Hava durumu bilgisi şu anda alınamıyor.
        </KartIcerik>
      </Kart>
    );
  }

  const { metin, Simge } = durumBilgisiGetir(havaDurumu.weather_code);

  return (
    <Kart className="overflow-hidden">
      <KartIcerik className="flex items-center justify-between pt-6">
        <div>
          <p className="text-xs text-metin-ikincil">Kapaklı, Tekirdağ</p>
          <p className="text-3xl font-bold text-metin">{Math.round(havaDurumu.temperature_2m)}°C</p>
          <p className="text-sm text-metin-ikincil">{metin}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Simge className="text-birincil-500" size={40} />
          <div className="flex items-center gap-1 text-xs text-metin-ikincil">
            <Wind size={12} /> {Math.round(havaDurumu.wind_speed_10m)} km/s
          </div>
        </div>
      </KartIcerik>
    </Kart>
  );
}
