import { apiClient } from "./client";
import type { DosyaTuru, TalepDetay, TalepDurumu, TalepListe } from "@/types";

export interface PersonelIstatistikleri {
  toplam: number;
  bekleyen: number;
  islemde: number;
  cozuldu: number;
  acil: number;
}

export interface PersonelDashboard {
  istatistikler: PersonelIstatistikleri;
  son_atananlar: TalepListe[];
  acil_talepler: TalepListe[];
}

export async function personelDashboardGetir(): Promise<PersonelDashboard> {
  const { data } = await apiClient.get<PersonelDashboard>("/personel/dashboard");
  return data;
}

export async function atananTalepleriListele(): Promise<TalepListe[]> {
  const { data } = await apiClient.get<TalepListe[]>("/personel/atanan-talepler");
  return data;
}

export async function atananTalepDetayGetir(id: string): Promise<TalepDetay> {
  const { data } = await apiClient.get<TalepDetay>(`/personel/atanan-talepler/${id}`);
  return data;
}

export async function atananTalepDurumGuncelle(
  id: string,
  durum: TalepDurumu,
  aciklama?: string
): Promise<TalepDetay> {
  const { data } = await apiClient.put<TalepDetay>(`/personel/atanan-talepler/${id}/durum`, {
    durum,
    aciklama,
  });
  return data;
}

export async function atananTalepCoz(id: string, cozumNotu: string): Promise<TalepDetay> {
  const { data } = await apiClient.post<TalepDetay>(`/personel/atanan-talepler/${id}/coz`, {
    cozum_notu: cozumNotu,
  });
  return data;
}

export async function atananTalepDosyaYukle(
  id: string,
  dosya: File,
  dosyaTuru: DosyaTuru = "sonuc_fotografi"
): Promise<void> {
  const form = new FormData();
  form.append("dosya", dosya);
  await apiClient.post(`/talepler/${id}/dosya`, form, {
    params: { dosya_turu: dosyaTuru },
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function islemNotuEkle(id: string, not: string): Promise<TalepDetay> {
  const { data } = await apiClient.post<TalepDetay>(`/personel/atanan-talepler/${id}/not`, { not });
  return data;
}

export async function vatandasiBilgilendir(id: string, mesaj: string): Promise<TalepDetay> {
  const { data } = await apiClient.post<TalepDetay>(`/personel/atanan-talepler/${id}/bilgilendir`, { mesaj });
  return data;
}
