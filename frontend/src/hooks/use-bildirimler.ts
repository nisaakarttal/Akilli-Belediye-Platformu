"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { useAuth } from "@/providers/auth-provider";
import { bildirimlerApi } from "@/lib/api/bildirimler";
import type { Bildirim } from "@/types";

export type BildirimFiltresi = "tumu" | "okunmamis" | "okunmus";

export function useBildirimler() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { kullanici } = useAuth();

  const [filtre, setFiltre] = useState<BildirimFiltresi>("tumu");

  const { data, isLoading } = useQuery({
    queryKey: ["bildirimler"],
    queryFn: () => bildirimlerApi.listele(),
  });

  function sorgulariYenile() {
    queryClient.invalidateQueries({ queryKey: ["bildirimler"] });
    queryClient.invalidateQueries({ queryKey: ["okunmamis-bildirimler"] });
  }

  const hepsiniOkunduYapMutation = useMutation({
    mutationFn: () => bildirimlerApi.tumunuOkunduYap(),
    onSuccess: () => sorgulariYenile(),
  });

  const okunduYapMutation = useMutation({
    mutationFn: (id: string) => bildirimlerApi.okunduYap(id),
    onSuccess: () => sorgulariYenile(),
  });

  const okunmadiYapMutation = useMutation({
    mutationFn: (id: string) => bildirimlerApi.okunmadiYap(id),
    onSuccess: () => sorgulariYenile(),
  });

  /** Role göre bildirim tıklama yönlendirmesi. */
  function bildirimeTikla(bildirim: Bildirim) {
    if (!bildirim.okundu_mu) {
      okunduYapMutation.mutate(bildirim.id);
    }

    const rol = (kullanici?.rol || "").toString().toLowerCase();

    if (rol.includes("admin")) {
      router.push("/admin/talepler");
    } else if (rol.includes("personel")) {
      router.push("/personel");
    } else {
      router.push("/panel/taleplerim");
    }
  }

  const okunmamisSayisi = useMemo(() => (data ? data.filter((b) => !b.okundu_mu).length : 0), [data]);

  const filtrelenmisBildirimler = useMemo(() => {
    if (!data) return [];
    if (filtre === "okunmamis") return data.filter((b) => !b.okundu_mu);
    if (filtre === "okunmus") return data.filter((b) => b.okundu_mu);
    return data;
  }, [data, filtre]);

  return {
    data,
    isLoading,
    filtre,
    setFiltre,
    okunmamisSayisi,
    filtrelenmisBildirimler,
    hepsiniOkunduYap: () => hepsiniOkunduYapMutation.mutate(),
    hepsiniOkunduYapMutation,
    okunduYapMutation,
    okunmadiYapMutation,
    bildirimeTikla,
  };
}
