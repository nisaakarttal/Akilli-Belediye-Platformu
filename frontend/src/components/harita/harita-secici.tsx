"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

// Leaflet varsayılan marker ikonlarının Next.js/webpack paketleme ortamında
// düzgün yüklenmesi için CDN üzerinden ayarlanması
const varsayilanIkon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/** Leaflet, bir DOM elemanına harita bağladığında `_leaflet_id` özelliğini çalışma zamanında ekler. */
interface LeafletKonteyneri extends HTMLDivElement {
  _leaflet_id?: number;
}

interface HaritaSeciciProps {
  enlem: number;
  boylam: number;
  /** Salt okunur modda çağrılmaz; yalnızca etkileşimli kullanımda zorunludur. */
  onDegistir?: (enlem: number, boylam: number) => void;
  yukseklik?: number;
  saltOkunur?: boolean;
}

export function HaritaSecici({
  enlem,
  boylam,
  onDegistir,
  yukseklik = 320,
  saltOkunur = false,
}: HaritaSeciciProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<LeafletKonteyneri | null>(null);

  const [monteEdildi, setMonteEdildi] = useState(false);

  useEffect(() => {
    setMonteEdildi(true);
  }, []);

  // Haritanın ilklendirilmesi ve temizlenmesi (cleanup)
  useEffect(() => {
    if (!monteEdildi || !containerRef.current) return;

    // Konteyner üzerinde önceden kalmış bir Leaflet haritası varsa temizle
    if (containerRef.current._leaflet_id) {
      containerRef.current.innerHTML = "";
    }

    // Haritayı sıfırdan oluştur
    const map = L.map(containerRef.current, {
      center: [enlem, boylam],
      zoom: 15,
      dragging: !saltOkunur,
      scrollWheelZoom: !saltOkunur,
      doubleClickZoom: !saltOkunur,
    });

    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar',
    }).addTo(map);

    // Marker ekle
    const marker = L.marker([enlem, boylam], { icon: varsayilanIkon }).addTo(map);
    markerRef.current = marker;

    // Haritaya tıklama olayı (salt okunur değilse)
    if (!saltOkunur) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onDegistir?.(lat, lng);
      });
    }

    // Bileşen unmount olduğunda haritayı temizle
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- yalnızca monte edildiğinde bir kez çalışması amaçlanmıştır
  }, [monteEdildi]);

  // Dışarıdan enlem/boylam prop'ları değiştiğinde haritayı ve ikonu güncelle
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const guncelKonum = markerRef.current.getLatLng();
    if (guncelKonum.lat !== enlem || guncelKonum.lng !== boylam) {
      markerRef.current.setLatLng([enlem, boylam]);
      mapRef.current.panTo([enlem, boylam]);
    }
  }, [enlem, boylam]);

  if (!monteEdildi) {
    return (
      <div
        style={{ height: yukseklik }}
        className="animate-pulse rounded-xl bg-black/5 dark:bg-white/5"
        role="status"
        aria-label="Harita yükleniyor"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-kenarlik">
      <div ref={containerRef} style={{ height: yukseklik, width: "100%" }} />
      {!saltOkunur && (
        <p className="bg-black/5 px-3 py-1.5 text-xs text-metin-ikincil dark:bg-white/5">
          Konumu değiştirmek için haritaya tıklayın.
        </p>
      )}
    </div>
  );
}
