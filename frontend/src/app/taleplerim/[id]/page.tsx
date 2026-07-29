"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Hash, Building2, Calendar, FileText, CheckCircle2 } from "lucide-react";
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
import { FadeInStagger, StaggerOgesi } from "@/components/ui/animasyon";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { taleplerApi } from "@/lib/api/talepler";
import { tarihSaatFormatla } from "@/lib/tarih";

// Harita bileşenini SSR kapalı olarak dinamik yüklüyoruz
const HaritaSecici = dynamic(
  () => import("@/components/harita/harita-secici").then((mod) => mod.HaritaSecici),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-72 w-full animate-pulse items-center justify-center rounded-2xl bg-kenarlik/40 text-sm font-medium text-metin-ikincil backdrop-blur-sm">
        Harita yükleniyor...
      </div>
    ),
  }
);

function TalepDetayIcerik() {
  const { id } = useParams<{ id: string }>();

  const {
    data: talep,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["talep", id],
    queryFn: () => taleplerApi.getir(id),
  });

  return (
    <>
      <Basli />
      <main className="relative min-h-[85vh] bg-zemin">
        {/* Atmosferik Arka Plan Glow Efekti */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-10 left-1/4 h-[500px] w-[500px] rounded-full bg-birincil-500/10 blur-[140px] dark:bg-birincil-500/5" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <Link
            href="/taleplerim"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-metin-ikincil transition-colors hover:text-birincil-600"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Taleplerime Dön</span>
          </Link>

          {isLoading && (
            <div className="py-20">
              <TamSayfaYukleniyor />
            </div>
          )}

          {isError && (
            <div className="py-10">
              <Uyari tur="hata">Talep bulunamadı veya bu talebi görüntüleme yetkiniz yok.</Uyari>
            </div>
          )}

          {talep && (
            <FadeInStagger className="space-y-6">

              {/* Ana Talep Bilgi Kartı */}
              <StaggerOgesi>
                <Kart className="border-kenarlik/80 bg-zemin/80 backdrop-blur-xl shadow-xl shadow-black/[0.02]">
                  <KartBasligi className="border-b border-kenarlik/60 pb-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-birincil-500/20 bg-birincil-500/10 px-3 py-1 text-xs font-semibold text-birincil-600 dark:text-birincil-400">
                          <Hash size={13} />
                          <span>Takip No: {talep.takip_no}</span>
                        </div>
                        <KartBaslik className="text-2xl font-extrabold tracking-tight text-metin">{talep.baslik}</KartBaslik>
                      </div>
                      <div className="flex items-center gap-2">
                        <DurumRozeti durum={talep.durum} />
                        <OncelikRozeti oncelik={talep.oncelik} />
                      </div>
                    </div>
                  </KartBasligi>

                  <KartIcerik className="space-y-6 pt-6">
                    <div className="rounded-2xl border border-kenarlik/60 bg-zemin/50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-metin-ikincil mb-1.5">Talep Açıklaması</p>
                      <p className="text-sm leading-relaxed text-metin">{talep.aciklama}</p>
                    </div>

                    <div className="grid gap-4 text-sm sm:grid-cols-2 rounded-2xl border border-kenarlik/60 bg-zemin/50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-birincil-500/10 p-2 text-birincil-600 dark:text-birincil-400 mt-0.5">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-metin-ikincil">Kategori</p>
                          <p className="font-medium text-metin">{talep.kategori.ad}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-birincil-500/10 p-2 text-birincil-600 dark:text-birincil-400 mt-0.5">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-metin-ikincil">Sorumlu Müdürlük</p>
                          <p className="font-medium text-metin">{talep.kategori.sorumlu_departman}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-birincil-500/10 p-2 text-birincil-600 dark:text-birincil-400 mt-0.5">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-metin-ikincil">Mahalle</p>
                          <p className="font-medium text-metin">{talep.mahalle.ad}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-birincil-500/10 p-2 text-birincil-600 dark:text-birincil-400 mt-0.5">
                          <Calendar size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-metin-ikincil">Oluşturulma Tarihi</p>
                          <p className="font-medium text-metin">{tarihSaatFormatla(talep.olusturulma_tarihi)}</p>
                        </div>
                      </div>

                      {talep.adres_detay && (
                        <div className="sm:col-span-2 pt-2 border-t border-kenarlik/40">
                          <p className="text-xs font-semibold text-metin-ikincil mb-0.5">Adres Detayı</p>
                          <p className="text-sm font-medium text-metin">{talep.adres_detay}</p>
                        </div>
                      )}
                    </div>

                    {talep.cozum_notu && (
                      <div className="rounded-2xl border border-basarili/30 bg-basarili/5 p-4 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-basarili shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-basarili uppercase tracking-wider">Çözüm Notu / İnceleme Sonucu</p>
                          <p className="text-sm text-metin leading-relaxed">{talep.cozum_notu}</p>
                        </div>
                      </div>
                    )}
                  </KartIcerik>
                </Kart>
              </StaggerOgesi>

              {/* Konum Kartı */}
              <StaggerOgesi>
                <Kart className="border-kenarlik/80 bg-zemin/80 backdrop-blur-xl shadow-lg">
                  <KartBasligi className="border-b border-kenarlik/60 pb-4">
                    <KartBaslik className="flex items-center gap-2 text-lg font-bold text-metin">
                      <MapPin size={18} className="text-birincil-600 dark:text-birincil-400" aria-hidden="true" />
                      <span>Bildirilen Konum</span>
                    </KartBaslik>
                  </KartBasligi>
                  <KartIcerik className="pt-5">
                    <div className="overflow-hidden rounded-2xl border border-kenarlik shadow-inner">
                      <HaritaSecici enlem={talep.enlem} boylam={talep.boylam} saltOkunur />
                    </div>
                  </KartIcerik>
                </Kart>
              </StaggerOgesi>

              {/* Ekler Kartı */}
              <StaggerOgesi>
                <Kart className="border-kenarlik/80 bg-zemin/80 backdrop-blur-xl shadow-lg">
                  <KartBasligi className="border-b border-kenarlik/60 pb-4">
                    <KartBaslik className="text-lg font-bold text-metin">Yüklenen Ekler ve Belgeler</KartBaslik>
                  </KartBasligi>
                  <KartIcerik className="pt-5">
                    <DosyaListesi dosyalar={talep.dosyalar} />
                  </KartIcerik>
                </Kart>
              </StaggerOgesi>

              {/* Zaman Tüneli Kartı */}
              <StaggerOgesi>
                <Kart className="border-kenarlik/80 bg-zemin/80 backdrop-blur-xl shadow-lg">
                  <KartBasligi className="border-b border-kenarlik/60 pb-4">
                    <KartBaslik className="text-lg font-bold text-metin">Süreç Zaman Tüneli</KartBaslik>
                  </KartBasligi>
                  <KartIcerik className="pt-5">
                    <ZamanTuneli gecmis={talep.durum_gecmisi} />
                  </KartIcerik>
                </Kart>
              </StaggerOgesi>

            </FadeInStagger>
          )}
        </div>
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