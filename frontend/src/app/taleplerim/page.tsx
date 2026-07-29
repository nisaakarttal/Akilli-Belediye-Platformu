"use client";

import { useQuery } from "@tanstack/react-query";
import { FileQuestion, Plus, ClipboardList, Filter, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { TalepKarti } from "@/components/sikayet/talep-karti";
import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { Secim } from "@/components/ui/select";
import { FadeIn, FadeInStagger, StaggerOgesi } from "@/components/ui/animasyon";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { taleplerApi } from "@/lib/api/talepler";
import { DURUM_SECENEKLERI } from "@/constants/talep";
import type { TalepDurumu } from "@/types";

const SAYFA_BOYUTU = 50;

function TaleplerimIcerik() {
  const [durumFiltresi, setDurumFiltresi] = useState<TalepDurumu | "">("");

  const { data, isLoading } = useQuery({
    queryKey: ["taleplerim", durumFiltresi],
    queryFn: () => taleplerApi.listele({ durum: durumFiltresi || undefined, sayfa_boyutu: SAYFA_BOYUTU }),
  });

  return (
    <>
      <Basli />
      <main className="relative min-h-[85vh] bg-zemin">
        {/* Atmosferik Arka Plan Glow Efekti */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-0 right-1/3 h-[450px] w-[450px] rounded-full bg-birincil-500/10 blur-[130px] dark:bg-birincil-500/5" />
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6">

          {/* Başlık ve Üst Eylem Alanı */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-birincil-500/25 bg-birincil-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-birincil-600 mb-3 dark:text-birincil-400">
                <ClipboardList className="h-3.5 w-3.5" />
                <span>Başvuru Geçmişi</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-metin sm:text-4xl">Taleplerim</h1>
              <p className="mt-1.5 text-sm leading-relaxed text-metin-ikincil">
                Belediyemize ilettiğiniz tüm şikâyet, talep ve önerilerin durumunu anlık takip edin.
              </p>
            </div>

            <Link href="/sikayet-olustur">
              <Dugme
                varyant="birincil"
                boyut="normal"
                className="gap-2 shadow-lg shadow-birincil-600/20 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <Plus size={18} aria-hidden="true" />
                <span>Yeni Talep Oluştur</span>
              </Dugme>
            </Link>
          </div>

          {/* Filtreleme Çubuğu */}
          <div className="mb-6 flex items-center gap-3">
            <div className="relative flex items-center max-w-xs w-full">
              <div className="absolute left-3 text-metin-ikincil pointer-events-none">
                <Filter size={15} />
              </div>
              <Secim
                value={durumFiltresi}
                onChange={(e) => setDurumFiltresi(e.target.value as TalepDurumu | "")}
                aria-label="Durum filtresi"
                className="pl-9 transition-all duration-200 focus:ring-2 focus:ring-birincil-500/20 bg-zemin/80 backdrop-blur-md border-kenarlik/80"
              >
                {DURUM_SECENEKLERI.map((secenek) => (
                  <option key={secenek.deger} value={secenek.deger}>
                    {secenek.etiket}
                  </option>
                ))}
              </Secim>
            </div>
          </div>

          {/* İçerik Listesi veya Boş Durum */}
          {isLoading ? (
            <div className="py-20">
              <TamSayfaYukleniyor />
            </div>
          ) : !data || data.veriler.length === 0 ? (
            <FadeIn>
              <Kart className="border-kenarlik/80 bg-zemin/80 backdrop-blur-xl shadow-lg">
                <KartIcerik className="flex flex-col items-center gap-4 py-16 text-center">
                  <div className="rounded-2xl bg-birincil-500/10 p-4 text-birincil-600 dark:text-birincil-400">
                    <FileQuestion size={40} aria-hidden="true" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <p className="text-base font-bold text-metin">Henüz bir talebiniz bulunmuyor</p>
                    <p className="text-xs text-metin-ikincil">Çözülmesini istediğiniz mahalli sorunları bildirmek için ilk adımı atın.</p>
                  </div>
                  <Link href="/sikayet-olustur" className="pt-2">
                    <Dugme varyant="birincil" className="gap-2 shadow-md shadow-birincil-600/20">
                      <Sparkles size={16} />
                      <span>İlk Talebinizi Oluşturun</span>
                    </Dugme>
                  </Link>
                </KartIcerik>
              </Kart>
            </FadeIn>
          ) : (
            <FadeInStagger className="space-y-3.5">
              {data.veriler.map((talep) => (
                <StaggerOgesi key={talep.id}>
                  <div className="transition-all duration-200 hover:-translate-y-0.5">
                    <TalepKarti talep={talep} href={`/taleplerim/${talep.id}`} />
                  </div>
                </StaggerOgesi>
              ))}
            </FadeInStagger>
          )}

        </div>
      </main>
      <Altbilgi />
    </>
  );
}

export default function TaleplerimSayfasi() {
  return (
    <KorumaliRota izinliRoller={["vatandas"]}>
      <TaleplerimIcerik />
    </KorumaliRota>
  );
}