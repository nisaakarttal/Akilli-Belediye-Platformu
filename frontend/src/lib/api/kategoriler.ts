import { apiClient } from "./client";
import type { Kategori } from "@/types";

export interface KategoriOlusturIstegi {
  ad: string;
  aciklama?: string | null;
  ikon?: string | null;
  sorumlu_departman: string;
  renk?: string;
  sla_saat?: number;
}

export type KategoriGuncelleIstegi = Partial<KategoriOlusturIstegi>;

export async function kategorileriListele(): Promise<Kategori[]> {
  const { data } = await apiClient.get<Kategori[]>("/kategoriler");
  return data;
}

export async function kategoriOlustur(istek: KategoriOlusturIstegi): Promise<Kategori> {
  const { data } = await apiClient.post<Kategori>("/kategoriler", istek);
  return data;
}

export async function kategoriGuncelle(id: string, istek: KategoriGuncelleIstegi): Promise<Kategori> {
  const { data } = await apiClient.put<Kategori>(`/kategoriler/${id}`, istek);
  return data;
}

export async function kategoriSil(id: string): Promise<void> {
  await apiClient.delete(`/kategoriler/${id}`);
}

export async function kategoriPasifYap(id: string): Promise<void> {
  await apiClient.put(`/kategoriler/${id}/pasif-yap`);
}

export async function kategoriGeriYukle(id: string): Promise<Kategori> {
  const { data } = await apiClient.put<Kategori>(`/kategoriler/${id}/geri-yukle`);
  return data;
}
