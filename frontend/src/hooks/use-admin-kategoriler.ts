"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";

import { BOS_KATEGORI_FORMU, VARSAYILAN_KATEGORI_RENGI } from "@/constants/kategori";
import { apiHataMesaji } from "@/lib/api";
import { kategorilerApi, type KategoriIstegi } from "@/lib/api/konum";
import type { Kategori } from "@/types";

const KAYIT_BILDIRIM_SURESI_MS = 4000;
const SILME_BILDIRIM_SURESI_MS = 3000;

export function useAdminKategoriler() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState<KategoriIstegi>(BOS_KATEGORI_FORMU);
  const [duzenlenenId, setDuzenlenenId] = useState<string | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [basari, setBasari] = useState<string | null>(null);
  const [aramaMetni, setAramaMetni] = useState("");
  const [gorunumModu, setGorunumModu] = useState<"grid" | "table">("grid");

  const {
    data: kategoriler = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["kategoriler"],
    queryFn: kategorilerApi.listele,
  });

  function formuSifirla() {
    setDuzenlenenId(null);
    setForm(BOS_KATEGORI_FORMU);
    setHata(null);
  }

  const kaydetMutation = useMutation({
    mutationFn: (veri: KategoriIstegi) =>
      duzenlenenId ? kategorilerApi.guncelle(duzenlenenId, veri) : kategorilerApi.olustur(veri),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategoriler"] });
      setBasari(duzenlenenId ? "Kategori başarıyla güncellendi." : "Yeni kategori başarıyla eklendi.");
      formuSifirla();
      setTimeout(() => setBasari(null), KAYIT_BILDIRIM_SURESI_MS);
    },
    onError: (hataNesnesi) => {
      setHata(apiHataMesaji(hataNesnesi, "Kategori kaydedilirken bir sorun oluştu."));
    },
  });

  const silMutation = useMutation({
    mutationFn: (id: string) => kategorilerApi.sil(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kategoriler"] });
      setBasari("Kategori başarıyla silindi.");
      setTimeout(() => setBasari(null), SILME_BILDIRIM_SURESI_MS);
    },
    onError: (hataNesnesi) => {
      setHata(apiHataMesaji(hataNesnesi, "Kategori silinemedi. Bağlı talepler bulunuyor olabilir."));
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

  const aktifDepartmanSayisi = useMemo(
    () => new Set(kategoriler.map((k) => k.sorumlu_departman)).size,
    [kategoriler]
  );

  function duzenlemeyeBasla(kategori: Kategori) {
    setHata(null);
    setBasari(null);
    setDuzenlenenId(kategori.id);
    setForm({
      ad: kategori.ad,
      aciklama: kategori.aciklama ?? "",
      ikon: kategori.ikon ?? "",
      sorumlu_departman: kategori.sorumlu_departman,
      renk: kategori.renk || VARSAYILAN_KATEGORI_RENGI,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return {
    form,
    setForm,
    duzenlenenId,
    hata,
    basari,
    aramaMetni,
    setAramaMetni,
    gorunumModu,
    setGorunumModu,
    kategoriler,
    isLoading,
    isRefetching,
    refetch,
    kaydetMutation,
    silMutation,
    filtrelenmisKategoriler,
    aktifDepartmanSayisi,
    duzenlemeyeBasla,
    formuSifirla,
    handleSubmit,
    handleSil,
  };
}
