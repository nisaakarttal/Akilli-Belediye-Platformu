"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";

import type { TalepDurumu, TalepHaritaNoktasi } from "@/types";

const KAPAKLI_MERKEZ: [number, number] = [41.3706, 27.9917];
const VARSAYILAN_YUKSEKLIK = 500;
const NOKTA_BOYUTU = 16;
const NOKTA_YARICAP = 8;
const BASLANGIC_YAKINLASTIRMA = 13;

const DURUM_RENGI: Record<TalepDurumu, string> = {
  bekliyor: "#64748B",
  inceleniyor: "#F59E0B",
  atandi: "#0EA5E9",
  cozuldu: "#22C55E",
  kapatildi: "#94A3B8",
};

/** Leaflet, aynı DOM elemanına ikinci kez harita bağlanmaya çalışırsa hata fırlatır; bu iç işaretleyiciyi kontrol ederiz. */
interface LeafletBagliKonteyner extends HTMLDivElement {
  _leaflet_id?: number;
}

function noktaIkonuOlustur(durum: TalepDurumu): L.DivIcon {
  const renk = DURUM_RENGI[durum] ?? "#2563EB";
  return L.divIcon({
    className: "",
    html: `<div style="width:${NOKTA_BOYUTU}px;height:${NOKTA_BOYUTU}px;border-radius:9999px;background:${renk};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [NOKTA_BOYUTU, NOKTA_BOYUTU],
    iconAnchor: [NOKTA_YARICAP, NOKTA_YARICAP],
  });
}

interface TalepHaritasiProps {
  noktalar: TalepHaritaNoktasi[];
  yukseklik?: number;
}

export function TalepHaritasi({ noktalar, yukseklik = VARSAYILAN_YUKSEKLIK }: TalepHaritasiProps) {
  const containerRef = useRef<LeafletBagliKonteyner | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [monteEdildi, setMonteEdildi] = useState(false);

  useEffect(() => {
    setMonteEdildi(true);
  }, []);

  // Haritanın ilk kurulumu ve unmount'ta temizlenmesi
  useEffect(() => {
    if (!monteEdildi || !containerRef.current) return;

    // Konteynerde önceki bir Leaflet örneğinden kalıntı varsa temizle
    if (containerRef.current._leaflet_id) {
      containerRef.current.innerHTML = "";
    }

    const map = L.map(containerRef.current).setView(KAPAKLI_MERKEZ, BASLANGIC_YAKINLASTIRMA);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [monteEdildi]);

  // Noktalar değiştikçe marker'ları güncelle
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    noktalar.forEach((nokta) => {
      if (!nokta.enlem || !nokta.boylam) return;

      const marker = L.marker([nokta.enlem, nokta.boylam], {
        icon: noktaIkonuOlustur(nokta.durum),
      });

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
    <div className="overflow-hidden rounded-xl border border-kenarlik" style={{ height: yukseklik }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
