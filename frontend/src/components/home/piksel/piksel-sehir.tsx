import { PikselSprite } from "./piksel-sprite";
import {
  AGAC_GRID,
  AGAC_PALET,
  AMBULANS_GRID,
  AMBULANS_PALET,
  BELEDIYE_BINASI_GRID,
  BELEDIYE_BINASI_PALET,
  BULUT_GRID,
  BULUT_PALET,
  COP_KAMYONU_GRID,
  COP_KAMYONU_PALET,
} from "./sprites";

/**
 * Ana sayfa hero bölümünün arka planındaki dekoratif piksel şehir sahnesi.
 * Yalnızca dekoratiftir — arayüzün geneli retro değildir (bkz. proje tasarım ilkeleri).
 */
export function PikselSehir() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-[2.5rem]"
      aria-hidden="true"
    >
      {/* Gökyüzü gradyanı */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900" />

      {/* Bulutlar */}
      <div className="absolute left-0 top-8 w-24 animate-bulut-kaydir-yavas opacity-90">
        <PikselSprite grid={BULUT_GRID} palet={BULUT_PALET} className="w-full" />
      </div>
      <div className="absolute left-0 top-16 w-16 animate-bulut-kaydir-hizli opacity-70">
        <PikselSprite grid={BULUT_GRID} palet={BULUT_PALET} className="w-full" />
      </div>
      <div className="absolute left-0 top-4 w-20 animate-bulut-kaydir-yavas opacity-60 [animation-delay:-20s]">
        <PikselSprite grid={BULUT_GRID} palet={BULUT_PALET} className="w-full" />
      </div>

      {/* Zemin şeridi */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-emerald-700/80 dark:bg-emerald-950/70" />
      {/* Yol */}
      <div className="absolute inset-x-0 bottom-0 h-8 bg-slate-600 dark:bg-slate-700" />
      <div className="absolute inset-x-0 bottom-[15px] h-0.5 bg-white/40 [background-image:linear-gradient(90deg,white_50%,transparent_50%)] [background-size:24px_2px]" />

      {/* Belediye binası */}
      <div className="absolute bottom-8 left-1/2 w-40 -translate-x-1/2 sm:w-48">
        <PikselSprite grid={BELEDIYE_BINASI_GRID} palet={BELEDIYE_BINASI_PALET} className="w-full" />
      </div>

      {/* Ağaçlar */}
      <div className="absolute bottom-8 left-[6%] w-10 sm:w-12">
        <PikselSprite grid={AGAC_GRID} palet={AGAC_PALET} className="w-full" />
      </div>
      <div className="absolute bottom-8 left-[14%] w-8 sm:w-10">
        <PikselSprite grid={AGAC_GRID} palet={AGAC_PALET} className="w-full" />
      </div>
      <div className="absolute bottom-8 right-[14%] w-8 sm:w-10">
        <PikselSprite grid={AGAC_GRID} palet={AGAC_PALET} className="w-full" />
      </div>
      <div className="absolute bottom-8 right-[6%] w-10 sm:w-12">
        <PikselSprite grid={AGAC_GRID} palet={AGAC_PALET} className="w-full" />
      </div>

      {/* Hareket eden araçlar */}
      <div className="absolute bottom-0 w-16 animate-arac-kaydir-yavas sm:w-20">
        <PikselSprite grid={COP_KAMYONU_GRID} palet={COP_KAMYONU_PALET} className="w-full" />
      </div>
      <div className="absolute bottom-0 w-14 animate-arac-kaydir-hizli sm:w-16 [animation-delay:-8s]">
        <PikselSprite grid={AMBULANS_GRID} palet={AMBULANS_PALET} className="w-full" />
      </div>
    </div>
  );
}
