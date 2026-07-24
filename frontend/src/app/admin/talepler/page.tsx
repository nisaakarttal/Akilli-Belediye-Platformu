"use client";

import { useQuery } from "@tanstack/react-query";
import { FileQuestion, Filter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { KorumaliRota } from "@/components/layout/korumali-rota";
import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
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

function AdminTaleplerIcerik() {
  const [durumFiltresi, setDurumFiltresi] = useState<TalepDurumu | "">("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-talepler", durumFiltresi],
    queryFn: () => taleplerApi.listele({ durum: durumFiltresi || undefined, sayfa_boyutu: 50 }),
  });

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center gap-3">
        <Filter size={18} className="text-metin-ikincil" />
        <div className="max-w-xs flex-1">
          <Secim value={durumFiltresi} onChange={(e) => setDurumFiltresi(e.target.value as TalepDurumu | "")}>
            {DURUM_SECENEKLERI.map((secenek) => (
              <option key={secenek.deger} value={secenek.deger}>
                {secenek.etiket}
              </option>
            ))}
          </Secim>
        </div>
      </div>

      {isLoading ? (
        <TamSayfaYukleniyor />
      ) : !data || data.veriler.length === 0 ? (
        <Kart>
          <KartIcerik className="flex flex-col items-center gap-3 py-12 text-center">
            <FileQuestion size={40} className="text-metin-ikincil" />
            <p className="text-metin-ikincil">Gösterilecek talep bulunamadı.</p>
          </KartIcerik>
        </Kart>
      ) : (
        <div className="space-y-3">
          {data.veriler.map((talep) => (
            <Link key={talep.id} href={`/admin/talepler/${talep.id}`}>
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
    </div>
  );
}

export default function AdminTaleplerPage() {
  return (
    <KorumaliRota izinliRoller={["admin"]}>
      <AdminTaleplerIcerik />
    </KorumaliRota>
  );
}