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

interface HaritaSeciciProps {
  enlem: number;
  boylam: number;
  onDegistir: (enlem: number, boylam: number) => void;
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [monteEdildi, setMonteEdildi] = useState(false);

  useEffect(() => {
    setMonteEdildi(true);
  }, []);

  // Haritanın ilklendirilmesi ve Temizlenmesi (Cleanup)
  useEffect(() => {
    if (!monteEdildi || !containerRef.current) return;

    // EĞER konteyner üzerinde önceden kalmış bir Leaflet haritası varsa temizle
    if ((containerRef.current as any)._leaflet_id) {
      containerRef.current.innerHTML = "";
    }

    // Haritayı Sıfırdan Oluştur
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

    // Haritaya Tıklama Olayı (Salt Okunur Değilse)
    if (!saltOkunur) {
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onDegistir(lat, lng);
      });
    }

    // 🪄 SİHİRLİ TEMİZLİK: Bileşen unmount olunca haritayı yok et!
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [monteEdildi]); // Sadece monte edildiğinde 1 kez çalışır

  // Dışarıdan enlem/boylam prop'ları değiştiğinde haritayı ve ikonu güncelle
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const currentLatLng = markerRef.current.getLatLng();
    if (currentLatLng.lat !== enlem || currentLatLng.lng !== boylam) {
      markerRef.current.setLatLng([enlem, boylam]);
      mapRef.current.panTo([enlem, boylam]);
    }
  }, [enlem, boylam]);

  if (!monteEdildi) {
    return (
      <div
        style={{ height: yukseklik }}
        className="animate-pulse rounded-xl bg-black/5 dark:bg-white/5"
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