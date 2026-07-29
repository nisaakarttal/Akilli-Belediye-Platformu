"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { apiHataMesaji } from "@/lib/api";
import { kullanicilarApi } from "@/lib/api/kullanicilar";
import type { KullaniciRolu } from "@/types";

const SAYFA_BOYUTU = 50;
const BILDIRIM_GOSTERIM_SURESI_MS = 3000;

export function useAdminKullanicilar() {
  const queryClient = useQueryClient();
  const [arama, setArama] = useState("");
  const [rolFiltresi, setRolFiltresi] = useState<KullaniciRolu | "">("");
  const [hata, setHata] = useState<string | null>(null);
  const [basari, setBasari] = useState<string | null>(null);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["admin-kullanicilar", arama, rolFiltresi],
    queryFn: () =>
      kullanicilarApi.listele({
        arama: arama || undefined,
        rol: rolFiltresi || undefined,
        sayfa_boyutu: SAYFA_BOYUTU,
      }),
  });

  const rolGuncelleMutation = useMutation({
    mutationFn: ({ id, rol }: { id: string; rol: KullaniciRolu }) => kullanicilarApi.rolGuncelle(id, rol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-kullanicilar"] });
      setBasari("Kullanıcı rolü başarıyla güncellendi.");
      setTimeout(() => setBasari(null), BILDIRIM_GOSTERIM_SURESI_MS);
    },
    onError: (hataNesnesi) => {
      setHata(apiHataMesaji(hataNesnesi, "Rol güncellenirken bir hata oluştu."));
    },
  });

  const durumDegistirMutation = useMutation({
    mutationFn: ({ id, aktifMi }: { id: string; aktifMi: boolean }) => kullanicilarApi.durumDegistir(id, aktifMi),
    onSuccess: (_, degiskenler) => {
      queryClient.invalidateQueries({ queryKey: ["admin-kullanicilar"] });
      setBasari(`Kullanıcı hesabı ${degiskenler.aktifMi ? "etkinleştirildi" : "pasife alındı"}.`);
      setTimeout(() => setBasari(null), BILDIRIM_GOSTERIM_SURESI_MS);
    },
    onError: (hataNesnesi) => {
      setHata(apiHataMesaji(hataNesnesi, "Hesap durumu değiştirilirken hata oluştu."));
    },
  });

  const kullanicilar = useMemo(() => data?.veriler ?? [], [data]);

  const istatistikler = useMemo(() => {
    const toplam = kullanicilar.length;
    const aktifler = kullanicilar.filter((k) => k.aktif_mi).length;
    const pasifler = toplam - aktifler;
    const adminler = kullanicilar.filter((k) => k.rol === "admin").length;
    return { toplam, aktifler, pasifler, adminler };
  }, [kullanicilar]);

  return {
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
  };
}
