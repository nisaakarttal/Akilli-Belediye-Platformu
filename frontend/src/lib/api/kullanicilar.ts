import { apiClient } from "./client";
import type { Kullanici, KullaniciGuncelleIstegi, KullaniciRolu, SayfalanmisYanit } from "@/types";

export interface KullaniciFiltreleri {
  rol?: KullaniciRolu;
  arama?: string;
  sayfa?: number;
  sayfa_boyutu?: number;
}

export async function kullanicilariListele(filtreler: KullaniciFiltreleri = {}): Promise<SayfalanmisYanit<Kullanici>> {
  const { data } = await apiClient.get<SayfalanmisYanit<Kullanici>>("/kullanicilar", { params: filtreler });
  return data;
}

export async function kullaniciGetir(id: string): Promise<Kullanici> {
  const { data } = await apiClient.get<Kullanici>(`/kullanicilar/${id}`);
  return data;
}

export async function kullaniciGuncelle(id: string, istek: KullaniciGuncelleIstegi): Promise<Kullanici> {
  const { data } = await apiClient.put<Kullanici>(`/kullanicilar/${id}`, istek);
  return data;
}

export async function kullaniciRoluGuncelle(id: string, rol: KullaniciRolu): Promise<Kullanici> {
  const { data } = await apiClient.put<Kullanici>(`/kullanicilar/${id}/rol`, { rol });
  return data;
}

export async function kullaniciDurumuGuncelle(id: string, aktifMi: boolean): Promise<void> {
  await apiClient.put(`/kullanicilar/${id}/durum`, null, { params: { aktif_mi: aktifMi } });
}
