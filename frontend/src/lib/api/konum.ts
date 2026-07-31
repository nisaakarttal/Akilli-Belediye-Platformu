import { apiClient } from "./client";
import type { Ilce, Mahalle } from "@/types";

export async function ilceleriListele(): Promise<Ilce[]> {
  const { data } = await apiClient.get<Ilce[]>("/ilceler");
  return data;
}

export async function mahalleleriListele(ilceId?: string): Promise<Mahalle[]> {
  const { data } = await apiClient.get<Mahalle[]>("/mahalleler", {
    params: ilceId ? { ilce_id: ilceId } : undefined,
  });
  return data;
}
