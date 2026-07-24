"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Secim } from "@/components/ui/select";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { apiHataMesaji } from "@/lib/api";
import { konumApi } from "@/lib/api/konum";

export default function YoneticiKonumSayfasi() {
  const queryClient = useQueryClient();
  const { data: ilceler, isLoading: ilcelerYukleniyor } = useQuery({
    queryKey: ["ilceler"],
    queryFn: konumApi.ilceleriListele,
  });
  const { data: mahalleler, isLoading: mahallelerYukleniyor } = useQuery({
    queryKey: ["mahalleler"],
    queryFn: () => konumApi.mahalleleriListele(),
  });

  const [ilceForm, setIlceForm] = useState({ ad: "", il: "Tekirdağ", merkez_enlem: "41.3706", merkez_boylam: "27.9917" });
  const [mahalleForm, setMahalleForm] = useState({ ad: "", ilce_id: "", merkez_enlem: "41.3706", merkez_boylam: "27.9917" });
  const [hata, setHata] = useState<string | null>(null);

  async function ilceEkle(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    try {
      await konumApi.ilceOlustur({
        ad: ilceForm.ad,
        il: ilceForm.il,
        merkez_enlem: parseFloat(ilceForm.merkez_enlem),
        merkez_boylam: parseFloat(ilceForm.merkez_boylam),
      });
      queryClient.invalidateQueries({ queryKey: ["ilceler"] });
      setIlceForm({ ad: "", il: "Tekirdağ", merkez_enlem: "41.3706", merkez_boylam: "27.9917" });
    } catch (hataNesnesi) {
      setHata(apiHataMesaji(hataNesnesi));
    }
  }

  async function mahalleEkle(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    try {
      await konumApi.mahalleOlustur({
        ad: mahalleForm.ad,
        ilce_id: mahalleForm.ilce_id,
        merkez_enlem: parseFloat(mahalleForm.merkez_enlem),
        merkez_boylam: parseFloat(mahalleForm.merkez_boylam),
      });
      queryClient.invalidateQueries({ queryKey: ["mahalleler"] });
      setMahalleForm({ ad: "", ilce_id: "", merkez_enlem: "41.3706", merkez_boylam: "27.9917" });
    } catch (hataNesnesi) {
      setHata(apiHataMesaji(hataNesnesi));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-metin sm:text-3xl">İlçe / Mahalle</h1>
        <p className="text-sm text-metin-ikincil">Talep formlarında kullanılacak ilçe ve mahalleleri tanımlayın.</p>
      </div>

      {hata && <Uyari tur="hata">{hata}</Uyari>}

      <div className="grid gap-6 lg:grid-cols-2">
        <Kart>
          <KartBasligi>
            <KartBaslik className="text-lg">İlçeler</KartBaslik>
          </KartBasligi>
          <KartIcerik className="space-y-4">
            <form onSubmit={ilceEkle} className="space-y-3 rounded-xl bg-black/5 p-3 dark:bg-white/5">
              <div>
                <Etiket htmlFor="ilce-ad">İlçe Adı</Etiket>
                <Girdi id="ilce-ad" value={ilceForm.ad} onChange={(e) => setIlceForm({ ...ilceForm, ad: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Girdi
                  placeholder="Enlem"
                  value={ilceForm.merkez_enlem}
                  onChange={(e) => setIlceForm({ ...ilceForm, merkez_enlem: e.target.value })}
                />
                <Girdi
                  placeholder="Boylam"
                  value={ilceForm.merkez_boylam}
                  onChange={(e) => setIlceForm({ ...ilceForm, merkez_boylam: e.target.value })}
                />
              </div>
              <Dugme type="submit" varyant="birincil" boyut="kucuk" className="gap-1.5">
                <Plus size={14} /> İlçe Ekle
              </Dugme>
            </form>

            {ilcelerYukleniyor ? (
              <TamSayfaYukleniyor />
            ) : (
              <ul className="space-y-1.5">
                {ilceler?.map((ilce) => (
                  <li key={ilce.id} className="rounded-lg bg-black/5 px-3 py-2 text-sm dark:bg-white/5">
                    {ilce.ad} <span className="text-xs text-metin-ikincil">({ilce.il})</span>
                  </li>
                ))}
              </ul>
            )}
          </KartIcerik>
        </Kart>

        <Kart>
          <KartBasligi>
            <KartBaslik className="text-lg">Mahalleler</KartBaslik>
          </KartBasligi>
          <KartIcerik className="space-y-4">
            <form onSubmit={mahalleEkle} className="space-y-3 rounded-xl bg-black/5 p-3 dark:bg-white/5">
              <div>
                <Etiket htmlFor="mahalle-ad">Mahalle Adı</Etiket>
                <Girdi
                  id="mahalle-ad"
                  value={mahalleForm.ad}
                  onChange={(e) => setMahalleForm({ ...mahalleForm, ad: e.target.value })}
                  required
                />
              </div>
              <div>
                <Etiket htmlFor="mahalle-ilce">İlçe</Etiket>
                <Secim
                  id="mahalle-ilce"
                  value={mahalleForm.ilce_id}
                  onChange={(e) => setMahalleForm({ ...mahalleForm, ilce_id: e.target.value })}
                  required
                >
                  <option value="">İlçe seçiniz</option>
                  {ilceler?.map((ilce) => (
                    <option key={ilce.id} value={ilce.id}>
                      {ilce.ad}
                    </option>
                  ))}
                </Secim>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Girdi
                  placeholder="Enlem"
                  value={mahalleForm.merkez_enlem}
                  onChange={(e) => setMahalleForm({ ...mahalleForm, merkez_enlem: e.target.value })}
                />
                <Girdi
                  placeholder="Boylam"
                  value={mahalleForm.merkez_boylam}
                  onChange={(e) => setMahalleForm({ ...mahalleForm, merkez_boylam: e.target.value })}
                />
              </div>
              <Dugme type="submit" varyant="birincil" boyut="kucuk" className="gap-1.5">
                <Plus size={14} /> Mahalle Ekle
              </Dugme>
            </form>

            {mahallelerYukleniyor ? (
              <TamSayfaYukleniyor />
            ) : (
              <ul className="max-h-72 space-y-1.5 overflow-y-auto">
                {mahalleler?.map((mahalle) => (
                  <li key={mahalle.id} className="rounded-lg bg-black/5 px-3 py-2 text-sm dark:bg-white/5">
                    {mahalle.ad}
                  </li>
                ))}
              </ul>
            )}
          </KartIcerik>
        </Kart>
      </div>
    </div>
  );
}
