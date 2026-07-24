"use client";

import { useQuery } from "@tanstack/react-query";
import { FileQuestion, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { Secim } from "@/components/ui/select";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { taleplerApi } from "@/lib/api/talepler";
import type { TalepDurumu } from "@/types";

const DURUM_SECENEKLERI: { deger: TalepDurumu | ""; etiket: string }[] = [
  { deger: "", etiket: "Tüm Durumlar" },
  { deger: "bekliyor", etiket: "Bekliyor" },
  { deger: "inceleniyor", etiket: "İnceleniyor" },
  { deger: "atandi", etiket: "Atandı" },
  { deger: "cozuldu", etiket: "Çözüldü" },
  { deger: "kapatildi", etiket: "Kapatıldı" },
];

function tarihiBicimlendir(isoTarih: string) {
  return new Date(isoTarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

function TaleplerimIcerik() {
  const [durumFiltresi, setDurumFiltresi] = useState<TalepDurumu | "">("");

  const { data, isLoading } = useQuery({
    queryKey: ["taleplerim", durumFiltresi],
    queryFn: () => taleplerApi.listele({ durum: durumFiltresi || undefined, sayfa_boyutu: 50 }),
  });

  return (
    <>
      <Basli />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-metin sm:text-3xl">Taleplerim</h1>
            <p className="text-sm text-metin-ikincil">Oluşturduğunuz şikâyet ve talepleri buradan takip edebilirsiniz.</p>
          </div>
          <Link href="/sikayet-olustur">
            <Dugme varyant="birincil" className="gap-2">
              <Plus size={18} /> Yeni Talep
            </Dugme>
          </Link>
        </div>

        <div className="mb-4 max-w-xs">
          <Secim value={durumFiltresi} onChange={(e) => setDurumFiltresi(e.target.value as TalepDurumu | "")}>
            {DURUM_SECENEKLERI.map((secenek) => (
              <option key={secenek.deger} value={secenek.deger}>
                {secenek.etiket}
              </option>
            ))}
          </Secim>
        </div>

        {isLoading ? (
          <TamSayfaYukleniyor />
        ) : !data || data.veriler.length === 0 ? (
          <Kart>
            <KartIcerik className="flex flex-col items-center gap-3 py-12 text-center">
              <FileQuestion size={40} className="text-metin-ikincil" />
              <p className="text-metin-ikincil">Henüz bir talebiniz bulunmuyor.</p>
              <Link href="/sikayet-olustur">
                <Dugme varyant="birincil">İlk Talebinizi Oluşturun</Dugme>
              </Link>
            </KartIcerik>
          </Kart>
        ) : (
          <div className="space-y-3">
            {data.veriler.map((talep) => (
              <Link key={talep.id} href={`/taleplerim/${talep.id}`}>
                <Kart className="transition-transform hover:-translate-y-0.5">
                  <KartIcerik className="flex flex-wrap items-center justify-between gap-3 pt-6">
                    <div>
                      <p className="text-xs text-metin-ikincil">{talep.takip_no}</p>
                      <h3 className="font-semibold text-metin">{talep.baslik}</h3>
                      <p className="mt-1 text-xs text-metin-ikincil">
                        {talep.kategori.ad} • {talep.mahalle.ad} • {tarihiBicimlendir(talep.olusturulma_tarihi)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <DurumRozeti durum={talep.durum} />
                      <OncelikRozeti oncelik={talep.oncelik} />
                    </div>
                  </KartIcerik>
                </Kart>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Altbilgi />
    </>
  );
}

export default function TaleplerimSayfasi() {
  return (
    <KorumaliRota>
      <TaleplerimIcerik />
    </KorumaliRota>
  );
}
