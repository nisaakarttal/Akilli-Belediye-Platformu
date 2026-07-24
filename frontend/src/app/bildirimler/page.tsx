"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { useKimlik } from "@/hooks/use-kimlik";
import { bildirimlerApi } from "@/lib/api/bildirimler";

function tarihiBicimlendir(isoTarih: string) {
  return new Date(isoTarih).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function BildirimlerIcerik() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { kullanici } = useKimlik();

  const { data, isLoading } = useQuery({
    queryKey: ["bildirimler"],
    queryFn: () => bildirimlerApi.listele(),
  });

  // Sorguları sıfırlayan ortak yardımcı fonksiyon (Header'daki kırmızı nokta için kritik!)
  const sorgulariYenile = () => {
    queryClient.invalidateQueries({ queryKey: ["bildirimler"] });
    queryClient.invalidateQueries({ queryKey: ["okunmamis-bildirimler"] });
  };

  async function hepsiniOkunduYap() {
    await bildirimlerApi.tumunuOkunduYap();
    sorgulariYenile();
  }

  async function okunduYap(id: string) {
    await bildirimlerApi.okunduYap(id);
    sorgulariYenile();
  }

  // Bildirime tıklandığında hem okundu yapar hem de talep detayına yönlendirir
  const handleBildirimTikla = async (bildirim: any) => {
    if (!bildirim.okundu_mu) {
      await bildirimlerApi.okunduYap(bildirim.id);
      sorgulariYenile();
    }

    // Eğer bildirimin bağlandığı bir talep_id veya id varsa yönlendir
    const talepId = bildirim.talep_id || bildirim.iliskili_id;
    if (talepId) {
      if (kullanici?.rol === "admin") {
        router.push(`/admin/talepler/${talepId}`);
      } else if (kullanici?.rol === "personel") {
        router.push(`/personel/talepler/${talepId}`);
      } else {
        router.push(`/taleplerim/${talepId}`);
      }
    }
  };

  return (
    <>
      <Basli />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-metin sm:text-3xl">Bildirimler</h1>
          {data && data.some((b) => !b.okundu_mu) && (
            <Dugme varyant="anahat" boyut="kucuk" onClick={hepsiniOkunduYap} className="gap-1.5">
              <Check size={14} /> Tümünü Okundu Yap
            </Dugme>
          )}
        </div>

        {isLoading ? (
          <TamSayfaYukleniyor />
        ) : !data || data.length === 0 ? (
          <Kart>
            <KartIcerik className="flex flex-col items-center gap-3 py-12 text-center">
              <BellOff size={40} className="text-metin-ikincil" />
              <p className="text-metin-ikincil">Henüz bir bildiriminiz yok.</p>
            </KartIcerik>
          </Kart>
        ) : (
          <div className="space-y-2">
            {data.map((bildirim) => (
              <Kart
                key={bildirim.id}
                onClick={() => handleBildirimTikla(bildirim)}
                className={`cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5 ${
                  bildirim.okundu_mu
                    ? "opacity-70"
                    : "border-l-4 border-l-birincil-500 bg-birincil-500/5 font-medium"
                }`}
              >
                <KartIcerik className="flex items-start justify-between gap-3 pt-6">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        bildirim.okundu_mu
                          ? "bg-gray-200 text-gray-500 dark:bg-gray-800"
                          : "bg-birincil-600/10 text-birincil-600"
                      }`}
                    >
                      <Bell size={16} />
                    </span>
                    <div>
                      <p className="font-semibold text-metin">{bildirim.baslik}</p>
                      <p className="mt-0.5 text-sm text-metin-ikincil">{bildirim.mesaj}</p>
                      <p className="mt-1 text-xs text-metin-ikincil">
                        {tarihiBicimlendir(bildirim.olusturulma_tarihi)}
                      </p>
                    </div>
                  </div>
                  {!bildirim.okundu_mu && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Kartın tıklama olayını (yönlendirmeyi) tetiklemesin
                        okunduYap(bildirim.id);
                      }}
                      className="shrink-0 text-xs font-semibold text-birincil-600 hover:underline"
                    >
                      Okundu Yap
                    </button>
                  )}
                </KartIcerik>
              </Kart>
            ))}
          </div>
        )}
      </main>
      <Altbilgi />
    </>
  );
}

export default function BildirimlerSayfasi() {
  return (
    <KorumaliRota>
      <BildirimlerIcerik />
    </KorumaliRota>
  );
}