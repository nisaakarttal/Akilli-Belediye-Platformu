"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  UserPlus,
  FileText,
  Clock,
  Building,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  UserCheck,
  Tag,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

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
import { kullanicilarApi } from "@/lib/api/kullanicilar";
import { taleplerApi } from "@/lib/api/talepler";

const HaritaSecici = dynamic(
  () => import("@/components/harita/harita-secici").then((mod) => mod.HaritaSecici),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 to-indigo-50/50 flex flex-col items-center justify-center gap-2 text-xs font-semibold text-indigo-500 border border-indigo-100">
        <Loader2 size={24} className="animate-spin text-indigo-600" />
        <span>Harita ve GPS Verileri Yükleniyor...</span>
      </div>
    ),
  }
);

function tarihiBicimlendir(isoTarih: string) {
  return new Date(isoTarih).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AdminTalepDetayIcerik() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [secilenPersonelId, setSecilenPersonelId] = useState<string>("");
  const [bildirim, setBildirim] = useState<{ tip: "basari" | "hata"; mesaj: string } | null>(null);

  // 1. Talep Detay Query
  const { data: talep, isLoading, isError } = useQuery({
    queryKey: ["admin-talep", id],
    queryFn: () => taleplerApi.getir(id),
  });

  // 2. Personeller Query
  const { data: personelListesi, isLoading: personellerYukleniyor } = useQuery({
    queryKey: ["personeller"],
    queryFn: () => kullanicilarApi.listele({ rol: "personel" }),
  });

  // 3. Personel Atama Mutation
  const atamaMutation = useMutation({
    mutationFn: (personelId: string) => taleplerApi.ata(id, personelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-talep", id] });
      setBildirim({ tip: "basari", mesaj: "Talep başarıyla ilgili personele atandı." });
      setSecilenPersonelId("");
      setTimeout(() => setBildirim(null), 4000);
    },
    onError: () => {
      setBildirim({ tip: "hata", mesaj: "Atama işlemi sırasında bir sorun oluştu. Lütfen tekrar deneyin." });
      setTimeout(() => setBildirim(null), 4000);
    },
  });

  // Mevcut atanan personel nesnesini bul
  const atananPersonel = personelListesi?.veriler?.find((p) => p.id === talep?.atanan_personel_id);

  return (
    <div className="space-y-6 pt-2 pb-12">
      {/* GERİ DÖN BUTONU */}
      <div>
        <Link
          href="/admin/talepler"
          className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-all"
        >
          <ArrowLeft size={14} /> Tüm Taleplere Dön
        </Link>
      </div>

      {isLoading && <TamSayfaYukleniyor />}

      {isError && (
        <Uyari tur="hata">Talep detayları alınamadı. Talep silinmiş veya erişim yetkiniz sınırlandırılmış olabilir.</Uyari>
      )}

      {/* BİLDİRİM PANELİ */}
      <AnimatePresence mode="wait">
        {bildirim && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Uyari tur={bildirim.tip === "basari" ? "bilgi" : "hata"}>{bildirim.mesaj}</Uyari>
          </motion.div>
        )}
      </AnimatePresence>

      {talep && (
        <div className="space-y-6">
          {/* ==================== 1. TALEP ÜST BAŞLIK KARTI ==================== */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <Kart className="relative overflow-hidden border border-indigo-100 bg-beyaz shadow-xl">
              <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
              <KartBasligi className="border-b border-indigo-50 pb-5 pt-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-mono text-xs font-black tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-100">
                        <Tag size={12} /> #{talep.takip_no}
                      </span>
                      <span className="text-xs font-bold text-metin-ikincil flex items-center gap-1">
                        <Calendar size={13} className="text-indigo-500" />
                        {tarihiBicimlendir(talep.olusturulma_tarihi)}
                      </span>
                    </div>
                    <KartBaslik className="text-xl sm:text-2xl font-black text-metin-birincil">
                      {talep.baslik}
                    </KartBaslik>
                  </div>

                  <div className="flex items-center gap-2">
                    <DurumRozeti durum={talep.durum} />
                    <OncelikRozeti oncelik={talep.oncelik} />
                  </div>
                </div>
              </KartBasligi>

              <KartIcerik className="space-y-6 pt-6">
                {/* Açıklama Kutusu */}
                <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 p-4 border border-indigo-100/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1 flex items-center gap-1.5">
                    <FileText size={14} className="text-indigo-600" /> Talep / Şikayet Detayı
                  </p>
                  <p className="text-sm font-medium text-metin leading-relaxed whitespace-pre-wrap">{talep.aciklama}</p>
                </div>

                {/* Özet Meta Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                      <Layers size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-blue-900/70">Kategori</p>
                      <p className="text-sm font-extrabold text-metin-birincil">{talep.kategori.ad}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs">
                      <Building size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-purple-900/70">Sorumlu Birim</p>
                      <p className="text-sm font-extrabold text-metin-birincil">{talep.kategori.sorumlu_departman}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/30 p-3 sm:col-span-2 lg:col-span-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900/70">Mahalle / Bölge</p>
                      <p className="text-sm font-extrabold text-metin-birincil">{talep.mahalle.ad}</p>
                    </div>
                  </div>
                </div>
              </KartIcerik>
            </Kart>
          </motion.div>

          {/* ==================== 2. PERSONEL ATAMA PANELİ ==================== */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Kart className="border border-indigo-100 bg-beyaz shadow-lg relative overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-600" />
              <KartBasligi className="border-b border-indigo-50 pb-4">
                <KartBaslik className="flex items-center gap-2 text-lg text-indigo-950 font-extrabold">
                  <UserPlus size={20} className="text-indigo-600" /> Personel Görevlendirme
                </KartBaslik>
              </KartBasligi>

              <KartIcerik className="space-y-4 pt-5">
                {/* Atanmış Personel Rozeti varsa */}
                {atananPersonel && (
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-900">
                    <UserCheck size={20} className="text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Şu an Atalı Personel</p>
                      <p className="text-sm font-black">
                        {atananPersonel.ad} {atananPersonel.soyad} <span className="font-normal text-xs text-emerald-700">({atananPersonel.e_posta})</span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  <div className="max-w-md flex-1">
                    <Secim
                      value={secilenPersonelId}
                      onChange={(e) => setSecilenPersonelId(e.target.value)}
                      className="bg-beyaz border-indigo-200 focus:border-indigo-500 text-sm font-medium"
                      disabled={personellerYukleniyor}
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
                    className="gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold shadow-md shadow-indigo-500/20"
                  >
                    {atamaMutation.isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Atanıyor...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} />
                        <span>{atananPersonel ? "Atamayı Güncelle" : "Görevi Ata"}</span>
                      </>
                    )}
                  </Dugme>
                </div>
              </KartIcerik>
            </Kart>
          </motion.div>

          {/* ==================== 3. HARİTA KOORDİNAT KARTI ==================== */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Kart className="border border-indigo-100 bg-beyaz shadow-lg relative overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-cyan-500 to-blue-600" />
              <KartBasligi className="border-b border-indigo-50 pb-4">
                <div className="flex items-center justify-between">
                  <KartBaslik className="flex items-center gap-2 text-lg text-indigo-950 font-extrabold">
                    <MapPin size={20} className="text-cyan-600" /> Coğrafi Konum Bilgisi
                  </KartBaslik>
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-100">
                    GPS: {talep.enlem?.toFixed(4)}, {talep.boylam?.toFixed(4)}
                  </span>
                </div>
              </KartBasligi>

              <KartIcerik className="pt-4">
                <div className="overflow-hidden rounded-xl border border-indigo-100 shadow-inner">
                  <HaritaSecici enlem={talep.enlem} boylam={talep.boylam} onDegistir={() => {}} saltOkunur />
                </div>
              </KartIcerik>
            </Kart>
          </motion.div>

          {/* ==================== 4. EKLER & DOSYALAR ==================== */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Kart className="border border-indigo-100 bg-beyaz shadow-lg relative overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-fuchsia-500 to-pink-600" />
              <KartBasligi className="border-b border-indigo-50 pb-4">
                <KartBaslik className="flex items-center gap-2 text-lg text-indigo-950 font-extrabold">
                  <Sparkles size={20} className="text-fuchsia-600" /> Ekli Medya ve Dosyalar ({talep.dosyalar?.length || 0})
                </KartBaslik>
              </KartBasligi>

              <KartIcerik className="pt-4">
                <DosyaListesi dosyalar={talep.dosyalar} />
              </KartIcerik>
            </Kart>
          </motion.div>

          {/* ==================== 5. ZAMAN TÜNELİ KARTI ==================== */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Kart className="border border-indigo-100 bg-beyaz shadow-lg relative overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-orange-600" />
              <KartBasligi className="border-b border-indigo-50 pb-4">
                <KartBaslik className="flex items-center gap-2 text-lg text-indigo-950 font-extrabold">
                  <Clock size={20} className="text-amber-600" /> Talep İşlem Zaman Tüneli
                </KartBaslik>
              </KartBasligi>

              <KartIcerik className="pt-4">
                <ZamanTuneli gecmis={talep.durum_gecmisi} />
              </KartIcerik>
            </Kart>
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