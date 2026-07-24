import { api } from "@/lib/api";
import type { AnalizYaniti } from "@/types";

export const aiApi = {
  sohbetEt: (mesaj: string) => api.post<{ yanit: string }>("/ai/sohbet", { mesaj }).then((r) => r.data.yanit),

  analizEt: (baslik: string, aciklama: string) =>
    api.post<AnalizYaniti>("/ai/analiz-et", { baslik, aciklama }).then((r) => r.data),
};
