import { apiClient } from "./client";
import type { Bildirim } from "@/types";

export async function bildirimleriListele(): Promise<Bildirim[]> {
  const { data } = await apiClient.get<Bildirim[]>("/bildirimler");
  return data;
}

export async function bildirimiOkunduYap(id: string): Promise<void> {
  await apiClient.put(`/bildirimler/${id}/okundu`);
}

export async function tumBildirimleriOkunduYap(): Promise<void> {
  await apiClient.put("/bildirimler/tumunu-okundu-yap");
}
