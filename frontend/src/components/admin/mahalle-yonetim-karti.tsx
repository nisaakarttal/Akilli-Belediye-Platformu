"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Compass, Loader2, MapPin, Plus, Search, X } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Secim } from "@/components/ui/select";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { cn } from "@/lib/utils";
import type { Ilce, Mahalle } from "@/types";

interface MahalleFormDegerleri {
  ad: string;
  ilce_id: string;
  merkez_enlem: string;
  merkez_boylam: string;
}

interface MahalleYonetimKartiProps {
  ilceler: Ilce[];
  mahallelerYukleniyor: boolean;
  filtrelenmisMahalleler: Mahalle[];
  form: MahalleFormDegerleri;
  onFormDegistir: Dispatch<SetStateAction<MahalleFormDegerleri>>;
  kaydediliyorMu: boolean;
  onSubmit: (e: FormEvent) => void;
  arama: string;
  onAramaDegistir: (deger: string) => void;
  seciliIlceFiltresi: string;
  onIlceFiltresiDegistir: (deger: string) => void;
}

/** Admin "Konum Yönetimi" sayfasındaki mahalle tanımlama formu + arama/filtre + liste. */
export function MahalleYonetimKarti({
  ilceler,
  mahalleler,
  mahallelerYukleniyor,
  filtrelenmisMahalleler,
  form,
  onFormDegistir,
  kaydediliyorMu,
  onSubmit,
  arama,
  onAramaDegistir,
  seciliIlceFiltresi,
  onIlceFiltresiDegistir,
}: MahalleYonetimKartiProps) {
  return (
    <Kart className="relative flex flex-col overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-ikincil-500 to-sky-600" aria-hidden="true" />
      <KartBasligi className="border-b border-kenarlik pb-4">
        <div className="flex items-center gap-2 font-bold text-sky-700 dark:text-sky-300">
          <MapPin size={20} className="text-ikincil-500" aria-hidden="true" />
          <KartBaslik className="text-lg">Mahalle Tanımları</KartBaslik>
        </div>
      </KartBasligi>

      <KartIcerik className="flex flex-1 flex-col space-y-5 pt-5">
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-kenarlik bg-ikincil-500/5 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Etiket htmlFor="mahalle-ad" className="text-xs font-bold text-metin">
                Mahalle Adı <span className="text-tehlike">*</span>
              </Etiket>
              <Girdi
                id="mahalle-ad"
                placeholder="Örn: Cumhuriyet Mah."
                value={form.ad}
                onChange={(e) => onFormDegistir({ ...form, ad: e.target.value })}
                className="text-sm"
                required
              />
            </div>

            <div className="space-y-1">
              <Etiket htmlFor="mahalle-ilce" className="text-xs font-bold text-metin">
                Bağlı Olduğu İlçe <span className="text-tehlike">*</span>
              </Etiket>
              <Secim
                id="mahalle-ilce"
                value={form.ilce_id}
                onChange={(e) => onFormDegistir({ ...form, ilce_id: e.target.value })}
                className="text-sm"
                required
              >
                <option value="">İlçe seçiniz</option>
                {ilceler.map((ilce) => (
                  <option key={ilce.id} value={ilce.id}>
                    {ilce.ad} ({ilce.il})
                  </option>
                ))}
              </Secim>
            </div>
          </div>

          <div className="space-y-1">
            <Etiket className="flex items-center gap-1 text-[11px] font-bold text-metin-ikincil">
              <Compass size={12} className="text-ikincil-500" aria-hidden="true" /> GPS Merkez Koordinatları
            </Etiket>
            <div className="grid grid-cols-2 gap-2">
              <Girdi
                placeholder="Enlem (Lat)"
                value={form.merkez_enlem}
                onChange={(e) => onFormDegistir({ ...form, merkez_enlem: e.target.value })}
                className="text-xs font-mono"
                aria-label="Mahalle merkez enlem"
              />
              <Girdi
                placeholder="Boylam (Lng)"
                value={form.merkez_boylam}
                onChange={(e) => onFormDegistir({ ...form, merkez_boylam: e.target.value })}
                className="text-xs font-mono"
                aria-label="Mahalle merkez boylam"
              />
            </div>
          </div>

          <Dugme type="submit" varyant="birincil" boyut="kucuk" disabled={kaydediliyorMu} className="w-full gap-1.5">
            {kaydediliyorMu ? (
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            ) : (
              <Plus size={15} aria-hidden="true" />
            )}
            <span>Mahalle Kaydet</span>
          </Dugme>
        </form>

        <div className="space-y-2.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-metin-ikincil">
              <span>Mahalle Listesi</span>
              <span className="rounded-full bg-ikincil-500/10 px-2 py-0.5 text-[10px] font-extrabold text-sky-600">
                {filtrelenmisMahalleler.length}
              </span>
            </h3>

            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => onIlceFiltresiDegistir("HEPSISI")}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all",
                  seciliIlceFiltresi === "HEPSISI"
                    ? "bg-ikincil-500 text-white shadow-sm"
                    : "bg-ikincil-500/10 text-sky-700 hover:bg-ikincil-500/20 dark:text-sky-300"
                )}
                aria-pressed={seciliIlceFiltresi === "HEPSISI"}
              >
                Tümü
              </button>
              {ilceler.map((ilce) => (
                <button
                  key={ilce.id}
                  onClick={() => onIlceFiltresiDegistir(ilce.id)}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all",
                    seciliIlceFiltresi === ilce.id
                      ? "bg-ikincil-500 text-white shadow-sm"
                      : "bg-ikincil-500/10 text-sky-700 hover:bg-ikincil-500/20 dark:text-sky-300"
                  )}
                  aria-pressed={seciliIlceFiltresi === ilce.id}
                >
                  {ilce.ad}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ikincil-500" aria-hidden="true" />
            <Girdi
              value={arama}
              onChange={(e) => onAramaDegistir(e.target.value)}
              placeholder="Mahalle adı yazarak süzün..."
              className="pl-8 text-xs"
              aria-label="Mahallelerde ara"
            />
            {arama && (
              <button
                onClick={() => onAramaDegistir("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-metin-ikincil hover:text-metin"
                aria-label="Aramayı temizle"
              >
                <X size={12} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1">
          {mahallelerYukleniyor ? (
            <TamSayfaYukleniyor />
          ) : filtrelenmisMahalleler.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-kenarlik bg-ikincil-500/5 py-8 text-center text-xs text-metin-ikincil">
              Aramaya uygun mahalle bulunamadı.
            </div>
          ) : (
            <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
              <AnimatePresence>
                {filtrelenmisMahalleler.map((mahalle) => {
                  const bagliIlce = ilceler.find((i) => i.id === mahalle.ilce_id);
                  return (
                    <motion.li
                      key={mahalle.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between rounded-xl border border-kenarlik bg-black/[0.02] p-3 transition-all hover:border-ikincil-500/40 hover:shadow-md dark:bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ikincil-500 text-white shadow-sm" aria-hidden="true">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-metin">{mahalle.ad}</p>
                          <p className="text-[11px] font-semibold text-sky-600">
                            {bagliIlce ? bagliIlce.ad : "İlçe Tanımsız"}
                          </p>
                        </div>
                      </div>

                      <span className="rounded-md border border-kenarlik bg-zemin px-2 py-1 font-mono text-[11px] font-medium text-metin-ikincil">
                        {mahalle.merkez_enlem.toFixed(2)}, {mahalle.merkez_boylam.toFixed(2)}
                      </span>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </KartIcerik>
    </Kart>
  );
}
