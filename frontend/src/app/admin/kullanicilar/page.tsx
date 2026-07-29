"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, Search, ShieldAlert, Users, UserCheck, UserX, X } from "lucide-react";

import { IstatistikKarti } from "@/components/admin/istatistik-karti";
import { KullaniciSatiri } from "@/components/admin/kullanici-satiri";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Secim } from "@/components/ui/select";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { ROL_ETIKETI } from "@/constants/kullanici";
import { useAdminKullanicilar } from "@/hooks/use-admin-kullanicilar";
import { cn } from "@/lib/utils";
import type { KullaniciRolu } from "@/types";

function YoneticiKullanicilarIcerik() {
  const {
    arama,
    setArama,
    rolFiltresi,
    setRolFiltresi,
    hata,
    basari,
    isLoading,
    isRefetching,
    refetch,
    kullanicilar,
    istatistikler,
    rolGuncelleMutation,
    durumDegistirMutation,
  } = useAdminKullanicilar();

  return (
    <div className="space-y-8">
      {/* İstatistik özeti */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <IstatistikKarti
          ikon={Users}
          etiket="Toplam Kullanıcı"
          deger={istatistikler.toplam}
          vurgu="birincil"
          aciklama="Kayıtlı kullanıcı portföyü"
        />
        <IstatistikKarti
          ikon={UserCheck}
          etiket="Aktif Hesaplar"
          deger={istatistikler.aktifler}
          vurgu="basarili"
          aciklama="Erişim yetkisi açık"
        />
        <IstatistikKarti
          ikon={UserX}
          etiket="Pasif / Kısıtlı"
          deger={istatistikler.pasifler}
          vurgu="tehlike"
          aciklama="Dondurulmuş hesaplar"
        />
        <IstatistikKarti
          ikon={ShieldAlert}
          etiket="Sistem Yöneticileri"
          deger={istatistikler.adminler}
          vurgu="uyari"
          aciklama="Tam yetkili kullanıcılar"
        />
      </div>

      {/* Başlık ve yenile eylemi */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-metin sm:text-3xl">Kullanıcı Yönetimi</h1>
          <p className="mt-1 text-sm text-metin-ikincil">
            Tüm kullanıcı hesaplarını görüntüleyin, yetkilendirmeleri yapın ve erişim durumlarını yönetin.
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
          <span>Listeyi Yenile</span>
        </Dugme>
      </div>

      {/* Bildirim alanı */}
      <AnimatePresence mode="wait">
        {hata && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Uyari tur="hata">{hata}</Uyari>
          </motion.div>
        )}
        {basari && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Uyari tur="basari">{basari}</Uyari>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arama ve rol filtreleme çubuğu */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-kenarlik bg-birincil-600/5 p-4 shadow-sm">
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-birincil-500" aria-hidden="true" />
          <Girdi
            placeholder="Ad, soyad veya e-posta ile ara..."
            className="pl-9 pr-9 text-sm"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            aria-label="Kullanıcılarda ara"
          />
          {arama && (
            <button
              onClick={() => setArama("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-metin-ikincil hover:text-metin"
              aria-label="Aramayı temizle"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="min-w-[180px]">
          <Secim
            value={rolFiltresi}
            onChange={(e) => setRolFiltresi(e.target.value as KullaniciRolu | "")}
            className="text-sm font-medium"
            aria-label="Rol filtresi"
          >
            <option value="">Tüm Roller</option>
            {Object.entries(ROL_ETIKETI).map(([deger, etiket]) => (
              <option key={deger} value={deger}>
                {etiket}
              </option>
            ))}
          </Secim>
        </div>
      </div>

      {/* Liste görünümü */}
      {isLoading ? (
        <TamSayfaYukleniyor />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {kullanicilar.map((kullanici) => (
              <motion.div
                key={kullanici.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <KullaniciSatiri
                  kullanici={kullanici}
                  rolGuncelleniyorMu={rolGuncelleMutation.isPending && rolGuncelleMutation.variables?.id === kullanici.id}
                  durumGuncelleniyorMu={
                    durumDegistirMutation.isPending && durumDegistirMutation.variables?.id === kullanici.id
                  }
                  onRolDegistir={(rol) => rolGuncelleMutation.mutate({ id: kullanici.id, rol })}
                  onDurumDegistir={() =>
                    durumDegistirMutation.mutate({ id: kullanici.id, aktifMi: !kullanici.aktif_mi })
                  }
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {kullanicilar.length === 0 && (
            <Kart className="border border-dashed">
              <KartIcerik className="py-12 text-center">
                <Users size={32} className="mx-auto text-birincil-300" aria-hidden="true" />
                <p className="mt-2 text-sm font-semibold text-metin">Eşleşen kullanıcı bulunamadı.</p>
                <p className="mt-1 text-xs text-metin-ikincil">
                  Arama kriterlerinizi değiştirerek tekrar deneyebilirsiniz.
                </p>
              </KartIcerik>
            </Kart>
          )}
        </div>
      )}
    </div>
  );
}

export default function YoneticiKullanicilarSayfasi() {
  return (
    <KorumaliRota izinliRoller={["admin"]}>
      <YoneticiKullanicilarIcerik />
    </KorumaliRota>
  );
}
