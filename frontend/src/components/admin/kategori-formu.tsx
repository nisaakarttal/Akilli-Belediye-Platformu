"use client";

import { FolderPlus, Loader2, Palette, Pencil, Plus, Save, X } from "lucide-react";
import type { FormEvent } from "react";

import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { HAZIR_KATEGORI_RENKLERI } from "@/constants/kategori";
import type { KategoriIstegi } from "@/lib/api/konum";
import { cn } from "@/lib/utils";

interface KategoriFormuProps {
  form: KategoriIstegi;
  onFormDegistir: (form: KategoriIstegi) => void;
  duzenlenenId: string | null;
  kaydediliyorMu: boolean;
  onSubmit: (e: FormEvent) => void;
  onIptal: () => void;
}

export function KategoriFormu({ form, onFormDegistir, duzenlenenId, kaydediliyorMu, onSubmit, onIptal }: KategoriFormuProps) {
  return (
    <Kart className="relative overflow-hidden border-kenarlik/80 bg-zemin/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-black/[0.02]">
      {duzenlenenId && <div className="absolute left-0 right-0 top-0 h-1.5 bg-uyari" aria-hidden="true" />}

      <KartBasligi className="border-b border-kenarlik/60 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm",
                duzenlenenId ? "bg-uyari/15 text-amber-600 dark:text-amber-400" : "bg-birincil-500/10 text-birincil-600 dark:text-birincil-400"
              )}
            >
              {duzenlenenId ? <Pencil size={20} aria-hidden="true" /> : <FolderPlus size={20} aria-hidden="true" />}
            </div>
            <div>
              <KartBaslik className="text-lg font-bold text-metin">
                {duzenlenenId ? "Kategori Detaylarını Güncelle" : "Sisteme Yeni Kategori Tanımla"}
              </KartBaslik>
              <p className="text-xs font-medium text-metin-ikincil mt-0.5">
                {duzenlenenId ? `ID: #${duzenlenenId} kayıt güncelleniyor.` : "Departman ve yönlendirme kurallarını belirleyin."}
              </p>
            </div>
          </div>

          {duzenlenenId && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-uyari/30 bg-uyari/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <Pencil size={13} aria-hidden="true" />
              <span>Düzenleme Modu</span>
            </span>
          )}
        </div>
      </KartBasligi>

      <KartIcerik className="pt-6">
        <form onSubmit={onSubmit} className="grid gap-6 sm:grid-cols-2" noValidate>

          <div className="space-y-2">
            <Etiket htmlFor="ad" className="text-xs font-bold text-metin">
              Kategori Adı <span className="text-tehlike">*</span>
            </Etiket>
            <Girdi
              id="ad"
              value={form.ad}
              onChange={(e) => onFormDegistir({ ...form, ad: e.target.value })}
              placeholder="Örn: Asfalt ve Yol Tamiri"
              className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20 bg-zemin"
              required
            />
          </div>

          <div className="space-y-2">
            <Etiket htmlFor="departman" className="text-xs font-bold text-metin">
              Sorumlu Müdürlük <span className="text-tehlike">*</span>
            </Etiket>
            <Girdi
              id="departman"
              value={form.sorumlu_departman}
              onChange={(e) => onFormDegistir({ ...form, sorumlu_departman: e.target.value })}
              placeholder="Örn: Fen İşleri Müdürlüğü"
              className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20 bg-zemin"
              required
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Etiket htmlFor="aciklama" className="text-xs font-bold text-metin">
              Açıklama &amp; Vatandaş Yönlendirme Notu
            </Etiket>
            <Girdi
              id="aciklama"
              value={form.aciklama}
              onChange={(e) => onFormDegistir({ ...form, aciklama: e.target.value })}
              placeholder="Vatandaşın bu kategoriyi seçerken göreceği yönlendirici açıklama metni..."
              className="transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20 bg-zemin"
            />
          </div>

          <div className="space-y-3 sm:col-span-2">
            <Etiket
              htmlFor="renk"
              className="flex items-center gap-1.5 text-xs font-bold text-metin"
            >
              <Palette size={15} className="text-birincil-600 dark:text-birincil-400" aria-hidden="true" />
              <span>Kategori Kimlik Rengi</span>
            </Etiket>

            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-kenarlik/70 bg-zemin/60 backdrop-blur-md p-4">
              <input
                id="renk"
                type="color"
                value={form.renk}
                onChange={(e) => onFormDegistir({ ...form, renk: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded-xl border-0 bg-transparent p-1"
                aria-label="Kategori rengini seç"
              />
              <Girdi
                type="text"
                value={form.renk}
                onChange={(e) => onFormDegistir({ ...form, renk: e.target.value })}
                className="w-32 font-mono text-xs font-bold uppercase transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20 bg-zemin"
                aria-label="Kategori renk kodu"
              />

              <div className="flex flex-wrap items-center gap-2 border-l border-kenarlik/80 pl-4">
                <span className="mr-1 text-xs font-bold text-metin-ikincil">Palet:</span>
                {HAZIR_KATEGORI_RENKLERI.map((renk) => (
                  <button
                    key={renk}
                    type="button"
                    onClick={() => onFormDegistir({ ...form, renk })}
                    className="h-7 w-7 rounded-xl border border-black/10 shadow-sm transition-all duration-200 hover:scale-125 active:scale-95"
                    style={{ backgroundColor: renk }}
                    aria-label={`${renk} rengini seç`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-kenarlik/60 pt-5 sm:col-span-2">
            {duzenlenenId && (
              <Dugme type="button" varyant="cam" onClick={onIptal} className="gap-2">
                <X size={16} aria-hidden="true" />
                <span>İptal</span>
              </Dugme>
            )}
            <Dugme
              type="submit"
              varyant="birincil"
              boyut="normal"
              disabled={kaydediliyorMu}
              className="gap-2 px-6 shadow-md shadow-birincil-600/20 transition-all duration-200 hover:shadow-lg"
            >
              {kaydediliyorMu ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  <span>Kaydediliyor...</span>
                </>
              ) : duzenlenenId ? (
                <>
                  <Save size={16} aria-hidden="true" />
                  <span>Güncelle</span>
                </>
              ) : (
                <>
                  <Plus size={16} aria-hidden="true" />
                  <span>Kategori Ekle</span>
                </>
              )}
            </Dugme>
          </div>

        </form>
      </KartIcerik>
    </Kart>
  );
}