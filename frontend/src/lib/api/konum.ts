import { apiClient } from "./client";
import type { Ilce, Mahalle } from "@/types";

export interface IlceOlusturIstegi {
  ad: string;
  il: string;
  merkez_enlem: number;
  merkez_boylam: number;
}

export interface MahalleOlusturIstegi {
  ad: string;
  ilce_id: string;
  merkez_enlem: number;
  merkez_boylam: number;
}

export async function ilceleriListele(): Promise<Ilce[]> {
  const { data } = await apiClient.get<Ilce[]>("/ilceler");
  return data;
}

export async function ilceOlustur(istek: IlceOlusturIstegi): Promise<Ilce> {
  const { data } = await apiClient.post<Ilce>("/ilceler", istek);
  return data;
}

export async function mahalleleriListele(ilceId?: string): Promise<Mahalle[]> {
  const { data } = await apiClient.get<Mahalle[]>("/mahalleler", {
    params: ilceId ? { ilce_id: ilceId } : undefined,
  });
  return data;
}

export async function mahalleOlustur(istek: MahalleOlusturIstegi): Promise<Mahalle> {
  const { data } = await apiClient.post<Mahalle>("/mahalleler", istek);
  return data;
}

export const konumApi = {
  ilceleriListele,
  ilceOlustur,
  mahalleleriListele,
  mahalleOlustur,
};
