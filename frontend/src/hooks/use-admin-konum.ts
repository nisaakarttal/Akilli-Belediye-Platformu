"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, type FormEvent } from "react";

import { KAPAKLI_MERKEZ_KOORDINATLARI } from "@/constants/konum";
import { apiHataMesaji } from "@/lib/api";
import { konumApi } from "@/lib/api/konum";

const BILDIRIM_GOSTERIM_SURESI_MS = 3000;
const VARSAYILAN_IL = "Tekirdağ";

const VARSAYILAN_KOORDINAT_FORMU = {
  merkez_enlem: String(KAPAKLI_MERKEZ_KOORDINATLARI.enlem),
  merkez_boylam: String(KAPAKLI_MERKEZ_KOORDINATLARI.boylam),
};

function bosIlceFormu() {
  return { ad: "", il: VARSAYILAN_IL, ...VARSAYILAN_KOORDINAT_FORMU };
}

function bosMahalleFormu(oncekiIlceId = "") {
  return { ad: "", ilce_id: oncekiIlceId, ...VARSAYILAN_KOORDINAT_FORMU };
}

export function useAdminKonum() {
  const queryClient = useQueryClient();

  const [ilceForm, setIlceForm] = useState(bosIlceFormu());
  const [mahalleForm, setMahalleForm] = useState(bosMahalleFormu());

  const [mahalleArama, setMahalleArama] = useState("");
  const [seciliIlceFiltresi, setSeciliIlceFiltresi] = useState<string>("HEPSISI");

  const [hata, setHata] = useState<string | null>(null);
  const [basari, setBasari] = useState<string | null>(null);

  const {
    data: ilceler = [],
    isLoading: ilcelerYukleniyor,
    refetch: ilceleriYenile,
  } = useQuery({
    queryKey: ["ilceler"],
    queryFn: konumApi.ilceleriListele,
  });

  const {
    data: mahalleler = [],
    isLoading: mahallelerYukleniyor,
    refetch: mahalleleriYenile,
  } = useQuery({
    queryKey: ["mahalleler"],
    queryFn: () => konumApi.mahalleleriListele(),
  });

  const ilceEkleMutation = useMutation({
    mutationFn: () =>
      konumApi.ilceOlustur({
        ad: ilceForm.ad.trim(),
        il: ilceForm.il.trim(),
        merkez_enlem: parseFloat(ilceForm.merkez_enlem) || 0,
        merkez_boylam: parseFloat(ilceForm.merkez_boylam) || 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ilceler"] });
      setBasari(`"${ilceForm.ad}" ilçesi sisteme başarıyla eklendi.`);
      setIlceForm(bosIlceFormu());
      setTimeout(() => setBasari(null), BILDIRIM_GOSTERIM_SURESI_MS);
    },
    onError: (hataNesnesi) => {
      setHata(apiHataMesaji(hataNesnesi, "İlçe eklenirken bir hata oluştu."));
    },
  });

  const mahalleEkleMutation = useMutation({
    mutationFn: () =>
      konumApi.mahalleOlustur({
        ad: mahalleForm.ad.trim(),
        ilce_id: mahalleForm.ilce_id,
        merkez_enlem: parseFloat(mahalleForm.merkez_enlem) || 0,
        merkez_boylam: parseFloat(mahalleForm.merkez_boylam) || 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahalleler"] });
      setBasari(`"${mahalleForm.ad}" mahallesi sisteme başarıyla eklendi.`);
      setMahalleForm(bosMahalleFormu(mahalleForm.ilce_id));
      setTimeout(() => setBasari(null), BILDIRIM_GOSTERIM_SURESI_MS);
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

  function verileriYenile() {
    ilceleriYenile();
    mahalleleriYenile();
  }

  const filtrelenmisMahalleler = useMemo(() => {
    return mahalleler.filter((mahalle) => {
      const ilceEslesti = seciliIlceFiltresi === "HEPSISI" || mahalle.ilce_id === seciliIlceFiltresi;
      const aramaEslesti = mahalle.ad.toLowerCase().includes(mahalleArama.toLowerCase());
      return ilceEslesti && aramaEslesti;
    });
  }, [mahalleler, seciliIlceFiltresi, mahalleArama]);

  return {
    ilceForm,
    setIlceForm,
    mahalleForm,
    setMahalleForm,
    mahalleArama,
    setMahalleArama,
    seciliIlceFiltresi,
    setSeciliIlceFiltresi,
    hata,
    basari,
    ilceler,
    ilcelerYukleniyor,
    mahalleler,
    mahallelerYukleniyor,
    ilceEkleMutation,
    mahalleEkleMutation,
    handleIlceEkle,
    handleMahalleEkle,
    verileriYenile,
    filtrelenmisMahalleler,
  };
}
