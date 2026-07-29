import Link from "next/link";

import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
import { Kart, KartIcerik } from "@/components/ui/card";
import { tarihFormatla } from "@/lib/tarih";
import type { TalepListe } from "@/types";

interface TalepKartiProps {
  talep: TalepListe;
  /** Kartın yönlendireceği detay sayfası (ör. "/taleplerim/{id}" veya "/personel/{id}"). */
  href: string;
}

/** Talep listelerinde (vatandaş ve personel) tek bir talebi özetleyen, tıklanabilir kart. */
export function TalepKarti({ talep, href }: TalepKartiProps) {
  return (
    <Link href={href} aria-label={`${talep.baslik} talebinin detayını görüntüle`}>
      <Kart className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
        <KartIcerik className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <div>
            <p className="text-xs text-metin-ikincil">{talep.takip_no}</p>
            <h3 className="font-semibold text-metin">{talep.baslik}</h3>
            <p className="mt-1 text-xs text-metin-ikincil">
              {talep.kategori.ad} • {talep.mahalle.ad} • {tarihFormatla(talep.olusturulma_tarihi)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <DurumRozeti durum={talep.durum} />
            <OncelikRozeti oncelik={talep.oncelik} />
          </div>
        </KartIcerik>
      </Kart>
    </Link>
  );
}
