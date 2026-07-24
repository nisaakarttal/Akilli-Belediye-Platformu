"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Building,
  Plus,
  RefreshCw,
  Search,
  Loader2,
  CheckCircle2,
  X,
  Navigation,
  Compass,
  Sparkles,
  Layers,
  Globe,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Girdi } from "@/components/ui/input";
import { Etiket } from "@/components/ui/label";
import { Secim } from "@/components/ui/select";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { apiHataMesaji } from "@/lib/api";
import { konumApi } from "@/lib/api/konum";

export default function YoneticiKonumSayfasi() {
  const queryClient = useQueryClient();

  // Form State'leri
  const [ilceForm, setIlceForm] = useState({ ad: "", il: "Tekirdağ", merkez_enlem: "41.3706", merkez_boylam: "27.9917" });
  const [mahalleForm, setMahalleForm] = useState({ ad: "", ilce_id: "", merkez_enlem: "41.3706", merkez_boylam: "27.9917" });

  // Arama ve Filtre State'leri
  const [mahalleArama, setMahalleArama] = useState("");
  const [seciliIlceFiltresi, setSeciliIlceFiltresi] = useState<string>("HEPSISI");

  // Bildirim State'leri
  const [hata, setHata] = useState<string | null>(null);
  const [basari, setBasari] = useState<string | null>(null);

  // 1. TanStack Query Veri Çekimi
  const { data: ilceler = [], isLoading: ilcelerYukleniyor, refetch: ilceleriYenile } = useQuery({
    queryKey: ["ilceler"],
    queryFn: konumApi.ilceleriListele,
  });

  const { data: mahalleler = [], isLoading: mahallelerYukleniyor, refetch: mahalleleriYenile } = useQuery({
    queryKey: ["mahalleler"],
    queryFn: () => konumApi.mahalleleriListele(),
  });

  // 2. İlçe Ekleme Mutation
  const ilceEkleMutation = useMutation({
    mutationFn: async () => {
      return await konumApi.ilceOlustur({
        ad: ilceForm.ad.trim(),
        il: ilceForm.il.trim(),
        merkez_enlem: parseFloat(ilceForm.merkez_enlem) || 0,
        merkez_boylam: parseFloat(ilceForm.merkez_boylam) || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ilceler"] });
      setBasari(`"${ilceForm.ad}" ilçesi sisteme başarıyla eklendi.`);
      setIlceForm({ ad: "", il: "Tekirdağ", merkez_enlem: "41.3706", merkez_boylam: "27.9917" });
      setTimeout(() => setBasari(null), 3000);
    },
    onError: (hataNesnesi) => {
      setHata(apiHataMesaji(hataNesnesi, "İlçe eklenirken bir hata oluştu."));
    },
  });

  // 3. Mahalle Ekleme Mutation
  const mahalleEkleMutation = useMutation({
    mutationFn: async () => {
      return await konumApi.mahalleOlustur({
        ad: mahalleForm.ad.trim(),
        ilce_id: mahalleForm.ilce_id,
        merkez_enlem: parseFloat(mahalleForm.merkez_enlem) || 0,
        merkez_boylam: parseFloat(mahalleForm.merkez_boylam) || 0,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahalleler"] });
      setBasari(`"${mahalleForm.ad}" mahallesi sisteme başarıyla eklendi.`);
      setMahalleForm({ ad: "", ilce_id: mahalleForm.ilce_id, merkez_enlem: "41.3706", merkez_boylam: "27.9917" });
      setTimeout(() => setBasari(null), 3000);
    },
    onError: (hataNesnesi) => {
      setHata(apiHataMesaji(hataNesnesi, "Mahalle eklenirken bir hata oluştu."));
    },
  });

  function handleIlceEkle(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    setBasari(null);
    if (!ilceForm.ad.trim()) {
      setHata("Lütfen ilçe adını doldurunuz.");
      return;
    }
    ilceEkleMutation.mutate();
  }

  function handleMahalleEkle(e: FormEvent) {
    e.preventDefault();
    setHata(null);
    setBasari(null);
    if (!mahalleForm.ad.trim() || !mahalleForm.ilce_id) {
      setHata("Lütfen mahalle adını ve bağlı olduğu ilçeyi seçiniz.");
      return;
    }
    mahalleEkleMutation.mutate();
  }

  const filtrelenmisMahalleler = useMemo(() => {
    return mahalleler.filter((mahalle) => {
      const ilceEslesti = seciliIlceFiltresi === "HEPSISI" || mahalle.ilce_id === seciliIlceFiltresi;
      const aramaEslesti = mahalle.ad.toLowerCase().includes(mahalleArama.toLowerCase());
      return ilceEslesti && aramaEslesti;
    });
  }, [mahalleler, seciliIlceFiltresi, mahalleArama]);

  return (
    <div className="space-y-8">
      {/* CANLI VE RENKLİ İSTATİSTİK KARTLARI */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Kart className="relative overflow-hidden border-none bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 p-5 text-white shadow-lg shadow-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">Tanımlı İlçeler</p>
                <p className="mt-1 text-3xl font-black">{ilceler.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <Building size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-blue-100">
              <Sparkles size={13} className="text-amber-300" /> Coğrafi Alanlar Tanımlı
            </div>
          </Kart>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Kart className="relative overflow-hidden border-none bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 p-5 text-white shadow-lg shadow-fuchsia-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-pink-100">Toplam Mahalle</p>
                <p className="mt-1 text-3xl font-black">{mahalleler.length}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <MapPin size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-pink-100">
              <Layers size={13} /> Aktif Yerleşim Bölgesi
            </div>
          </Kart>
        </motion.div>

        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
          <Kart className="relative overflow-hidden border-none bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 p-5 text-white shadow-lg shadow-teal-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">Geocoding Servisi</p>
                <p className="mt-1 text-lg font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={18} className="text-emerald-200" /> Çevrimiçi
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                <Globe size={24} className="text-white" />
              </div>
            </div>
            <div className="mt-3 text-[11px] text-emerald-100">GPS koordinat doğrulama aktif</div>
          </Kart>
        </motion.div>
      </div>

      {/* BAŞLIK VE YENİLEME EYLEMİ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-metin-birincil sm:text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Konum Yönetimi
          </h1>
          <p className="mt-1 text-sm text-metin-ikincil">
            Saha ekipleri ve vatandaş bildirimleri için ilçe ve mahalle sınırlarını yapılandırın.
          </p>
        </div>

        <Dugme
          varyant="anahat"
          boyut="kucuk"
          onClick={() => {
            ilceleriYenile();
            mahalleleriYenile();
          }}
          className="self-start gap-2 bg-beyaz border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm sm:self-auto"
        >
          <RefreshCw size={14} />
          <span>Verileri Yenile</span>
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

      {/* ANA İKİLİ GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ==================== İLÇELER KARTI ==================== */}
        <Kart className="flex flex-col border border-blue-100 bg-beyaz shadow-xl relative overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600" />
          <KartBasligi className="border-b border-border/40 pb-4">
            <div className="flex items-center gap-2 font-bold text-blue-700">
              <Building size={20} className="text-blue-600" />
              <KartBaslik className="text-lg">İlçe Tanımları</KartBaslik>
            </div>
          </KartBasligi>

          <KartIcerik className="flex flex-1 flex-col space-y-5 pt-5">
            {/* Form */}
            <form onSubmit={handleIlceEkle} className="space-y-4 rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/40 to-indigo-50/20 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Etiket htmlFor="ilce-ad" className="text-xs font-bold text-blue-900">
                    İlçe Adı <span className="text-tehlike">*</span>
                  </Etiket>
                  <Girdi
                    id="ilce-ad"
                    placeholder="Örn: Kapaklı"
                    value={ilceForm.ad}
                    onChange={(e) => setIlceForm({ ...ilceForm, ad: e.target.value })}
                    className="bg-beyaz text-sm focus:border-blue-500 focus:ring-blue-200"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Etiket htmlFor="ilce-il" className="text-xs font-bold text-blue-900">
                    Bağlı İl
                  </Etiket>
                  <Girdi
                    id="ilce-il"
                    value={ilceForm.il}
                    onChange={(e) => setIlceForm({ ...ilceForm, il: e.target.value })}
                    className="bg-beyaz text-sm focus:border-blue-500 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>

              {/* GPS Koordinatları */}
              <div className="space-y-1">
                <Etiket className="flex items-center gap-1 text-[11px] font-bold text-blue-800">
                  <Navigation size={12} className="text-blue-600" /> GPS Merkez Koordinatları
                </Etiket>
                <div className="grid grid-cols-2 gap-2">
                  <Girdi
                    placeholder="Enlem (Lat)"
                    value={ilceForm.merkez_enlem}
                    onChange={(e) => setIlceForm({ ...ilceForm, merkez_enlem: e.target.value })}
                    className="bg-beyaz text-xs font-mono"
                  />
                  <Girdi
                    placeholder="Boylam (Lng)"
                    value={ilceForm.merkez_boylam}
                    onChange={(e) => setIlceForm({ ...ilceForm, merkez_boylam: e.target.value })}
                    className="bg-beyaz text-xs font-mono"
                  />
                </div>
              </div>

              <Dugme
                type="submit"
                varyant="birincil"
                boyut="kucuk"
                disabled={ilceEkleMutation.isPending}
                className="w-full gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-md shadow-blue-500/20"
              >
                {ilceEkleMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                <span>İlçe Kaydet</span>
              </Dugme>
            </form>

            {/* İlçe Listesi */}
            <div className="flex-1 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-metin-ikincil flex items-center justify-between">
                <span>Kayıtlı İlçeler</span>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-700 font-extrabold">{ilceler.length}</span>
              </h3>
              {ilcelerYukleniyor ? (
                <TamSayfaYukleniyor />
              ) : ilceler.length === 0 ? (
                <p className="py-6 text-center text-xs text-metin-ikincil">Henüz ilçe kaydı bulunmuyor.</p>
              ) : (
                <ul className="max-h-64 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                  {ilceler.map((ilce) => (
                    <motion.li
                      key={ilce.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between rounded-xl border border-blue-100/80 bg-gradient-to-r from-white to-blue-50/30 p-3 shadow-xs hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xs">
                          <Building size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-metin-birincil">{ilce.ad}</p>
                          <p className="text-[11px] text-blue-600 font-medium">{ilce.il}</p>
                        </div>
                      </div>

                      <div className="text-right text-[11px] font-mono font-medium text-metin-ikincil">
                        <span className="bg-white px-2 py-1 rounded-md border border-blue-100 shadow-2xs text-blue-800">
                          {ilce.merkez_enlem?.toFixed(2)}, {ilce.merkez_boylam?.toFixed(2)}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </KartIcerik>
        </Kart>

        {/* ==================== MAHALLELER KARTI ==================== */}
        <Kart className="flex flex-col border border-fuchsia-100 bg-beyaz shadow-xl relative overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-fuchsia-500 to-pink-600" />
          <KartBasligi className="border-b border-border/40 pb-4">
            <div className="flex items-center gap-2 font-bold text-fuchsia-700">
              <MapPin size={20} className="text-fuchsia-600" />
              <KartBaslik className="text-lg">Mahalle Tanımları</KartBaslik>
            </div>
          </KartBasligi>

          <KartIcerik className="flex flex-1 flex-col space-y-5 pt-5">
            {/* Form */}
            <form onSubmit={handleMahalleEkle} className="space-y-4 rounded-2xl border border-fuchsia-100 bg-gradient-to-b from-fuchsia-50/40 to-pink-50/20 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Etiket htmlFor="mahalle-ad" className="text-xs font-bold text-fuchsia-900">
                    Mahalle Adı <span className="text-tehlike">*</span>
                  </Etiket>
                  <Girdi
                    id="mahalle-ad"
                    placeholder="Örn: Cumhuriyet Mah."
                    value={mahalleForm.ad}
                    onChange={(e) => setMahalleForm({ ...mahalleForm, ad: e.target.value })}
                    className="bg-beyaz text-sm focus:border-fuchsia-500 focus:ring-fuchsia-200"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Etiket htmlFor="mahalle-ilce" className="text-xs font-bold text-fuchsia-900">
                    Bağlı Olduğu İlçe <span className="text-tehlike">*</span>
                  </Etiket>
                  <Secim
                    id="mahalle-ilce"
                    value={mahalleForm.ilce_id}
                    onChange={(e) => setMahalleForm({ ...mahalleForm, ilce_id: e.target.value })}
                    className="bg-beyaz text-sm focus:border-fuchsia-500 focus:ring-fuchsia-200"
                    required
                  >
                    <option value="">İlçe seçiniz</option>
                    {ilceler.map((ilce) => (
                      <option key={ilce.id} value={ilce.id}>
                        {ilce.ad} ({ilce.il})
                      </option>
                    ))}
                  </Secim>
                </div>
              </div>

              {/* GPS Koordinatları */}
              <div className="space-y-1">
                <Etiket className="flex items-center gap-1 text-[11px] font-bold text-fuchsia-800">
                  <Compass size={12} className="text-fuchsia-600" /> GPS Merkez Koordinatları
                </Etiket>
                <div className="grid grid-cols-2 gap-2">
                  <Girdi
                    placeholder="Enlem (Lat)"
                    value={mahalleForm.merkez_enlem}
                    onChange={(e) => setMahalleForm({ ...mahalleForm, merkez_enlem: e.target.value })}
                    className="bg-beyaz text-xs font-mono"
                  />
                  <Girdi
                    placeholder="Boylam (Lng)"
                    value={mahalleForm.merkez_boylam}
                    onChange={(e) => setMahalleForm({ ...mahalleForm, merkez_boylam: e.target.value })}
                    className="bg-beyaz text-xs font-mono"
                  />
                </div>
              </div>

              <Dugme
                type="submit"
                varyant="birincil"
                boyut="kucuk"
                disabled={mahalleEkleMutation.isPending}
                className="w-full gap-1.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-semibold shadow-md shadow-fuchsia-500/20"
              >
                {mahalleEkleMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                <span>Mahalle Kaydet</span>
              </Dugme>
            </form>

            {/* Arama & Filtre Çipleri */}
            <div className="space-y-2.5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-metin-ikincil flex items-center gap-2">
                  <span>Mahalle Listesi</span>
                  <span className="rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] text-fuchsia-700 font-extrabold">{filtrelenmisMahalleler.length}</span>
                </h3>

                {/* İlçe Renkli Çipleri */}
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => setSeciliIlceFiltresi("HEPSISI")}
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full transition-all ${
                      seciliIlceFiltresi === "HEPSISI"
                        ? "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-xs"
                        : "bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100"
                    }`}
                  >
                    Tümü
                  </button>
                  {ilceler.map((ilce) => (
                    <button
                      key={ilce.id}
                      onClick={() => setSeciliIlceFiltresi(ilce.id)}
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full transition-all ${
                        seciliIlceFiltresi === ilce.id
                          ? "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-xs"
                          : "bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100"
                      }`}
                    >
                      {ilce.ad}
                    </button>
                  ))}
                </div>
              </div>

              {/* Arama Kutusu */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fuchsia-500" />
                <Girdi
                  value={mahalleArama}
                  onChange={(e) => setMahalleArama(e.target.value)}
                  placeholder="Mahalle adı yazarak süzün..."
                  className="pl-8 text-xs bg-beyaz border-fuchsia-100 focus:border-fuchsia-400"
                />
                {mahalleArama && (
                  <button
                    onClick={() => setMahalleArama("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-metin-ikincil hover:text-metin-birincil"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Mahalle Listesi */}
            <div className="flex-1">
              {mahallelerYukleniyor ? (
                <TamSayfaYukleniyor />
              ) : filtrelenmisMahalleler.length === 0 ? (
                <div className="py-8 text-center text-xs text-metin-ikincil border border-dashed border-fuchsia-200 rounded-2xl bg-fuchsia-50/20">
                  Aramaya uygun mahalle bulunamadı.
                </div>
              ) : (
                <ul className="max-h-64 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                  <AnimatePresence>
                    {filtrelenmisMahalleler.map((mahalle) => {
                      const bagliIlce = ilceler.find((i) => i.id === mahalle.ilce_id);
                      return (
                        <motion.li
                          key={mahalle.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-between rounded-xl border border-fuchsia-100/80 bg-gradient-to-r from-white to-fuchsia-50/30 p-3 shadow-xs hover:border-fuchsia-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white shadow-xs">
                              <MapPin size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-extrabold text-metin-birincil">{mahalle.ad}</p>
                              <p className="text-[11px] font-semibold text-fuchsia-600">
                                {bagliIlce ? bagliIlce.ad : "İlçe Tanımsız"}
                              </p>
                            </div>
                          </div>

                          <div className="text-right text-[11px] font-mono font-medium text-metin-ikincil">
                            <span className="bg-white px-2 py-1 rounded-md border border-fuchsia-100 shadow-2xs text-fuchsia-800">
                              {mahalle.merkez_enlem?.toFixed(2)}, {mahalle.merkez_boylam?.toFixed(2)}
                            </span>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </KartIcerik>
        </Kart>
      </div>
    </div>
  );
}