"use client";

import { useQuery } from "@tanstack/react-query";
import { ClipboardList } from "lucide-react";

import { TalepKarti } from "@/components/sikayet/talep-karti";
import { Kart, KartIcerik } from "@/components/ui/card";
import { FadeIn, FadeInStagger, StaggerOgesi } from "@/components/ui/animasyon";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { personelApi } from "@/lib/api/personel";

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
        <FadeIn>
          <Kart>
            <KartIcerik className="flex flex-col items-center gap-3 py-12 text-center">
              <ClipboardList size={40} className="text-metin-ikincil" aria-hidden="true" />
              <p className="text-metin-ikincil">Şu anda size atanmış bir talep bulunmuyor.</p>
            </KartIcerik>
          </Kart>
        </FadeIn>
      ) : (
        <FadeInStagger className="space-y-3">
          {data.map((talep) => (
            <StaggerOgesi key={talep.id}>
              <TalepKarti talep={talep} href={`/personel/${talep.id}`} />
            </StaggerOgesi>
          ))}
        </FadeInStagger>
      )}
    </div>
  );
}
