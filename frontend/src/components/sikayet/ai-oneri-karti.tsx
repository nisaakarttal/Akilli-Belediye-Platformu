import { AlertCircle, Sparkles } from "lucide-react";

import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
import { Dugme } from "@/components/ui/button";
import type { AnalizYaniti } from "@/types";

export function AiOneriKarti({
  analiz,
  uygulandiMi,
  onUygula,
}: {
  analiz: AnalizYaniti;
  uygulandiMi: boolean;
  onUygula: () => void;
}) {
  return (
    <div className="rounded-xl border border-birincil-500/30 bg-birincil-500/5 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles size={18} className="text-birincil-500" />
        <p className="text-sm font-semibold text-metin">Yapay Zekâ Önerisi</p>
      </div>

      <p className="mb-3 text-sm text-metin-ikincil">{analiz.ai_mesaji}</p>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {analiz.onerilen_kategori_adi && (
          <span className="rounded-full bg-birincil-600/10 px-2.5 py-1 text-xs font-medium text-birincil-700 dark:text-birincil-300">
            {analiz.onerilen_kategori_adi}
          </span>
        )}
        <OncelikRozeti oncelik={analiz.onerilen_oncelik} />
        <span className="text-xs text-metin-ikincil">
          Güven skoru: %{Math.round(analiz.guven_skoru * 100)}
        </span>
      </div>

      {analiz.eksik_bilgiler.length > 0 && (
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-uyari/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Eksik olabilecek bilgiler:</p>
            <ul className="mt-1 list-inside list-disc">
              {analiz.eksik_bilgiler.map((oge) => (
                <li key={oge}>{oge}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {analiz.onerilen_kategori_adi && (
        <Dugme type="button" varyant="anahat" boyut="kucuk" onClick={onUygula} disabled={uygulandiMi}>
          {uygulandiMi ? "Öneri Uygulandı" : "Öneriyi Uygula"}
        </Dugme>
      )}
    </div>
  );
}
