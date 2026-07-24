import { api } from "@/lib/api";
import type { Bildirim } from "@/types";

export const bildirimlerApi = {
  listele: (sadeceOkunmamis = false) =>
    api.get<Bildirim[]>("/bildirimler/", { params: { sadece_okunmamis: sadeceOkunmamis } }).then((r) => r.data),

  okunduYap: (id: string) => api.put<{ mesaj: string }>(`/bildirimler/${id}/okundu`).then((r) => r.data),

  tumunuOkunduYap: () => api.put<{ mesaj: string }>("/bildirimler/tumunu-okundu-yap").then((r) => r.data),
};
