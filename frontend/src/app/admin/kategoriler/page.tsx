"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { apiHataMesaji } from "@/lib/api";
import { kategorilerApi, type KategoriIstegi } from "@/lib/api/konum";
import type { Kategori } from "@/types";

const BOS_FORM: KategoriIstegi = { ad: "", aciklama: "", ikon: "", sorumlu_departman: "", renk: "#2563EB" };

export default function YoneticiKategorilerSayfasi() {
  const queryClient = useQueryClient();
  const { data: kategoriler, isLoading } = useQuery({ queryKey: ["kategoriler"], queryFn: kategorilerApi.listele });

  const [form, setForm] = useState<KategoriIstegi>(BOS_FORM);
  const [duzenlenenId, setDuzenlenenId] = useState<string | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  function duzenlemeyeBasla(kategori: Kategori) {
    setDuzenlenenId(kategori.id);
    setForm({
      ad: kategori.ad,
      aciklama: kategori.aciklama ?? "",
      ikon: kategori.ikon ?? "",
      sorumlu_departman: kategori.sorumlu_departman,
      renk: kategori.renk,
    });
  }

  function formuSifirla() {
    setDuzenlenenId(null);
    setForm(BOS_FORM);
  }

  async function gonder(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    setKaydediliyor(true);
    try {
      if (duzenlenenId) {
        await kategorilerApi.guncelle(duzenlenenId, form);
      } else {
        await kategorilerApi.olustur(form);
      }
      queryClient.invalidateQueries({ queryKey: ["kategoriler"] });
      formuSifirla();
    } catch (hataNesnesi) {
      setHata(apiHataMesaji(hataNesnesi));
    } finally {
      setKaydediliyor(false);
    }
  }

  async function sil(id: string) {
    if (!confirm("Bu kategoriyi silmek istediğinizden emin misiniz?")) return;
    try {
      await kategorilerApi.sil(id);
      queryClient.invalidateQueries({ queryKey: ["kategoriler"] });
    } catch (hataNesnesi) {
      setHata(apiHataMesaji(hataNesnesi, "Kategori silinemedi. Bu kategoriye bağlı talepler olabilir."));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-metin sm:text-3xl">Kategoriler</h1>
        <p className="text-sm text-metin-ikincil">Şikâyet/talep kategorilerini yönetin.</p>
      </div>

      <Kart>
        <KartBasligi>
          <KartBaslik className="text-lg">{duzenlenenId ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}</KartBaslik>
        </KartBasligi>
        <KartIcerik>
          {hata && <Uyari tur="hata">{hata}</Uyari>}
          <form onSubmit={gonder} className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <Etiket htmlFor="ad">Kategori Adı</Etiket>
              <Girdi id="ad" value={form.ad} onChange={(e) => setForm({ ...form, ad: e.target.value })} required />
            </div>
            <div>
              <Etiket htmlFor="departman">Sorumlu Müdürlük</Etiket>
              <Girdi
                id="departman"
                value={form.sorumlu_departman}
                onChange={(e) => setForm({ ...form, sorumlu_departman: e.target.value })}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Etiket htmlFor="aciklama">Açıklama</Etiket>
              <Girdi id="aciklama" value={form.aciklama} onChange={(e) => setForm({ ...form, aciklama: e.target.value })} />
            </div>
            <div>
              <Etiket htmlFor="renk">Renk</Etiket>
              <Girdi id="renk" type="color" value={form.renk} onChange={(e) => setForm({ ...form, renk: e.target.value })} />
            </div>

            <div className="flex items-end gap-2 sm:col-span-2">
              <Dugme type="submit" varyant="birincil" disabled={kaydediliyor} className="gap-1.5">
                <Plus size={16} /> {duzenlenenId ? "Güncelle" : "Ekle"}
              </Dugme>
              {duzenlenenId && (
                <Dugme type="button" varyant="anahat" onClick={formuSifirla} className="gap-1.5">
                  <X size={16} /> Vazgeç
                </Dugme>
              )}
            </div>
          </form>
        </KartIcerik>
      </Kart>

      {isLoading ? (
        <TamSayfaYukleniyor />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {kategoriler?.map((kategori) => (
            <Kart key={kategori.id}>
              <KartIcerik className="flex items-start justify-between gap-3 pt-6">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: kategori.renk }} />
                  <div>
                    <p className="font-medium text-metin">{kategori.ad}</p>
                    <p className="text-xs text-metin-ikincil">{kategori.sorumlu_departman}</p>
                    {kategori.aciklama && <p className="mt-1 text-xs text-metin-ikincil">{kategori.aciklama}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Dugme varyant="hayalet" boyut="simge" onClick={() => duzenlemeyeBasla(kategori)} aria-label="Düzenle">
                    <Pencil size={14} />
                  </Dugme>
                  <Dugme varyant="hayalet" boyut="simge" onClick={() => sil(kategori.id)} aria-label="Sil">
                    <Trash2 size={14} className="text-tehlike" />
                  </Dugme>
                </div>
              </KartIcerik>
            </Kart>
          ))}
        </div>
      )}
    </div>
  );
}
