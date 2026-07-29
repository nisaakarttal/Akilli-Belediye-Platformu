"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { VARSAYILAN_ZAMAN_FILTRESI, type ZamanFiltresi } from "@/constants/admin-dashboard";
import { adminApi } from "@/lib/api/admin";

/**
 * Admin "Genel Bakış" sayfasının tüm veri çekme mantığını (4 ayrı istatistik
 * sorgusu + zaman filtresi durumu + kategori toplamı hesaplaması) kapsayan
 * custom hook. Sayfa bileşenini yalnızca sunum (JSX) ile ilgilenecek şekilde
 * sadeleştirir.
 */
export function useYoneticiGenelBakis() {
  const [zamanFiltresi, setZamanFiltresi] = useState<ZamanFiltresi>(VARSAYILAN_ZAMAN_FILTRESI);

  const { data: genel, isLoading: genelYukleniyor } = useQuery({
    queryKey: ["admin-genel-istatistik"],
    queryFn: adminApi.genelIstatistikler,
  });

  const { data: kategoriDagilimi } = useQuery({
    queryKey: ["admin-kategori-dagilimi"],
    queryFn: adminApi.kategoriDagilimi,
  });

  const { data: mahalleDagilimi } = useQuery({
    queryKey: ["admin-mahalle-dagilimi"],
    queryFn: adminApi.mahalleDagilimi,
  });

  const { data: gunlukTalepler } = useQuery({
    queryKey: ["admin-gunluk-talepler", zamanFiltresi],
    queryFn: () => adminApi.gunlukTalepler(zamanFiltresi),
  });

  const kategoriToplamSayi = useMemo(() => {
    if (!kategoriDagilimi) return 0;
    return kategoriDagilimi.reduce((toplam, kategori) => toplam + kategori.sayi, 0);
  }, [kategoriDagilimi]);

  return {
    zamanFiltresi,
    setZamanFiltresi,
    genel,
    genelYukleniyor,
    kategoriDagilimi,
    mahalleDagilimi,
    gunlukTalepler,
    kategoriToplamSayi,
  };
}
