"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

import { kullanicilarApi } from "@/lib/api/kullanicilar";
import { taleplerApi } from "@/lib/api/talepler";

/** Atama sonucu bildiriminin ekranda kalma süresi (ms). */
const BILDIRIM_GOSTERIM_SURESI_MS = 4000;

interface AtamaBildirimi {
  tip: "basari" | "hata";
  mesaj: string;
}

export function useAdminTalepDetay() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [secilenPersonelId, setSecilenPersonelId] = useState("");
  const [bildirim, setBildirim] = useState<AtamaBildirimi | null>(null);

  const { data: talep, isLoading, isError } = useQuery({
    queryKey: ["admin-talep", id],
    queryFn: () => taleplerApi.getir(id),
  });

  const { data: personelListesi, isLoading: personellerYukleniyor } = useQuery({
    queryKey: ["personeller"],
    queryFn: () => kullanicilarApi.listele({ rol: "personel" }),
  });

  const atamaMutation = useMutation({
    mutationFn: (personelId: string) => taleplerApi.ata(id, personelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-talep", id] });
      setBildirim({ tip: "basari", mesaj: "Talep başarıyla ilgili personele atandı." });
      setSecilenPersonelId("");
      setTimeout(() => setBildirim(null), BILDIRIM_GOSTERIM_SURESI_MS);
    },
    onError: () => {
      setBildirim({ tip: "hata", mesaj: "Atama işlemi sırasında bir sorun oluştu. Lütfen tekrar deneyin." });
      setTimeout(() => setBildirim(null), BILDIRIM_GOSTERIM_SURESI_MS);
    },
  });

  const atananPersonel = personelListesi?.veriler?.find((p) => p.id === talep?.atanan_personel_id);

  return {
    talep,
    isLoading,
    isError,
    personelListesi,
    personellerYukleniyor,
    secilenPersonelId,
    setSecilenPersonelId,
    atamaMutation,
    atananPersonel,
    bildirim,
  };
}
