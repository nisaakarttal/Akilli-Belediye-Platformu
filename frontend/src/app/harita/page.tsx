"use client";

import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { Kart, KartIcerik } from "@/components/ui/card";
import { Etiket } from "@/components/ui/label";
import { Secim } from "@/components/ui/select";
import { kategorilerApi } from "@/lib/api/konum";
import { taleplerApi } from "@/lib/api/talepler";
import type { TalepDurumu } from "@/types";

// 🌐 Harita bileşenini SSR kapalı olacak şekilde dinamik yükleyelim
const TalepHaritasi = dynamic(
  () => import("@/components/harita/talep-haritasi").then((mod) => mod.TalepHaritasi),
  {
    ssr: false,
    loading: () => (
      <div className="h-[560px] w-full animate-pulse rounded-lg bg-gray-100 flex items-center justify-center text-sm text-gray-500">
        Harita yükleniyor...
      </div>
    ),
  }
);

const DURUM_SECENEKLERI: { deger: TalepDurumu | ""; etiket: string }[] = [
  { deger: "", etiket: "Tüm Durumlar" },
  { deger: "bekliyor", etiket: "Bekliyor" },
  { deger: "inceleniyor", etiket: "İnceleniyor" },
  { deger: "atandi", etiket: "Atandı" },
  { deger: "cozuldu", etiket: "Çözüldü" },
  { deger: "kapatildi", etiket: "Kapatıldı" },
];

export default function HaritaSayfasi() {
  const [durum, setDurum] = useState<TalepDurumu | "">("");
  const [kategoriId, setKategoriId] = useState("");

  const { data: kategoriler } = useQuery({ queryKey: ["kategoriler"], queryFn: kategorilerApi.listele });
  const { data: noktalar, isLoading } = useQuery({
    queryKey: ["talep-haritasi", durum, kategoriId],
    queryFn: () =>
      taleplerApi.haritaNoktalari({
        durum: durum || undefined,
        kategori_id: kategoriId || undefined,
      }),
  });

  return (
    <>
      <Basli />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="mb-1 text-2xl font-bold text-metin sm:text-3xl">Belediye Haritası</h1>
        <p className="mb-6 text-sm text-metin-ikincil">
          Kapaklı genelindeki tüm şikâyet ve talepleri harita üzerinde görüntüleyin.
        </p>

        <Kart className="mb-4">
          <KartIcerik className="flex flex-wrap gap-4 pt-6">
            <div className="min-w-[180px] flex-1">
              <Etiket htmlFor="durum-filtre">Durum</Etiket>
              <Secim id="durum-filtre" value={durum} onChange={(e) => setDurum(e.target.value as TalepDurumu | "")}>
                {DURUM_SECENEKLERI.map((s) => (
                  <option key={s.deger} value={s.deger}>
                    {s.etiket}
                  </option>
                ))}
              </Secim>
            </div>
            <div className="min-w-[180px] flex-1">
              <Etiket htmlFor="kategori-filtre">Kategori</Etiket>
              <Secim id="kategori-filtre" value={kategoriId} onChange={(e) => setKategoriId(e.target.value)}>
                <option value="">Tüm Kategoriler</option>
                {kategoriler?.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.ad}
                  </option>
                ))}
              </Secim>
            </div>
          </KartIcerik>
        </Kart>

        {!isLoading && noktalar && (
          <p className="mb-3 text-sm text-metin-ikincil">{noktalar.length} talep bulundu.</p>
        )}

        <TalepHaritasi noktalar={noktalar ?? []} yukseklik={560} />
      </main>
      <Altbilgi />
    </>
  );
}