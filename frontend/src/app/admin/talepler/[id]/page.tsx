"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  FileText,
  Layers,
  Loader2,
  MapPin,
  Sparkles,
  Tag,
  UserCheck,
  UserPlus,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { DetayBilgiKarti } from "@/components/admin/detay-bilgi-karti";
import { YoneticiBolumKarti } from "@/components/admin/yonetici-bolum-karti";
import { KorumaliRota } from "@/components/layout/korumali-rota";
import { DosyaListesi } from "@/components/sikayet/dosya-listesi";
import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
import { ZamanTuneli } from "@/components/sikayet/zaman-tuneli";
import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Secim } from "@/components/ui/select";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { useAdminTalepDetay } from "@/hooks/use-admin-talep-detay";
import { tarihSaatFormatla } from "@/lib/tarih";

const HaritaSecici = dynamic(
  () => import("@/components/harita/harita-secici").then((mod) => mod.HaritaSecici),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-kenarlik bg-black/5 text-xs font-semibold text-metin-ikincil dark:bg-white/5">
        <Loader2 size={24} className="animate-spin text-birincil-600" aria-hidden="true" />
        <span>Harita ve GPS Verileri Yükleniyor...</span>
      </div>
    ),
  }
);

function AdminTalepDetayIcerik() {
  const {
    talep,
    isLoading,
    isError,
    personelListesi,
    personellerYukleniyor,
    secilenPersonelId,
    setSecilenPersonelId,
    atamaMutation,
    atananPersonel,
    bildirim,
  } = useAdminTalepDetay();

  return (
    <div className="space-y-6 pb-12 pt-2">
      <div>
        <Link
          href="/admin/talepler"
          className="inline-flex items-center gap-2 rounded-xl bg-birincil-600/10 px-3 py-1.5 text-xs font-bold text-birincil-600 transition-all hover:bg-birincil-600/20"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Tüm Taleplere Dön
        </Link>
      </div>

      {isLoading && <TamSayfaYukleniyor />}

      {isError && (
        <Uyari tur="hata">Talep detayları alınamadı. Talep silinmiş veya erişim yetkiniz sınırlandırılmış olabilir.</Uyari>
      )}

      <AnimatePresence mode="wait">
        {bildirim && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Uyari tur={bildirim.tip === "basari" ? "basari" : "hata"}>{bildirim.mesaj}</Uyari>
          </motion.div>
        )}
      </AnimatePresence>

      {talep && (
        <div className="space-y-6">
          {/* 1. Talep üst başlık kartı */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <Kart className="overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-birincil-600 to-ikincil-500" aria-hidden="true" />
              <KartBasligi className="border-b border-kenarlik pb-5 pt-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md border border-birincil-600/20 bg-birincil-600/10 px-2.5 py-0.5 font-mono text-xs font-black tracking-wider text-birincil-600">
                        <Tag size={12} aria-hidden="true" /> #{talep.takip_no}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-metin-ikincil">
                        <Calendar size={13} className="text-birincil-500" aria-hidden="true" />
                        {tarihSaatFormatla(talep.olusturulma_tarihi)}
                      </span>
                    </div>
                    <KartBaslik className="text-xl sm:text-2xl">{talep.baslik}</KartBaslik>
                  </div>

                  <div className="flex items-center gap-2">
                    <DurumRozeti durum={talep.durum} />
                    <OncelikRozeti oncelik={talep.oncelik} />
                  </div>
                </div>
              </KartBasligi>

              <KartIcerik className="space-y-6 pt-6">
                <div className="rounded-2xl border border-kenarlik bg-black/[0.02] p-4 dark:bg-white/[0.02]">
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-metin-ikincil">
                    <FileText size={14} className="text-birincil-600" aria-hidden="true" /> Talep / Şikâyet Detayı
                  </p>
                  <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-metin">{talep.aciklama}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <DetayBilgiKarti ikon={Layers} etiket="Kategori" deger={talep.kategori.ad} vurgu="birincil" />
                  <DetayBilgiKarti
                    ikon={Building}
                    etiket="Sorumlu Birim"
                    deger={talep.kategori.sorumlu_departman}
                    vurgu="ikincil"
                  />
                  <DetayBilgiKarti
                    ikon={MapPin}
                    etiket="Mahalle / Bölge"
                    deger={talep.mahalle.ad}
                    vurgu="basarili"
                    className="sm:col-span-2 lg:col-span-1"
                  />
                </div>
              </KartIcerik>
            </Kart>
          </motion.div>

          {/* 2. Personel atama paneli */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <YoneticiBolumKarti ikon={UserPlus} baslik="Personel Görevlendirme" ustCubukSinifi="bg-basarili">
              <div className="space-y-4">
                {atananPersonel && (
                  <div className="flex items-center gap-3 rounded-xl border border-basarili/20 bg-basarili/10 p-3 text-green-800 dark:text-green-300">
                    <UserCheck size={20} className="text-green-600 dark:text-green-400" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-green-700 dark:text-green-400">
                        Şu an Atalı Personel
                      </p>
                      <p className="text-sm font-black">
                        {atananPersonel.ad} {atananPersonel.soyad}{" "}
                        <span className="text-xs font-normal text-green-700 dark:text-green-400">
                          ({atananPersonel.e_posta})
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <div className="max-w-md flex-1">
                    <Secim
                      value={secilenPersonelId}
                      onChange={(e) => setSecilenPersonelId(e.target.value)}
                      className="text-sm font-medium"
                      disabled={personellerYukleniyor}
                      aria-label="Saha personeli seçiniz"
                    >
                      <option value="">
                        {personellerYukleniyor ? "Personel listesi çekiliyor..." : "Saha Personeli Seçiniz..."}
                      </option>
                      {personelListesi?.veriler?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.ad} {p.soyad} ({p.e_posta})
                        </option>
                      ))}
                    </Secim>
                  </div>

                  <Dugme
                    varyant="birincil"
                    disabled={!secilenPersonelId || atamaMutation.isPending}
                    onClick={() => atamaMutation.mutate(secilenPersonelId)}
                    className="gap-2"
                  >
                    {atamaMutation.isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                        <span>Atanıyor...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} aria-hidden="true" />
                        <span>{atananPersonel ? "Atamayı Güncelle" : "Görevi Ata"}</span>
                      </>
                    )}
                  </Dugme>
                </div>
              </div>
            </YoneticiBolumKarti>
          </motion.div>

          {/* 3. Harita / koordinat kartı */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <YoneticiBolumKarti
              ikon={MapPin}
              baslik="Coğrafi Konum Bilgisi"
              ustCubukSinifi="bg-ikincil-500"
              sagIcerik={
                <span className="rounded-md border border-ikincil-500/20 bg-ikincil-500/10 px-2.5 py-1 font-mono text-xs font-bold text-sky-600">
                  GPS: {talep.enlem.toFixed(4)}, {talep.boylam.toFixed(4)}
                </span>
              }
            >
              <div className="overflow-hidden rounded-xl border border-kenarlik">
                <HaritaSecici enlem={talep.enlem} boylam={talep.boylam} saltOkunur />
              </div>
            </YoneticiBolumKarti>
          </motion.div>

          {/* 4. Ekler ve dosyalar */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <YoneticiBolumKarti
              ikon={Sparkles}
              baslik={`Ekli Medya ve Dosyalar (${talep.dosyalar?.length || 0})`}
              ustCubukSinifi="bg-pink-500"
            >
              <DosyaListesi dosyalar={talep.dosyalar} />
            </YoneticiBolumKarti>
          </motion.div>

          {/* 5. Zaman tüneli */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <YoneticiBolumKarti ikon={Clock} baslik="Talep İşlem Zaman Tüneli" ustCubukSinifi="bg-uyari">
              <ZamanTuneli gecmis={talep.durum_gecmisi} />
            </YoneticiBolumKarti>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function AdminTalepDetayPage() {
  return (
    <KorumaliRota izinliRoller={["admin"]}>
      <AdminTalepDetayIcerik />
    </KorumaliRota>
  );
}
