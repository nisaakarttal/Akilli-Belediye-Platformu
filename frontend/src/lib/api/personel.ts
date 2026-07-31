import { apiClient } from "./client";
import type { TalepListe } from "@/types";

export async function atananTalepleriListele(): Promise<TalepListe[]> {
  const { data } = await apiClient.get<TalepListe[]>("/personel/atanan-talepler");
  return data;
}
