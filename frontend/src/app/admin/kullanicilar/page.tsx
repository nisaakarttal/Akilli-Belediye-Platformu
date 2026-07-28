"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  ShieldOff,
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  Loader2,
  X,
  RefreshCw,
  Sparkles,
  Mail,
  Phone,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Secim } from "@/components/ui/select";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { apiHataMesaji } from "@/lib/api";
import { kullanicilarApi } from "@/lib/api/kullanicilar";
import type { KullaniciRolu } from "@/types";

const ROL_ETIKETI: Record<KullaniciRolu, string> = {
  vatandas: "Vatandaş",
  personel: "Personel",
  admin: "Yönetici",
};

// Rol Bazlı Renk Tema Rozetleri
const ROL_ROZET_STILI: Record<KullaniciRolu, string> = {
  admin: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xs",
  personel: "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xs",
  vatandas: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs",
};

export default function YoneticiKullanicilarSayfasi() {
  const queryClient = useQueryClient();
  const [arama, setArama] = useState("");
  const [rolFiltresi, setRolFiltresi] = useState<KullaniciRolu | "">("");
  const [hata, setHata] = useState<string | null>(null);
  const [basari, setBasari] = useState<string | null>(null);

  // 1. Kullanıcı Listesi Query
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["admin-kullanicilar", arama, rolFiltresi],
    queryFn: () =>
      kullanicilarApi.listele({
        arama: arama || undefined,
        rol: rolFiltresi || undefined,
        sayfa_boyutu: 50,
      }),
  });

  // 2. Rol Güncelleme Mutation
  const rolGuncelleMutation = useMutation({
    mutationFn: async ({ id, rol }: { id: string; rol: KullaniciRolu }) => {
      return await kullanicilarApi.rolGuncelle(id, rol);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kullanicilar"] });
      setBasari("Kullanıcı rolü başarıyla güncellendi.");
      setTimeout(() => setBasari(null), 3000);
    },
    onError: (err) => {
      setHata(apiHataMesaji(err, "Rol güncellenirken bir hata oluştu."));
    },
  });

  // 3. Durum Değiştirme (Aktif/Pasif) Mutation
  const durumDegistirMutation = useMutation({
    mutationFn: async ({ id, aktifMi }: { id: string; aktifMi: boolean }) => {
      return await kullanicilarApi.durumDegistir(id, aktifMi);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-kullanicilar"] });
      setBasari(
        `Kullanıcı hesabı ${variables.aktifMi ? "etkinleştirildi" : "pasife alındı"}.`
      );
      setTimeout(() => setBasari(null), 3000);
    },
    onError: (err) => {
      setHata(apiHataMesaji(err, "Hesap durumu değiştirilirken hata oluştu."));
    },
  });

  const kullanicilar = data?.veriler || [];

  // İstatistik Analizi
  const istatistikler = useMemo(() => {
    const toplam = kullanicilar.length;
    const aktifler = kullanicilar.filter((k) => k.aktif_mi).length;
    const pasifler = toplam - aktifler;
    const adminler = kullanicilar.filter((k) => k.rol === "admin").length;
    return { toplam, aktifler, pasifler, adminler };
  }, [kullanicilar]);

  return (
    <div className="space-y-8">
      {/* CANLI VE RENKLİ İSTATİSTİK KARTLARI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Kart className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-5 text-white shadow-lg shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Toplam Kullanıcı
                </p>
                <p className="mt-1 text-3xl font-black">{istatistikler.toplam}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <Users size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-blue-100">
              <Sparkles size={13} className="text-amber-300" /> Kayıtlı Kullanıcı Portföyü
            </div>
          </Kart>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Kart className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 p-5 text-white shadow-lg shadow-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                  Aktif Hesaplar
                </p>
                <p className="mt-1 text-3xl font-black">{istatistikler.aktifler}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <UserCheck size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-[11px] text-emerald-100">Erişim yetkisi açık</div>
          </Kart>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Kart className="relative overflow-hidden border-none bg-gradient-to-br from-rose-600 via-pink-600 to-red-500 p-5 text-white shadow-lg shadow-rose-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-100">
                  Pasif / Kısıtlı
                </p>
                <p className="mt-1 text-3xl font-black">{istatistikler.pasifler}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <UserX size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-[11px] text-rose-100">Dondurulmuş hesaplar</div>
          </Kart>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Kart className="relative overflow-hidden border-none bg-gradient-to-br from-purple-600 via-fuchsia-600 to-violet-500 p-5 text-white shadow-lg shadow-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-100">
                  Sistem Yöneticileri
                </p>
                <p className="mt-1 text-3xl font-black">{istatistikler.adminler}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <ShieldAlert size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-[11px] text-purple-100">Tam yetkili kullanıcılar</div>
          </Kart>
        </motion.div>
      </div>

      {/* BAŞLIK & YENİLEME EYLEMİ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent sm:text-3xl">
            Kullanıcı Yönetimi
          </h1>
          <p className="mt-1 text-sm text-metin-ikincil">
            Tüm kullanıcı hesaplarını görüntüleyin, yetkilendirmeleri yapın ve erişim durumlarını yönetin.
          </p>
        </div>

        <Dugme
          varyant="anahat"
          boyut="kucuk"
          onClick={() => refetch()}
          disabled={isRefetching}
          className="self-start gap-2 bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 shadow-sm sm:self-auto"
        >
          <RefreshCw size={14} className={isRefetching ? "animate-spin" : ""} />
          <span>Listeyi Yenile</span>
        </Dugme>
      </div>

      {/* BİLDİRİM ALANI */}
      <AnimatePresence mode="wait">
        {hata && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Uyari tur="hata">{hata}</Uyari>
          </motion.div>
        )}
        {basari && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Uyari tur="bilgi">{basari}</Uyari>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ARAMA VE ROL FİLTRELEME ÇUBUĞU */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/40 via-blue-50/20 to-transparent p-4 shadow-sm">
        <div className="relative min-w-[240px] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
          <Girdi
            placeholder="Ad, soyad veya e-posta ile ara..."
            className="pl-9 bg-white border-indigo-100 focus:border-indigo-400 focus:ring-indigo-200 text-sm"
            value={arama}
            onChange={(e) => setArama(e.target.value)}
          />
          {arama && (
            <button
              onClick={() => setArama("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-metin-ikincil hover:text-metin"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="min-w-[180px]">
          <Secim
            value={rolFiltresi}
            onChange={(e) => setRolFiltresi(e.target.value as KullaniciRolu | "")}
            className="bg-white border-indigo-100 focus:border-indigo-400 text-sm font-medium"
          >
            <option value="">Tüm Roller</option>
            <option value="vatandas">Vatandaş</option>
            <option value="personel">Personel</option>
            <option value="admin">Yönetici</option>
          </Secim>
        </div>
      </div>

      {/* LİSTE GÖRÜNÜMÜ */}
      {isLoading ? (
        <TamSayfaYukleniyor />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {kullanicilar.map((kullanici) => {
              const isMutatingRol =
                rolGuncelleMutation.isPending &&
                rolGuncelleMutation.variables?.id === kullanici.id;
              const isMutatingDurum =
                durumDegistirMutation.isPending &&
                durumDegistirMutation.variables?.id === kullanici.id;

              return (
                <motion.div
                  key={kullanici.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <Kart
                    className={`relative overflow-hidden border transition-all duration-200 ${
                      !kullanici.aktif_mi
                        ? "border-rose-200 bg-rose-50/30 opacity-80"
                        : "border-indigo-100/80 bg-white hover:border-indigo-300 hover:shadow-md"
                    }`}
                  >
                    {/* Sol Renkli Vurgu Çubuğu */}
                    <div
                      className={`absolute left-0 top-0 h-full w-1.5 ${
                        !kullanici.aktif_mi
                          ? "bg-rose-500"
                          : kullanici.rol === "admin"
                          ? "bg-purple-600"
                          : kullanici.rol === "personel"
                          ? "bg-blue-600"
                          : "bg-emerald-500"
                      }`}
                    />

                    <KartIcerik className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 pl-6">
                      {/* Kullanıcı Kimlik Alanı & Avatar */}
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-2xl font-black text-sm text-white shadow-sm ${
                            !kullanici.aktif_mi
                              ? "bg-slate-400"
                              : kullanici.rol === "admin"
                              ? "bg-gradient-to-br from-purple-500 to-indigo-600"
                              : kullanici.rol === "personel"
                              ? "bg-gradient-to-br from-blue-500 to-cyan-600"
                              : "bg-gradient-to-br from-emerald-500 to-teal-600"
                          }`}
                        >
                          {kullanici.ad?.[0]}
                          {kullanici.soyad?.[0]}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-extrabold text-metin text-base">
                              {kullanici.ad} {kullanici.soyad}
                            </p>

                            {/* Rol Rozeti */}
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                                ROL_ROZET_STILI[kullanici.rol]
                              }`}
                            >
                              {ROL_ETIKETI[kullanici.rol]}
                            </span>

                            {/* Pasif Etiketi */}
                            {!kullanici.aktif_mi && (
                              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                                Donduruldu
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-metin-ikincil font-medium">
                            <span className="flex items-center gap-1">
                              <Mail size={12} className="text-indigo-500" />
                              {kullanici.e_posta}
                            </span>
                            {kullanici.telefon && (
                              <span className="flex items-center gap-1">
                                <Phone size={12} className="text-indigo-500" />
                                {kullanici.telefon}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Aksiyon Alanı */}
                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* Rol Seçim Kutusu */}
                        <div className="relative">
                          <Secim
                            value={kullanici.rol}
                            disabled={isMutatingRol}
                            onChange={(e) =>
                              rolGuncelleMutation.mutate({
                                id: kullanici.id,
                                rol: e.target.value as KullaniciRolu,
                              })
                            }
                            className="h-9 w-36 text-xs font-bold bg-indigo-50/50 border-indigo-200 text-indigo-900 focus:border-indigo-500"
                          >
                            {Object.entries(ROL_ETIKETI).map(([deger, etiket]) => (
                              <option key={deger} value={deger}>
                                {etiket}
                              </option>
                            ))}
                          </Secim>
                          {isMutatingRol && (
                            <Loader2
                              size={14}
                              className="absolute right-2 top-1/2 -translate-y-1/2 animate-spin text-indigo-600"
                            />
                          )}
                        </div>

                        {/* Aktif/Pasif Butonu */}
                        <Dugme
                          varyant={kullanici.aktif_mi ? "anahat" : "birincil"}
                          boyut="kucuk"
                          disabled={isMutatingDurum}
                          className={`gap-1.5 font-bold shadow-xs transition-all ${
                            kullanici.aktif_mi
                              ? "border-rose-200 text-rose-600 hover:bg-rose-50"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white"
                          }`}
                          onClick={() =>
                            durumDegistirMutation.mutate({
                              id: kullanici.id,
                              aktifMi: !kullanici.aktif_mi,
                            })
                          }
                        >
                          {isMutatingDurum ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : kullanici.aktif_mi ? (
                            <ShieldOff size={14} />
                          ) : (
                            <ShieldCheck size={14} />
                          )}
                          <span>
                            {kullanici.aktif_mi ? "Pasife Al" : "Etkinleştir"}
                          </span>
                        </Dugme>
                      </div>
                    </KartIcerik>
                  </Kart>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Boş Durum Uyarısı */}
          {kullanicilar.length === 0 && (
            <Kart className="border border-dashed border-indigo-200 bg-indigo-50/30">
              <KartIcerik className="py-12 text-center">
                <Users size={32} className="mx-auto text-indigo-300" />
                <p className="mt-2 text-sm font-semibold text-metin">
                  Eşleşen kullanıcı bulunamadı.
                </p>
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