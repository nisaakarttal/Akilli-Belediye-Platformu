"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, ShieldCheck, ShieldOff } from "lucide-react";
import { useState } from "react";

import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Secim } from "@/components/ui/select";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { kullanicilarApi } from "@/lib/api/kullanicilar";
import type { KullaniciRolu } from "@/types";

const ROL_ETIKETI: Record<KullaniciRolu, string> = {
  vatandas: "Vatandaş",
  personel: "Personel",
  admin: "Yönetici",
};

export default function YoneticiKullanicilarSayfasi() {
  const queryClient = useQueryClient();
  const [arama, setArama] = useState("");
  const [rolFiltresi, setRolFiltresi] = useState<KullaniciRolu | "">("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-kullanicilar", arama, rolFiltresi],
    queryFn: () =>
      kullanicilarApi.listele({
        arama: arama || undefined,
        rol: rolFiltresi || undefined,
        sayfa_boyutu: 50,
      }),
  });

  async function rolDegistir(id: string, rol: KullaniciRolu) {
    await kullanicilarApi.rolGuncelle(id, rol);
    queryClient.invalidateQueries({ queryKey: ["admin-kullanicilar"] });
  }

  async function durumDegistir(id: string, aktifMi: boolean) {
    await kullanicilarApi.durumDegistir(id, aktifMi);
    queryClient.invalidateQueries({ queryKey: ["admin-kullanicilar"] });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-metin sm:text-3xl">Kullanıcılar</h1>
        <p className="text-sm text-metin-ikincil">Tüm kullanıcıları görüntüleyin, rollerini ve durumlarını yönetin.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-metin-ikincil" />
          <Girdi
            placeholder="Ad, soyad veya e-posta ara..."
            className="pl-9"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
        </div>
        <div className="min-w-[180px]">
          <Secim value={rolFiltresi} onChange={(e) => setRolFiltresi(e.target.value as KullaniciRolu | "")}>
            <option value="">Tüm Roller</option>
            <option value="vatandas">Vatandaş</option>
            <option value="personel">Personel</option>
            <option value="admin">Yönetici</option>
          </Secim>
        </div>
      </div>

      {isLoading ? (
        <TamSayfaYukleniyor />
      ) : (
        <div className="space-y-2">
          {data?.veriler.map((kullanici) => (
            <Kart key={kullanici.id}>
              <KartIcerik className="flex flex-wrap items-center justify-between gap-3 pt-6">
                <div>
                  <p className="font-medium text-metin">
                    {kullanici.ad} {kullanici.soyad}
                    {!kullanici.aktif_mi && (
                      <span className="ml-2 rounded-full bg-tehlike/10 px-2 py-0.5 text-xs text-red-600">Pasif</span>
                    )}
                  </p>
                  <p className="text-xs text-metin-ikincil">
                    {kullanici.e_posta} • {kullanici.telefon}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Secim
                    value={kullanici.rol}
                    onChange={(e) => rolDegistir(kullanici.id, e.target.value as KullaniciRolu)}
                    className="h-9 w-36 text-xs"
                  >
                    {Object.entries(ROL_ETIKETI).map(([deger, etiket]) => (
                      <option key={deger} value={deger}>
                        {etiket}
                      </option>
                    ))}
                  </Secim>

                  <Dugme
                    varyant={kullanici.aktif_mi ? "anahat" : "birincil"}
                    boyut="kucuk"
                    className="gap-1.5"
                    onClick={() => durumDegistir(kullanici.id, !kullanici.aktif_mi)}
                  >
                    {kullanici.aktif_mi ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                    {kullanici.aktif_mi ? "Pasif Yap" : "Etkinleştir"}
                  </Dugme>
                </div>
              </KartIcerik>
            </Kart>
          ))}

          {data?.veriler.length === 0 && (
            <Kart>
              <KartIcerik className="py-8 text-center text-sm text-metin-ikincil">
                Aramanızla eşleşen kullanıcı bulunamadı.
              </KartIcerik>
            </Kart>
          )}
        </div>
      )}
    </div>
  );
}
