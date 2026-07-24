import { api } from "@/lib/api";
import type { KullaniciRolu, Kullanici, SayfalanmisYanit } from "@/types";

export interface KullaniciGuncelleIstegi {
  ad?: string;
  soyad?: string;
  telefon?: string;
  adres?: string;
}

export interface KullaniciListeFiltreleri {
  rol?: KullaniciRolu;
  arama?: string;
  sayfa?: number;
  sayfa_boyutu?: number;
}

export const kullanicilarApi = {
  guncelle: (id: string, istek: KullaniciGuncelleIstegi) =>
    api.put<Kullanici>(`/kullanicilar/${id}`, istek).then((r) => r.data),

  listele: (filtreler: KullaniciListeFiltreleri = {}) =>
    api.get<SayfalanmisYanit<Kullanici>>("/kullanicilar/", { params: filtreler }).then((r) => r.data),

  rolGuncelle: (id: string, rol: KullaniciRolu, departman?: string) =>
    api.put<Kullanici>(`/kullanicilar/${id}/rol`, { rol, departman }).then((r) => r.data),

  durumDegistir: (id: string, aktifMi: boolean) =>
    api
      .put<{ mesaj: string }>(`/kullanicilar/${id}/durum`, null, { params: { aktif_mi: aktifMi } })
      .then((r) => r.data),
};
