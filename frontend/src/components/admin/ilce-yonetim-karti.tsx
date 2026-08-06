"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building, Loader2, Navigation, Plus } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

import { Button } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import type { Ilce } from "@/types";

interface IlceFormDegerleri {
  ad: string;
  il: string;
  merkez_enlem: string;
  merkez_boylam: string;
}

interface IlceYonetimKartiProps {
  ilceler: Ilce[];
  ilcelerYukleniyor: boolean;
  form: IlceFormDegerleri;
  onFormDegistir: Dispatch<SetStateAction<IlceFormDegerleri>>;
  kaydediliyorMu: boolean;
  onSubmit: (e: FormEvent) => void;
}

/** Admin "Konum Yönetimi" sayfasındaki ilçe tanımlama formu + kayıtlı ilçeler listesi. */
export function IlceYonetimKarti({ ilceler, ilcelerYukleniyor, form, onFormDegistir, kaydediliyorMu, onSubmit }: IlceYonetimKartiProps) {
  return (
    <Kart className="relative flex flex-col overflow-hidden border-kenarlik/80 bg-zemin/80 backdrop-blur-xl shadow-xl shadow-black/[0.02]">
      <div className="h-1.5 w-full bg-gradient-to-r from-birincil-500 to-birincil-700" aria-hidden="true" />

      <KartBasligi className="border-b border-kenarlik/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-birincil-500/10 p-2 text-birincil-600 dark:text-birincil-400">
            <Building size={20} aria-hidden="true" />
          </div>
          <div>
            <KartBaslik className="text-lg font-bold text-metin">İlçe Tanımları</KartBaslik>
            <p className="text-xs text-metin-ikincil mt-0.5">Sisteme yeni ilçe ve merkez koordinatları ekleyin.</p>
          </div>
        </div>
      </KartBasligi>

      <KartIcerik className="flex flex-1 flex-col space-y-6 pt-6">
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-birincil-500/20 bg-birincil-500/5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Etiket htmlFor="ilce-ad" className="text-xs font-bold text-metin">
                İlçe Adı <span className="text-tehlike">*</span>
              </Etiket>
              <Input
                id="ilce-ad"
                placeholder="Örn: Kapaklı"
                value={form.ad}
                onChange={(e) => onFormDegistir({ ...form, ad: e.target.value })}
                className="text-sm transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20 bg-zemin"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Etiket htmlFor="ilce-il" className="text-xs font-bold text-metin">
                Bağlı İl <span className="text-tehlike">*</span>
              </Etiket>
              <Input
                id="ilce-il"
                value={form.il}
                onChange={(e) => onFormDegistir({ ...form, il: e.target.value })}
                className="text-sm transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20 bg-zemin"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Etiket className="flex items-center gap-1.5 text-xs font-bold text-metin-ikincil">
              <Navigation size={13} className="text-birincil-600 dark:text-birincil-400" aria-hidden="true" />
              <span>GPS Merkez Koordinatları</span>
            </Etiket>
            <div className="grid grid-cols-2 gap-2.5">
              <Input
                placeholder="Enlem (Lat)"
                value={form.merkez_enlem}
                onChange={(e) => onFormDegistir({ ...form, merkez_enlem: e.target.value })}
                className="text-xs font-mono transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20 bg-zemin"
                aria-label="İlçe merkez enlem"
              />
              <Input
                placeholder="Boylam (Lng)"
                value={form.merkez_boylam}
                onChange={(e) => onFormDegistir({ ...form, merkez_boylam: e.target.value })}
                className="text-xs font-mono transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20 bg-zemin"
                aria-label="İlçe merkez boylam"
              />
            </div>
          </div>

          <Button
            type="submit"
            varyant="birincil"
            boyut="normal"
            disabled={kaydediliyorMu}
            className="w-full gap-2 shadow-md shadow-birincil-600/20 transition-all duration-200 hover:shadow-lg"
          >
            {kaydediliyorMu ? (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            ) : (
              <Plus size={16} aria-hidden="true" />
            )}
            <span>İlçe Kaydet</span>
          </Button>
        </form>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-metin-ikincil">Kayıtlı İlçeler</h3>
            <span className="rounded-full bg-birincil-500/10 px-2.5 py-0.5 text-xs font-extrabold text-birincil-600 dark:text-birincil-400">
              {ilceler.length}
            </span>
          </div>

          {ilcelerYukleniyor ? (
            <div className="py-10">
              <TamSayfaYukleniyor />
            </div>
          ) : ilceler.length === 0 ? (
            <div className="rounded-2xl border border-kenarlik/60 bg-zemin/50 p-6 text-center">
              <p className="text-xs text-metin-ikincil">Henüz ilçe kaydı bulunmuyor.</p>
            </div>
          ) : (
            <ul className="max-h-64 space-y-2.5 overflow-y-auto pr-1">
              <AnimatePresence>
                {ilceler.map((ilce) => (
                  <motion.li
                    key={ilce.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="group flex items-center justify-between rounded-2xl border border-kenarlik/70 bg-zemin/60 backdrop-blur-md p-3.5 transition-all duration-300 hover:border-birincil-500/40 hover:shadow-md hover:shadow-black/[0.02]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-birincil-600 text-white shadow-sm transition-transform duration-300 group-hover:scale-105" aria-hidden="true">
                        <Building size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-metin">{ilce.ad}</p>
                        <p className="text-[11px] font-semibold text-birincil-600 dark:text-birincil-400">{ilce.il}</p>
                      </div>
                    </div>

                    <span className="rounded-xl border border-kenarlik/80 bg-zemin px-2.5 py-1 font-mono text-xs font-semibold text-metin-ikincil">
                      {ilce.merkez_enlem.toFixed(2)}, {ilce.merkez_boylam.toFixed(2)}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </KartIcerik>
    </Kart>
  );
}