"use client";

import { useEffect, useRef } from "react";
import type { TalepHaritaNoktasi, TalepDurumu } from "@/types";
import { DURUM_ETIKETLERI } from "@/constants/durum";

// react-leaflet + leaflet, SSR'da window'a ihtiyaç duyduğu için bu bileşen
// yalnızca `dynamic(() => import(...), { ssr: false })` ile kullanılmalı.

const DURUM_MARKER_RENGI: Record<TalepDurumu, string> = {
  bekliyor: "#c77700",
  inceleniyor: "#1e88d5",
  atandi: "#0f4c81",
  cozuldu: "#2e7d32",
  kapatildi: "#6b7280",
};

const KAPAKLI_MERKEZ: [number, number] = [41.3778, 27.9744];

interface NoktaSeciciProps {
  mod: "sec";
  deger: { enlem: number; boylam: number } | null;
  onDegisim: (deger: { enlem: number; boylam: number }) => void;
}

interface NoktalarProps {
  mod: "goruntule";
  noktalar: TalepHaritaNoktasi[];
  onNoktaTikla?: (nokta: TalepHaritaNoktasi) => void;
}

type HaritaProps = NoktaSeciciProps | NoktalarProps;

export default function Harita(props: HaritaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const haritaRef = useRef<any>(null);
  const katmanRef = useRef<any>(null);

  useEffect(() => {
    let iptalEdildi = false;

    async function kur() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css" as any).catch(() => {});
      if (iptalEdildi || !containerRef.current || haritaRef.current) return;

      const harita = L.map(containerRef.current).setView(KAPAKLI_MERKEZ, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap katkıda bulunanlar",
        maxZoom: 19,
      }).addTo(harita);
      haritaRef.current = harita;
      katmanRef.current = L.layerGroup().addTo(harita);

      if (props.mod === "sec") {
        let marker: any = null;
        if (props.deger) {
          marker = L.marker([props.deger.enlem, props.deger.boylam]).addTo(harita);
        }
        harita.on("click", (e: any) => {
          const { lat, lng } = e.latlng;
          if (marker) marker.setLatLng([lat, lng]);
          else marker = L.marker([lat, lng]).addTo(harita);
          props.onDegisim({ enlem: lat, boylam: lng });
        });
      }
    }

    kur();

    return () => {
      iptalEdildi = true;
      if (haritaRef.current) {
        haritaRef.current.remove();
        haritaRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Görüntüleme modunda noktalar değiştikçe marker'ları yeniden çiz.
  useEffect(() => {
    if (props.mod !== "goruntule" || !katmanRef.current) return;
    let iptalEdildi = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (iptalEdildi) return;
      katmanRef.current.clearLayers();
      props.noktalar.forEach((nokta) => {
        const marker = L.circleMarker([nokta.enlem, nokta.boylam], {
          radius: 8,
          color: DURUM_MARKER_RENGI[nokta.durum],
          fillColor: DURUM_MARKER_RENGI[nokta.durum],
          fillOpacity: 0.85,
          weight: 2,
        });
        marker.bindPopup(
          `<strong>${nokta.baslik}</strong><br/>#${nokta.takip_no}<br/>${DURUM_ETIKETLERI[nokta.durum]}`
        );
        if (props.onNoktaTikla) {
          marker.on("click", () => props.onNoktaTikla?.(nokta));
        }
        marker.addTo(katmanRef.current);
      });
    })();

    return () => {
      iptalEdildi = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mod === "goruntule" ? props.noktalar : null]);

  return <div ref={containerRef} className="h-full w-full rounded-2xl" role="application" aria-label="Harita" />;
}
