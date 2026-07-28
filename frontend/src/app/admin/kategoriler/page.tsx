"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderPlus,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  X,
  Building2,
  Search,
  LayoutGrid,
  List,
  Palette,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  FolderKanban,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { apiHataMesaji } from "@/lib/api";
import { kategorilerApi, type KategoriIstegi } from "@/lib/api/konum";
import type { Kategori } from "@/types";

const BOS_FORM: KategoriIstegi = {
  ad: "",
  aciklama: "",
  ikon: "",
  sorumlu_departman: "",
  renk: "#6366F1",
};

const HAZIR_RENKLER = [
  "#6366F1", // Indigo
  "#38BDF8", // Sky Blue
  "#EF4444", // Rose Red
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#64748B", // Slate
];

export default function YoneticiKategorilerSayfasi() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<KategoriIstegi>(BOS_FORM);
  const [duzenlenenId, setDuzenlenenId] = useState<string | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [basari, setBasari] = useState<string | null>(null);
  const [aramaMetni, setAramaMetni] = useState("");
  const [gorunumModu, setGorunumModu] = useState<"grid" | "table">("grid");

  // 1. Kategorileri Getir
  const {
    data: kategoriler = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["kategoriler"],
    queryFn: kategorilerApi.listele,
  });

  // 2. Kaydet / Güncelle Mutation
  const kaydetMutation = useMutation({
    mutationFn: async (veri: KategoriIstegi) => {
      if (duzenlenenId) {
        return await kategorilerApi.guncelle(duzenlenenId, veri);
      }
      return await kategorilerApi.olustur(veri);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategoriler"] });
      setBasari(
        duzenlenenId
          ? "Kategori başarıyla güncellendi."
          : "Yeni kategori başarıyla eklendi."
      );
      formuSifirla();
      setTimeout(() => setBasari(null), 4000);
    },
    onError: (hataNesnesi) => {
      setHata(
        apiHataMesaji(hataNesnesi, "Kategori kaydedilirken bir sorun oluştu.")
      );
    },
  });

  // 3. Sil Mutation
  const silMutation = useMutation({
    mutationFn: (id: string) => kategorilerApi.sil(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategoriler"] });
      setBasari("Kategori başarıyla silindi.");
      setTimeout(() => setBasari(null), 3000);
    },
    onError: (hataNesnesi) => {
      setHata(
        apiHataMesaji(
          hataNesnesi,
          "Kategori silinemedi. Bağlı talepler bulunuyor olabilir."
        )
      );
    },
  });

  const filtrelenmisKategoriler = useMemo(() => {
    if (!aramaMetni.trim()) return kategoriler;
    const aranacak = aramaMetni.toLowerCase();
    return kategoriler.filter(
      (k) =>
        k.ad.toLowerCase().includes(aranacak) ||
        k.sorumlu_departman.toLowerCase().includes(aranacak) ||
        (k.aciklama && k.aciklama.toLowerCase().includes(aranacak))
    );
  }, [kategoriler, aramaMetni]);

  const aktifDepartmanSayisi = useMemo(() => {
    return new Set(kategoriler.map((k) => k.sorumlu_departman)).size;
  }, [kategoriler]);

  function duzenlemeyeBasla(kategori: Kategori) {
    setHata(null);
    setBasari(null);
    setDuzenlenenId(kategori.id);
    setForm({
      ad: kategori.ad,
      aciklama: kategori.aciklama ?? "",
      ikon: kategori.ikon ?? "",
      sorumlu_departman: kategori.sorumlu_departman,
      renk: kategori.renk || "#6366F1",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function formuSifirla() {
    setDuzenlenenId(null);
    setForm(BOS_FORM);
    setHata(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    setBasari(null);

    if (!form.ad.trim() || !form.sorumlu_departman.trim()) {
      setHata("Zorunlu alanları (Kategori Adı, Sorumlu Müdürlük) doldurunuz.");
      return;
    }

    kaydetMutation.mutate(form);
  }

  function handleSil(id: string, ad: string) {
    setHata(null);
    setBasari(null);
    if (confirm(`"${ad}" kategorisini silmek istediğinizden emin misiniz?`)) {
      silMutation.mutate(id);
    }
  }

  return (
    <div className="relative space-y-8 pt-2 pb-24 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. MASTER HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white/90 to-white/40 dark:from-slate-900/90 dark:to-slate-900/40 backdrop-blur-3xl p-6 sm:p-10 shadow-2xl shadow-indigo-500/5">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-500/20 animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-500/15" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 px-3 py-1 text-xs font-black text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Sparkles size={13} className="text-amber-400" /> Executive Category Taxonomy
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={12} className="text-emerald-500" /> Otomatik Sevk Kanalları
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Kategori Yönetim Paneli
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Şikâyet ve taleplerin otomatik yönlendirileceği kurumsal departman kategorilerini tanımlayın ve düzenleyin.
            </p>
          </div>

          <Dugme
            varyant="anahat"
            boyut="orta"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="self-start lg:self-auto gap-2 rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md hover:shadow-xl transition-all active:scale-95"
          >
            <RefreshCw size={15} className={isRefetching ? "animate-spin text-indigo-500" : "text-slate-500"} />
            <span className="font-bold text-xs">Verileri Yenile</span>
          </Dugme>
        </div>
      </div>

      {/* 2. BENTO STATS METRICS */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Toplam Kategori</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <FolderKanban size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{kategoriler.length}</h3>
            <span className="text-xs font-bold text-indigo-500 flex items-center gap-1">
              <ArrowUpRight size={14} /> Aktif Tanımlı
            </span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 shadow-sm hover:shadow-xl hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Sorumlu Birimler</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Building2 size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white">{aktifDepartmanSayisi}</h3>
            <span className="text-xs font-bold text-purple-500">Farklı Müdürlük</span>
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Sistem Durumu</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <h3 className="text-base font-black text-emerald-600 dark:text-emerald-400">Tüm Kanallar Açık</h3>
            <span className="text-xs font-bold text-emerald-500">%100 Operasyonel</span>
          </div>
        </motion.div>
      </div>

      {/* 3. DİNAMİK FORM YÖNETİM ALANI */}
      <Kart className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
        {duzenlenenId && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500 animate-pulse" />
        )}

        <KartBasligi className="border-b border-slate-100 dark:border-slate-800/80 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${duzenlenenId ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"}`}>
                {duzenlenenId ? <Pencil size={20} /> : <FolderPlus size={20} />}
              </div>
              <div>
                <KartBaslik className="text-lg font-black text-slate-900 dark:text-white">
                  {duzenlenenId ? "Kategori Detaylarını Güncelle" : "Sisteme Yeni Kategori Tanımla"}
                </KartBaslik>
                <p className="text-xs font-medium text-slate-400">
                  {duzenlenenId ? `ID: #${duzenlenenId} kaydı güncelleniyor.` : "Departman ve yönlendirme kurallarını belirleyin."}
                </p>
              </div>
            </div>

            {duzenlenenId && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 dark:bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Pencil size={12} /> Düzenleme Modu
              </span>
            )}
          </div>
        </KartBasligi>

        <KartIcerik className="pt-6">
          <AnimatePresence mode="wait">
            {hata && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6">
                <Uyari tur="hata">{hata}</Uyari>
              </motion.div>
            )}
            {basari && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6">
                <Uyari tur="bilgi">{basari}</Uyari>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2" noValidate>
            <div className="space-y-2">
              <Etiket htmlFor="ad" className="font-black text-[11px] uppercase tracking-wider text-slate-400">
                Kategori Adı <span className="text-rose-500">*</span>
              </Etiket>
              <Girdi
                id="ad"
                value={form.ad}
                onChange={(e) => setForm({ ...form, ad: e.target.value })}
                placeholder="Örn: Asfalt ve Yol Tamiri"
                className="rounded-2xl border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Etiket htmlFor="departman" className="font-black text-[11px] uppercase tracking-wider text-slate-400">
                Sorumlu Müdürlük <span className="text-rose-500">*</span>
              </Etiket>
              <Girdi
                id="departman"
                value={form.sorumlu_departman}
                onChange={(e) => setForm({ ...form, sorumlu_departman: e.target.value })}
                placeholder="Örn: Fen İşleri Müdürlüğü"
                className="rounded-2xl border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 transition-all"
                required
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Etiket htmlFor="aciklama" className="font-black text-[11px] uppercase tracking-wider text-slate-400">
                Açıklama & Vatandaş Yönlendirme Notu
              </Etiket>
              <Girdi
                id="aciklama"
                value={form.aciklama}
                onChange={(e) => setForm({ ...form, aciklama: e.target.value })}
                placeholder="Vatandaşın bu kategoriyi seçerken göreceği yönlendirici açıklama metni..."
                className="rounded-2xl border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <div className="sm:col-span-2 space-y-3">
              <Etiket htmlFor="renk" className="font-black text-[11px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Palette size={14} className="text-indigo-500" /> Kategori Kimlik Rengi
              </Etiket>
              <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 p-3">
                <input
                  id="renk"
                  type="color"
                  value={form.renk}
                  onChange={(e) => setForm({ ...form, renk: e.target.value })}
                  className="h-10 w-14 cursor-pointer rounded-xl border-0 p-1 bg-transparent"
                />
                <Girdi
                  type="text"
                  value={form.renk}
                  onChange={(e) => setForm({ ...form, renk: e.target.value })}
                  className="w-28 uppercase font-mono text-xs font-extrabold rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                />

                <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-4">
                  <span className="text-[11px] font-black text-slate-400 mr-1">Palet:</span>
                  {HAZIR_RENKLER.map((renk) => (
                    <button
                      key={renk}
                      type="button"
                      onClick={() => setForm({ ...form, renk })}
                      className="h-7 w-7 rounded-xl border border-black/10 transition-transform hover:scale-125 shadow-sm active:scale-95"
                      style={{ backgroundColor: renk }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 sm:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              {duzenlenenId && (
                <Dugme type="button" varyant="anahat" onClick={formuSifirla} className="gap-2 rounded-2xl border-slate-200 dark:border-slate-800">
                  <X size={16} /> İptal
                </Dugme>
              )}
              <Dugme
                type="submit"
                varyant="birincil"
                disabled={kaydetMutation.isPending}
                className="gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 py-3 font-black text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
              >
                {kaydetMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : duzenlenenId ? (
                  <>
                    <Save size={16} />
                    <span>Güncelle</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Kategori Ekle</span>
                  </>
                )}
              </Dugme>
            </div>
          </form>
        </KartIcerik>
      </Kart>

      {/* 4. ARAMA & SEGMENTED CONTROL BAR */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2.5 shadow-md">
        <div className="relative flex-1">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Girdi
            value={aramaMetni}
            onChange={(e) => setAramaMetni(e.target.value)}
            placeholder="Kategori adı veya müdürlük ara..."
            className="w-full rounded-xl bg-slate-100/70 dark:bg-slate-800/60 pl-10 pr-10 py-2.5 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none border-0"
          />
          {aramaMetni && (
            <button
              onClick={() => setAramaMetni("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Apple-style Segmented Controller */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 p-1 border border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => setGorunumModu("grid")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-lg transition-all ${
              gorunumModu === "grid"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid size={15} /> Grid
          </button>
          <button
            onClick={() => setGorunumModu("table")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-lg transition-all ${
              gorunumModu === "table"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            }`}
          >
            <List size={15} /> Tablo
          </button>
        </div>
      </div>

      {/* 5. KATEGORİ LISTING */}
      {isLoading ? (
        <TamSayfaYukleniyor />
      ) : filtrelenmisKategoriler.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-12 text-center">
          <AlertCircle className="mx-auto text-slate-400 mb-3" size={32} />
          <h3 className="text-base font-black text-slate-900 dark:text-white">Kategori Bulunamadı</h3>
          <p className="text-xs text-slate-400 mt-1">
            {aramaMetni ? `"${aramaMetni}" aramasına uygun hiçbir kategori eşleşmedi.` : "Henüz sisteme kategori tanımlanmamış."}
          </p>
        </div>
      ) : gorunumModu === "grid" ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filtrelenmisKategoriler.map((kategori) => (
              <motion.div
                key={kategori.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Kart className="group relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 shadow-sm hover:shadow-2xl hover:border-indigo-500/30 transition-all flex flex-col justify-between h-full">
                  {/* Dinamik Arka Plan Parlaması */}
                  <div
                    className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: kategori.renk || "#6366F1" }}
                  />

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl font-black text-lg text-white shadow-md group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: kategori.renk || "#6366F1" }}
                      >
                        {kategori.ad.charAt(0)}
                      </div>
                      <div className="flex items-center gap-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 p-1 border border-slate-200/50 dark:border-slate-700/50">
                        <Dugme
                          varyant="hayalet"
                          boyut="simge"
                          className="h-8 w-8 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg"
                          onClick={() => duzenlemeyeBasla(kategori)}
                        >
                          <Pencil size={15} />
                        </Dugme>
                        <Dugme
                          varyant="hayalet"
                          boyut="simge"
                          className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                          onClick={() => handleSil(kategori.id, kategori.ad)}
                          disabled={silMutation.isPending}
                        >
                          <Trash2 size={15} />
                        </Dugme>
                      </div>
                    </div>

                    <div className="mt-5 space-y-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-500 transition-colors">
                        {kategori.ad}
                      </h3>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                        <Building2 size={13} className="text-indigo-500" />
                        <span>{kategori.sorumlu_departman}</span>
                      </div>
                      {kategori.aciklama && (
                        <p className="text-xs font-medium text-slate-400 leading-relaxed line-clamp-2 mt-2">
                          {kategori.aciklama}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono font-black text-slate-400">
                    <span>{kategori.renk || "#6366F1"}</span>
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: kategori.renk }}
                    />
                  </div>
                </Kart>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-black uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Renk</th>
                  <th className="py-4 px-6">Kategori Adı</th>
                  <th className="py-4 px-6">Sorumlu Müdürlük</th>
                  <th className="py-4 px-6">Açıklama</th>
                  <th className="py-4 px-6 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filtrelenmisKategoriler.map((kategori) => (
                  <tr key={kategori.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <span
                        className="inline-block h-5 w-5 rounded-lg border border-black/10 shadow-xs"
                        style={{ backgroundColor: kategori.renk }}
                      />
                    </td>
                    <td className="py-4 px-6 font-black text-slate-900 dark:text-white text-sm">{kategori.ad}</td>
                    <td className="py-4 px-6 font-bold text-indigo-600 dark:text-indigo-400">
                      {kategori.sorumlu_departman}
                    </td>
                    <td className="py-4 px-6 text-slate-400 max-w-xs truncate font-medium">
                      {kategori.aciklama || "-"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Dugme
                          varyant="hayalet"
                          boyut="simge"
                          className="h-8 w-8 text-slate-400 hover:text-slate-800 dark:hover:text-white"
                          onClick={() => duzenlemeyeBasla(kategori)}
                        >
                          <Pencil size={15} />
                        </Dugme>
                        <Dugme
                          varyant="hayalet"
                          boyut="simge"
                          className="h-8 w-8 text-slate-400 hover:text-rose-500"
                          onClick={() => handleSil(kategori.id, kategori.ad)}
                        >
                          <Trash2 size={15} />
                        </Dugme>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}