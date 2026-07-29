import { Bell, Check, ChevronRight, Clock, RotateCcw } from "lucide-react";

import { Kart, KartIcerik } from "@/components/ui/card";
import { VURGU_ROZET_SINIFLARI, type VurguRengi } from "@/constants/vurgu";
import { bildirimTipiGetir } from "@/constants/bildirim";
import { tarihSaatKisaFormatla } from "@/lib/tarih";
import { cn } from "@/lib/utils";
import type { Bildirim } from "@/types";

/** Vurgu şeridi ve okunmamış ikon çerçevesi için ince kenarlık sınıfı. */
const VURGU_KENAR_SINIFLARI: Record<VurguRengi, string> = {
  birincil: "border-birincil-500/20",
  ikincil: "border-ikincil-500/20",
  basarili: "border-basarili/20",
  uyari: "border-uyari/20",
  tehlike: "border-tehlike/20",
};

interface BildirimSatiriProps {
  bildirim: Bildirim;
  onTikla: () => void;
  onOkunduYap: () => void;
  onOkunmadiYap: () => void;
  okunduIsleniyorMu: boolean;
  okunmadiIsleniyorMu: boolean;
}

export function BildirimSatiri({
  bildirim,
  onTikla,
  onOkunduYap,
  onOkunmadiYap,
  okunduIsleniyorMu,
  okunmadiIsleniyorMu,
}: BildirimSatiriProps) {
  const okunmadi = !bildirim.okundu_mu;
  const tip = bildirimTipiGetir(bildirim.baslik);
  const TipIkonu = tip.ikon;

  return (
    <Kart
      onClick={onTikla}
      className={cn(
        "group relative cursor-pointer overflow-hidden border-kenarlik/80 bg-zemin/80 backdrop-blur-xl shadow-xl shadow-black/[0.02] transition-all duration-300 active:scale-[0.995]",
        okunmadi
          ? "border-birincil-500/40 shadow-birincil-500/5 hover:border-birincil-500 hover:shadow-2xl"
          : "opacity-80 hover:opacity-100"
      )}
    >
      {okunmadi && (
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-birincil-500 to-ikincil-500" aria-hidden="true" />
      )}

      <KartIcerik className="flex items-start justify-between gap-4 p-5">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105",
              okunmadi ? VURGU_ROZET_SINIFLARI.birincil : "bg-black/5 text-metin-ikincil dark:bg-white/10"
            )}
            aria-hidden="true"
          >
            <Bell size={20} />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-sm",
                  VURGU_ROZET_SINIFLARI[tip.vurgu],
                  VURGU_KENAR_SINIFLARI[tip.vurgu]
                )}
              >
                <TipIkonu size={13} aria-hidden="true" />
                <span>{tip.etiket}</span>
              </span>

              <p className={cn("truncate text-sm tracking-tight", okunmadi ? "font-bold text-metin" : "font-semibold text-metin-ikincil")}>
                {bildirim.baslik}
              </p>

              {okunmadi && <span className="ml-auto h-2.5 w-2.5 rounded-full bg-birincil-500 animate-pulse shadow-sm sm:ml-0" aria-hidden="true" />}
            </div>

            <p className="break-words text-xs font-medium leading-relaxed text-metin-ikincil">{bildirim.mesaj}</p>

            <div className="flex items-center gap-1.5 pt-1 text-[11px] font-semibold text-metin-ikincil">
              <Clock size={13} aria-hidden="true" />
              <span>{tarihSaatKisaFormatla(bildirim.olusturulma_tarihi)}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 self-center">
          {okunmadi ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOkunduYap();
              }}
              disabled={okunduIsleniyorMu}
              className="inline-flex items-center gap-1.5 rounded-xl border border-birincil-500/20 bg-birincil-500/10 px-3 py-2 text-xs font-bold text-birincil-600 dark:text-birincil-400 transition-all duration-200 hover:bg-birincil-500/20 active:scale-95 shadow-sm"
              title="Okundu İşaretle"
            >
              <Check size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Okundu</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOkunmadiYap();
              }}
              disabled={okunmadiIsleniyorMu}
              className="inline-flex items-center gap-1.5 rounded-xl border border-kenarlik/80 bg-zemin/60 backdrop-blur-md px-3 py-2 text-xs font-bold text-metin-ikincil opacity-0 transition-all duration-200 hover:border-uyari/30 hover:bg-uyari/10 hover:text-amber-600 active:scale-95 dark:bg-white/5 sm:opacity-100 group-hover:opacity-100 shadow-sm"
              title="Okunmadı Olarak İşaretle"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Okunmadı Yap</span>
            </button>
          )}

          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-metin-ikincil/50 transition-all duration-200 group-hover:bg-birincil-500/10 group-hover:text-birincil-600 dark:group-hover:text-birincil-400"
            title="İlgili Sayfaya Git"
            aria-hidden="true"
          >
            <ChevronRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </KartIcerik>
    </Kart>
  );
}