"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Uyari } from "@/components/ui/uyari";
import { useKimlik } from "@/hooks/use-kimlik";
import { apiHataMesaji } from "@/lib/api";
import { kullanicilarApi } from "@/lib/api/kullanicilar";

const profilSemasi = z.object({
  ad: z.string().min(2, "Ad en az 2 karakter olmalıdır.").max(100),
  soyad: z.string().min(2, "Soyad en az 2 karakter olmalıdır.").max(100),
  telefon: z.string().regex(/^0(5\d{2})\d{7}$/, "Telefon numarası 05XXXXXXXXX formatında olmalıdır."),
  adres: z.string().max(500).optional().or(z.literal("")),
});
type ProfilFormu = z.infer<typeof profilSemasi>;

const ROL_ETIKETI: Record<string, string> = {
  vatandas: "Vatandaş",
  personel: "Personel",
  admin: "Yönetici",
};

function ProfilIcerik() {
  const { kullanici } = useKimlik();
  const [sunucuHatasi, setSunucuHatasi] = useState<string | null>(null);
  const [basariMesaji, setBasariMesaji] = useState<string | null>(null);
  const [kaydediliyor, setKaydediliyor] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfilFormu>({
    resolver: zodResolver(profilSemasi),
    defaultValues: {
      ad: kullanici?.ad,
      soyad: kullanici?.soyad,
      telefon: kullanici?.telefon,
      adres: kullanici?.adres ?? "",
    },
  });

  async function gonder(veri: ProfilFormu) {
    if (!kullanici) return;
    setSunucuHatasi(null);
    setBasariMesaji(null);
    setKaydediliyor(true);
    try {
      await kullanicilarApi.guncelle(kullanici.id, { ...veri, adres: veri.adres || undefined });
      setBasariMesaji("Profil bilgileriniz güncellendi.");
    } catch (hata) {
      setSunucuHatasi(apiHataMesaji(hata));
    } finally {
      setKaydediliyor(false);
    }
  }

  if (!kullanici) return null;

  return (
    <>
      <Basli />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="mb-1 text-2xl font-bold text-metin sm:text-3xl">Profilim</h1>
        <p className="mb-6 text-sm text-metin-ikincil">Hesap bilgilerinizi görüntüleyin ve güncelleyin.</p>

        <Kart>
          <KartBasligi>
            <div className="flex items-center justify-between">
              <KartBaslik>Hesap Bilgileri</KartBaslik>
              <span className="rounded-full bg-birincil-600/10 px-3 py-1 text-xs font-medium text-birincil-700 dark:text-birincil-300">
                {ROL_ETIKETI[kullanici.rol]}
              </span>
            </div>
          </KartBasligi>
          <KartIcerik className="space-y-4">
            {sunucuHatasi && <Uyari tur="hata">{sunucuHatasi}</Uyari>}
            {basariMesaji && <Uyari tur="basari">{basariMesaji}</Uyari>}

            <div>
              <Etiket>E-posta Adresi</Etiket>
              <Girdi value={kullanici.e_posta} disabled />
            </div>

            <form onSubmit={handleSubmit(gonder)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Etiket htmlFor="ad">Ad</Etiket>
                  <Girdi id="ad" {...register("ad")} />
                  {errors.ad && <p className="mt-1 text-xs text-tehlike">{errors.ad.message}</p>}
                </div>
                <div>
                  <Etiket htmlFor="soyad">Soyad</Etiket>
                  <Girdi id="soyad" {...register("soyad")} />
                  {errors.soyad && <p className="mt-1 text-xs text-tehlike">{errors.soyad.message}</p>}
                </div>
              </div>

              <div>
                <Etiket htmlFor="telefon">Telefon</Etiket>
                <Girdi id="telefon" {...register("telefon")} />
                {errors.telefon && <p className="mt-1 text-xs text-tehlike">{errors.telefon.message}</p>}
              </div>

              <div>
                <Etiket htmlFor="adres">Adres</Etiket>
                <Girdi id="adres" {...register("adres")} />
              </div>

              <Dugme type="submit" varyant="birincil" disabled={kaydediliyor}>
                {kaydediliyor ? "Kaydediliyor..." : "Bilgileri Kaydet"}
              </Dugme>
            </form>
          </KartIcerik>
        </Kart>
      </main>
      <Altbilgi />
    </>
  );
}

export default function ProfilSayfasi() {
  return (
    <KorumaliRota>
      <ProfilIcerik />
    </KorumaliRota>
  );
}
