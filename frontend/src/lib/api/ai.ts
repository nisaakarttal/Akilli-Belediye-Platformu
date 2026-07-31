import { apiClient } from "./client";
import type { TalepOnceligi } from "@/types";

export interface AiAnalizIstegi {
  baslik: string;
  aciklama: string;
}

export interface AiAnalizYaniti {
  onerilen_kategori_id: string | null;
  onerilen_kategori_adi: string | null;
  onerilen_oncelik: TalepOnceligi;
  guven_skoru: number;
  eksik_bilgiler: string[];
  ai_mesaji: string;
}

export interface SohbetKaydi {
  girdi: string;
  cikti: string;
  tarih: string;
}

export const aiApi = {
  async analizEt(istek: AiAnalizIstegi): Promise<AiAnalizYaniti> {
    const { data } = await apiClient.post<AiAnalizYaniti>(
      "/ai/analiz-et",
      istek
    );

    return data;
  },

  async sohbetEt(mesaj: string): Promise<string> {
    const { data } = await apiClient.post<{ yanit: string }>(
      "/ai/sohbet",
      { mesaj }
    );

    return data.yanit;
  },

  async sohbetGecmisi(): Promise<SohbetKaydi[]> {
    const { data } = await apiClient.get<SohbetKaydi[]>(
      "/ai/sohbet-gecmisi"
    );

    return data;
  },
};