"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { taleplerApi } from "@/lib/api/talepler";
import type { TalepDurumu } from "@/types";

const SAYFA_BOYUTU = 50;

export function useAdminTalepler() {
  const [durumFiltresi, setDurumFiltresi] = useState<TalepDurumu | "">("");
  const [arama, setArama] = useState("");

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["admin-talepler", durumFiltresi],
    queryFn: () => taleplerApi.listele({ durum: durumFiltresi || undefined, sayfa_boyutu: SAYFA_BOYUTU }),
  });

  const talepler = useMemo(() => data?.veriler ?? [], [data]);

  const istatistikler = useMemo(() => {
    const toplam = talepler.length;
    const bekleyen = talepler.filter((t) => t.durum === "bekliyor").length;
    const atanan = talepler.filter((t) => t.durum === "atandi" || t.durum === "inceleniyor").length;
    const cozulen = talepler.filter((t) => t.durum === "cozuldu").length;
    return { toplam, bekleyen, atanan, cozulen };
  }, [talepler]);

  const filtrelenmisTalepler = useMemo(() => {
    if (!arama.trim()) return talepler;
    const aramaKucuk = arama.toLowerCase();
    return talepler.filter(
      (t) =>
        t.baslik.toLowerCase().includes(aramaKucuk) ||
        t.takip_no.toLowerCase().includes(aramaKucuk) ||
        t.kategori.ad.toLowerCase().includes(aramaKucuk) ||
        t.mahalle.ad.toLowerCase().includes(aramaKucuk)
    );
  }, [talepler, arama]);

  return {
    durumFiltresi,
    setDurumFiltresi,
    arama,
    setArama,
    isLoading,
    isRefetching,
    refetch,
    istatistikler,
    filtrelenmisTalepler,
  };
}
