import { api } from "@/lib/api";

export interface GenelIstatistik {
  toplam_talep: number;
  bugunku_talep: number;
  bu_hafta_talep: number;
  bu_ay_talep: number;
  cozulen_talep: number;
  bekleyen_talep: number;
  tamamlanma_orani: number;
}

export interface KategoriDagilimNoktasi {
  kategori_adi: string;
  sayi: number;
}

export interface MahalleDagilimNoktasi {
  mahalle_adi: string;
  sayi: number;
}

export interface GunlukTalepNoktasi {
  tarih: string;
  sayi: number;
}

export const adminApi = {
  genelIstatistikler: () => api.get<GenelIstatistik>("/admin/istatistikler").then((r) => r.data),
  kategoriDagilimi: () =>
    api.get<KategoriDagilimNoktasi[]>("/admin/istatistikler/kategori-dagilimi").then((r) => r.data),
  mahalleDagilimi: () =>
    api.get<MahalleDagilimNoktasi[]>("/admin/istatistikler/mahalle-dagilimi").then((r) => r.data),
  gunlukTalepler: (gunSayisi = 30) =>
    api
      .get<GunlukTalepNoktasi[]>("/admin/istatistikler/gunluk-talepler", { params: { gun_sayisi: gunSayisi } })
      .then((r) => r.data),
};
