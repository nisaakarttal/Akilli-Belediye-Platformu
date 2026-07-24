import { api } from "@/lib/api";
import type { Ilce, Kategori, Mahalle } from "@/types";

export interface KategoriIstegi {
  ad: string;
  aciklama?: string;
  ikon?: string;
  sorumlu_departman: string;
  renk: string;
}

export const kategorilerApi = {
  listele: () => api.get<Kategori[]>("/kategoriler").then((r) => r.data),
  olustur: (istek: KategoriIstegi) => api.post<Kategori>("/kategoriler/", istek).then((r) => r.data),
  guncelle: (id: string, istek: Partial<KategoriIstegi>) =>
    api.put<Kategori>(`/kategoriler/${id}`, istek).then((r) => r.data),
  sil: (id: string) => api.delete<{ mesaj: string }>(`/kategoriler/${id}`).then((r) => r.data),
};

export const konumApi = {
  ilceleriListele: () => api.get<Ilce[]>("/ilceler").then((r) => r.data),
  ilceOlustur: (istek: { ad: string; il: string; merkez_enlem: number; merkez_boylam: number }) =>
    api.post<Ilce>("/ilceler", istek).then((r) => r.data),

  mahalleleriListele: (ilceId?: string) =>
    api
      .get<Mahalle[]>("/mahalleler", { params: ilceId ? { ilce_id: ilceId } : {} })
      .then((r) => r.data),
  mahalleOlustur: (istek: { ad: string; ilce_id: string; merkez_enlem: number; merkez_boylam: number }) =>
    api.post<Mahalle>("/mahalleler", istek).then((r) => r.data),
};
