import { Pencil, Trash2 } from "lucide-react";

import { Dugme } from "@/components/ui/button";
import type { Kategori } from "@/types";

interface KategoriTablosuProps {
  kategoriler: Kategori[];
  onDuzenle: (kategori: Kategori) => void;
  onSil: (id: string, ad: string) => void;
}

export function KategoriTablosu({ kategoriler, onDuzenle, onSil }: KategoriTablosuProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-kenarlik bg-zemin shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-kenarlik bg-black/[0.02] font-black uppercase tracking-wider text-metin-ikincil dark:bg-white/[0.02]">
            <tr>
              <th className="px-6 py-4">Renk</th>
              <th className="px-6 py-4">Kategori Adı</th>
              <th className="px-6 py-4">Sorumlu Müdürlük</th>
              <th className="px-6 py-4">Açıklama</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-kenarlik">
            {kategoriler.map((kategori) => (
              <tr key={kategori.id} className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <span
                    className="inline-block h-5 w-5 rounded-lg border border-black/10 shadow-sm"
                    style={{ backgroundColor: kategori.renk }}
                    aria-hidden="true"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-black text-metin">{kategori.ad}</td>
                <td className="px-6 py-4 font-bold text-birincil-600">{kategori.sorumlu_departman}</td>
                <td className="max-w-xs truncate px-6 py-4 font-medium text-metin-ikincil">{kategori.aciklama || "-"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Dugme
                      varyant="hayalet"
                      boyut="simge"
                      className="h-8 w-8 text-metin-ikincil hover:text-metin"
                      onClick={() => onDuzenle(kategori)}
                      aria-label={`${kategori.ad} kategorisini düzenle`}
                    >
                      <Pencil size={15} aria-hidden="true" />
                    </Dugme>
                    <Dugme
                      varyant="hayalet"
                      boyut="simge"
                      className="h-8 w-8 text-metin-ikincil hover:text-tehlike"
                      onClick={() => onSil(kategori.id, kategori.ad)}
                      aria-label={`${kategori.ad} kategorisini sil`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </Dugme>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
