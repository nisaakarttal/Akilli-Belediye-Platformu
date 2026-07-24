"use client";

import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";
import Link from "next/link";

import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
import { Kart, KartIcerik } from "@/components/ui/card";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { personelApi } from "@/lib/api/personel";

function tarihiBicimlendir(isoTarih: string) {
  return new Date(isoTarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function PersonelAnaSayfasi() {
  const { data, isLoading } = useQuery({ queryKey: ["atanan-talepler"], queryFn: personelApi.atananTalepler });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-metin sm:text-3xl">Atanan Taleplerim</h1>
        <p className="text-sm text-metin-ikincil">Size atanmış şikâyet/talepleri buradan yönetebilirsiniz.</p>
      </div>

      {isLoading ? (
        <TamSayfaYukleniyor />
      ) : !data || data.length === 0 ? (
        <Kart>
          <KartIcerik className="flex flex-col items-center gap-3 py-12 text-center">
            <ClipboardList size={40} className="text-metin-ikincil" />
            <p className="text-metin-ikincil">Şu anda size atanmış bir talep bulunmuyor.</p>
          </KartIcerik>
        </Kart>
      ) : (
        <div className="space-y-3">
          {data.map((talep) => (
            <Link key={talep.id} href={`/personel/${talep.id}`}>
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
