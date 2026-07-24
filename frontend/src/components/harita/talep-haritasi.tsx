"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import type { TalepHaritaNoktasi } from "@/types";

const KAPAKLI_MERKEZ: [number, number] = [41.3706, 27.9917];

const DURUM_RENGI: Record<string, string> = {
  bekliyor: "#64748B",
  inceleniyor: "#F59E0B",
  atandi: "#0EA5E9",
  cozuldu: "#22C55E",
  kapatildi: "#94A3B8",
};

function nokta_ikonu(durum: string) {
  const renk = DURUM_RENGI[durum] ?? "#2563EB";
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:9999px;background:${renk};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

export function TalepHaritasi({ noktalar, yukseklik = 500 }: { noktalar: TalepHaritaNoktasi[]; yukseklik?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [monteEdildi, setMonteEdildi] = useState(false);

  useEffect(() => {
    setMonteEdildi(true);
  }, []);

  // 1. Haritanın İlk Kurulumu ve Silinmesi (Lifecycle)
  useEffect(() => {
    if (!monteEdildi || !containerRef.current) return;

    // Konteynerde kalıntı varsa temizle
    if ((containerRef.current as any)._leaflet_id) {
      containerRef.current.innerHTML = "";
    }

    // Haritayı İlklendir
    const map = L.map(containerRef.current).setView(KAPAKLI_MERKEZ, 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar',
    }).addTo(map);

    // Marker'ları tutacak grup katmanı oluştur
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    // 🪄 SİHİRLİ TEMİZLİK: Unmount anında harita yok edilir!
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [monteEdildi]);

  // 2. Filtre veya Noktalar Değiştikçe Marker'ları Güncelle
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;

    // Önceki işaretçileri temizle
    layerGroupRef.current.clearLayers();

    // Yeni noktaları ekle
    noktalar.forEach((nokta) => {
      if (!nokta.enlem || !nokta.boylam) return;

      const marker = L.marker([nokta.enlem, nokta.boylam], {
        icon: nokta_ikonu(nokta.durum),
      });

      // Popup içeriği
      const popupIcerik = `
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
          <p style="font-weight: 600; margin: 0 0 4px 0;">${nokta.baslik}</p>
          <p style="font-size: 11px; color: #64748b; margin: 0;">${nokta.takip_no} • ${nokta.kategori_adi}</p>
        </div>
      `;

      marker.bindPopup(popupIcerik);
      layerGroupRef.current?.addLayer(marker);
    });
  }, [noktalar]);

  if (!monteEdildi) {
    return <div style={{ height: yukseklik }} className="animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-kenarlik" style={{ height: yukseklik }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}