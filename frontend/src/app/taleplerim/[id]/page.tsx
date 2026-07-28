"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { DosyaListesi } from "@/components/sikayet/dosya-listesi";
import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
import { ZamanTuneli } from "@/components/sikayet/zaman-tuneli";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { taleplerApi } from "@/lib/api/talepler";

// 🌐 Haritayı SSR kapalı olarak dinamik yükleyelim
const HaritaSecici = dynamic(
  () => import("@/components/harita/harita-secici").then((mod) => mod.HaritaSecici),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-sm text-metin-ikincil">
        Harita yükleniyor...
      </div>
    ),
  }
);

function tarihiBicimlendir(isoTarih: string) {
  return new Date(isoTarih).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function TalepDetayIcerik() {
  const { id } = useParams<{ id: string }>();

  const { data: talep, isLoading, isError } = useQuery({
    queryKey: ["talep", id],
    queryFn: () => taleplerApi.getir(id),
  });

  return (
    <>
      <Basli />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link href="/taleplerim" className="mb-4 inline-flex items-center gap-1.5 text-sm text-metin-ikincil hover:text-birincil-600">
          <ArrowLeft size={16} /> Taleplerime Dön
        </Link>

        {isLoading && <TamSayfaYukleniyor />}

        {isError && <Uyari tur="hata">Talep bulunamadı veya bu talebi görüntüleme yetkiniz yok.</Uyari>}

        {talep && (
          <div className="space-y-6">
            <Kart>
              <KartBasligi>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-metin-ikincil">{talep.takip_no}</p>
                    <KartBaslik>{talep.baslik}</KartBaslik>
                  </div>
                  <div className="flex gap-2">
                    <DurumRozeti durum={talep.durum} />
                    <OncelikRozeti oncelik={talep.oncelik} />
                  </div>
                </div>
              </KartBasligi>
              <KartIcerik className="space-y-4">
                <p className="text-sm text-metin-ikincil">{talep.aciklama}</p>

                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-metin-ikincil">Kategori</p>
                    <p className="text-metin">{talep.kategori.ad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-metin-ikincil">Sorumlu Müdürlük</p>
                    <p className="text-metin">{talep.kategori.sorumlu_departman}</p>
                  </div>
                  <div>
                    <p className="text-xs text-metin-ikincil">Mahalle</p>
                    <p className="text-metin">{talep.mahalle.ad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-metin-ikincil">Oluşturulma Tarihi</p>
                    <p className="text-metin">{tarihiBicimlendir(talep.olusturulma_tarihi)}</p>
                  </div>
                  {talep.adres_detay && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-metin-ikincil">Adres Detayı</p>
                      <p className="text-metin">{talep.adres_detay}</p>
                    </div>
                  )}
                </div>

                {talep.cozum_notu && (
                  <div className="rounded-xl bg-basarili/10 p-4">
                    <p className="mb-1 text-xs font-medium text-green-700 dark:text-green-300">Çözüm Notu</p>
                    <p className="text-sm text-metin">{talep.cozum_notu}</p>
                  </div>
                )}
              </KartIcerik>
            </Kart>

            <Kart>
              <KartBasligi>
                <KartBaslik className="flex items-center gap-2 text-lg">
                  <MapPin size={18} /> Konum
                </KartBaslik>
              </KartBasligi>
              <KartIcerik>
                <HaritaSecici enlem={talep.enlem} boylam={talep.boylam} onDegistir={() => {}} saltOkunur />
              </KartIcerik>
            </Kart>

            <Kart>
              <KartBasligi>
                <KartBaslik className="text-lg">Ekler</KartBaslik>
              </KartBasligi>
              <KartIcerik>
                <DosyaListesi dosyalar={talep.dosyalar} />
              </KartIcerik>
            </Kart>

            <Kart>
              <KartBasligi>
                <KartBaslik className="text-lg">Zaman Tüneli</KartBaslik>
              </KartBasligi>
              <KartIcerik>
                <ZamanTuneli gecmis={talep.durum_gecmisi} />
              </KartIcerik>
            </Kart>
          </div>
        )}
      </main>
      <Altbilgi />
    </>
  );
}

export default function TalepDetaySayfasi() {
  return (
    <KorumaliRota izinliRoller={["vatandas"]}>
      <TalepDetayIcerik />
    </KorumaliRota>
  );
}