"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, Check } from "lucide-react";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
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
  const { data, isLoading } = useQuery({ queryKey: ["bildirimler"], queryFn: () => bildirimlerApi.listele() });

  async function hepsiniOkunduYap() {
    await bildirimlerApi.tumunuOkunduYap();
    queryClient.invalidateQueries({ queryKey: ["bildirimler"] });
  }

  async function okunduYap(id: string) {
    await bildirimlerApi.okunduYap(id);
    queryClient.invalidateQueries({ queryKey: ["bildirimler"] });
  }

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
                className={bildirim.okundu_mu ? "opacity-70" : "border-birincil-500/30"}
              >
                <KartIcerik className="flex items-start justify-between gap-3 pt-6">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-birincil-600/10 text-birincil-600">
                      <Bell size={16} />
                    </span>
                    <div>
                      <p className="font-medium text-metin">{bildirim.baslik}</p>
                      <p className="mt-0.5 text-sm text-metin-ikincil">{bildirim.mesaj}</p>
                      <p className="mt-1 text-xs text-metin-ikincil">{tarihiBicimlendir(bildirim.olusturulma_tarihi)}</p>
                    </div>
                  </div>
                  {!bildirim.okundu_mu && (
                    <button
                      onClick={() => okunduYap(bildirim.id)}
                      className="shrink-0 text-xs text-birincil-600 hover:underline"
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
