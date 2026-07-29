import { Building2, Pencil, Trash2 } from "lucide-react";

import { Dugme } from "@/components/ui/button";
import { Kart } from "@/components/ui/card";
import { VARSAYILAN_KATEGORI_RENGI } from "@/constants/kategori";
import type { Kategori } from "@/types";

interface KategoriKartiProps {
  kategori: Kategori;
  onDuzenle: () => void;
  onSil: () => void;
  silinebilirMi: boolean;
}

export function KategoriKarti({ kategori, onDuzenle, onSil, silinebilirMi }: KategoriKartiProps) {
  const renk = kategori.renk || VARSAYILAN_KATEGORI_RENGI;

  return (
    <Kart className="group relative flex h-full flex-col justify-between overflow-hidden border-kenarlik/80 bg-zemin/80 backdrop-blur-xl p-6 shadow-xl shadow-black/[0.02] transition-all duration-300 hover:-translate-y-1 hover:border-birincil-500/40 hover:shadow-2xl">

      {/* Kategori rengine duyarlı dinamik atmosferik arka plan ışığı */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-15 blur-3xl transition-opacity duration-300 group-hover:opacity-35"
        style={{ backgroundColor: renk }}
        aria-hidden="true"
      />

      <div>
        <div className="flex items-start justify-between gap-3">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-extrabold text-white shadow-md transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: renk }}
            aria-hidden="true"
          >
            {kategori.ad.charAt(0).toLocaleUpperCase("tr-TR")}
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-kenarlik/80 bg-zemin/60 backdrop-blur-md p-1 shadow-sm">
            <Dugme
              varyant="hayalet"
              boyut="simge"
              className="h-8 w-8 text-metin-ikincil hover:text-metin hover:bg-black/5 dark:hover:bg-white/5"
              onClick={onDuzenle}
              aria-label={`${kategori.ad} kategorisini düzenle`}
            >
              <Pencil size={15} aria-hidden="true" />
            </Dugme>
            <Dugme
              varyant="hayalet"
              boyut="simge"
              className="h-8 w-8 text-metin-ikincil hover:bg-tehlike/15 hover:text-tehlike"
              onClick={onSil}
              disabled={!silinebilirMi}
              aria-label={`${kategori.ad} kategorisini sil`}
            >
              <Trash2 size={15} aria-hidden="true" />
            </Dugme>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          <h3 className="text-lg font-bold tracking-tight text-metin transition-colors group-hover:text-birincil-600 dark:group-hover:text-birincil-400">
            {kategori.ad}
          </h3>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-kenarlik/70 bg-zemin/60 px-3 py-1 text-xs font-semibold text-metin-ikincil shadow-sm">
            <Building2 size={13} className="text-birincil-600 dark:text-birincil-400" aria-hidden="true" />
            <span>{kategori.sorumlu_departman}</span>
          </div>

          {kategori.aciklama && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-metin-ikincil">
              {kategori.aciklama}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-kenarlik/60 pt-4 font-mono text-xs font-bold text-metin-ikincil">
        <span className="uppercase">{renk}</span>
        <span
          className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm"
          style={{ backgroundColor: renk }}
          aria-hidden="true"
        />
      </div>

    </Kart>
  );
}