"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock, FileQuestion, Filter, RefreshCw, Search, Sparkles, UserCheck } from "lucide-react";

import { IstatistikKarti } from "@/components/admin/istatistik-karti";
import { AdminTalepSatiri } from "@/components/admin/talep-satiri";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Secim } from "@/components/ui/select";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { DURUM_SECENEKLERI } from "@/constants/talep";
import { useAdminTalepler } from "@/hooks/use-admin-talepler";
import { cn } from "@/lib/utils";
import type { TalepDurumu } from "@/types";

function AdminTaleplerIcerik() {
  const {
    durumFiltresi,
    setDurumFiltresi,
    arama,
    setArama,
    isLoading,
    isRefetching,
    refetch,
    istatistikler,
    filtrelenmisTalepler,
  } = useAdminTalepler();

  return (
    <div className="space-y-8 pb-12 pt-2">
      {/* İstatistik özeti */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <IstatistikKarti
          ikon={Sparkles}
          etiket="Toplam Başvuru"
          deger={istatistikler.toplam}
          vurgu="birincil"
          aciklama="Sistemdeki tüm bildirimler"
        />
        <IstatistikKarti
          ikon={Clock}
          etiket="Bekleyen Talepler"
          deger={istatistikler.bekleyen}
          vurgu="uyari"
          aciklama="İnceleme/Atama bekliyor"
        />
        <IstatistikKarti
          ikon={UserCheck}
          etiket="İşlemde / Atandı"
          deger={istatistikler.atanan}
          vurgu="ikincil"
          aciklama="Saha personeli görevlendirildi"
        />
        <IstatistikKarti
          ikon={CheckCircle2}
          etiket="Çözüme Ulaşan"
          deger={istatistikler.cozulen}
          vurgu="basarili"
          aciklama="Başarıyla tamamlandı"
        />
      </div>

      {/* Başlık ve yenile eylemi */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-metin sm:text-3xl">Talep &amp; Şikâyet Yönetimi</h1>
          <p className="mt-1 text-sm text-metin-ikincil">
            Vatandaşlar tarafından iletilen tüm talepleri süzün, detaylarını inceleyin ve ekiplere yönlendirin.
          </p>
        </div>

        <Dugme
          varyant="anahat"
          boyut="kucuk"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={cn(isRefetching && "animate-spin")} aria-hidden="true" />
          <span>Talepleri Yenile</span>
        </Dugme>
      </div>

      {/* Arama ve filtre paneli */}
      <div className="space-y-3 rounded-2xl border border-kenarlik bg-birincil-600/5 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-birincil-500" aria-hidden="true" />
            <Girdi
              placeholder="Takip no, başlık, mahalle veya kategori ara..."
              className="pl-9 text-sm"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              aria-label="Taleplerde ara"
            />
          </div>

          <div className="min-w-[180px]">
            <Secim
              value={durumFiltresi}
              onChange={(e) => setDurumFiltresi(e.target.value as TalepDurumu | "")}
              className="text-sm font-medium"
              aria-label="Durum filtresi"
            >
              {DURUM_SECENEKLERI.map((secenek) => (
                <option key={secenek.deger} value={secenek.deger}>
                  {secenek.etiket}
                </option>
              ))}
            </Secim>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="mr-1 flex items-center gap-1 text-xs font-bold text-metin-ikincil">
            <Filter size={12} aria-hidden="true" /> Hızlı Süzgeç:
          </span>
          {DURUM_SECENEKLERI.map((secenek) => (
            <button
              key={secenek.deger}
              onClick={() => setDurumFiltresi(secenek.deger)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold transition-all",
                durumFiltresi === secenek.deger
                  ? "bg-birincil-600 text-white shadow-sm"
                  : "border border-kenarlik bg-zemin text-metin-ikincil hover:bg-black/5 dark:hover:bg-white/5"
              )}
              aria-pressed={durumFiltresi === secenek.deger}
            >
              {secenek.etiket}
            </button>
          ))}
        </div>
      </div>

      {/* Talep listesi */}
      {isLoading ? (
        <TamSayfaYukleniyor />
      ) : filtrelenmisTalepler.length === 0 ? (
        <Kart className="border border-dashed">
          <KartIcerik className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-birincil-600/10 text-birincil-600">
              <FileQuestion size={32} aria-hidden="true" />
            </div>
            <p className="text-base font-bold text-metin">Gösterilecek Talep Bulunamadı</p>
            <p className="mt-1 max-w-sm text-xs text-metin-ikincil">
              Seçtiğiniz filtreler veya arama terimleri ile eşleşen kayıt bulunamadı. Filtreleri temizlemeyi
              deneyebilirsiniz.
            </p>
          </KartIcerik>
        </Kart>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtrelenmisTalepler.map((talep) => (
              <motion.div
                key={talep.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <AdminTalepSatiri talep={talep} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function AdminTaleplerPage() {
  return (
    <KorumaliRota izinliRoller={["admin"]}>
      <AdminTaleplerIcerik />
    </KorumaliRota>
  );
}
