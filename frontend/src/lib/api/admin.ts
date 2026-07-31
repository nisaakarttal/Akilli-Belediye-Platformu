import { apiClient } from "./client";
import type {
  AktiviteKaydi,
  GenelIstatistikler,
  GunlukTalep,
  KategoriDagilimi,
  MahalleAnalizi,
  MahalleDagilimi,
  MemnuniyetKategori,
  MemnuniyetPersonel,
  PersonelPerformansi,
  SayfalanmisYanit,
} from "@/types";

export async function genelIstatistikleriGetir(): Promise<GenelIstatistikler> {
  const { data } = await apiClient.get<GenelIstatistikler>("/admin/istatistikler");
  return data;
}

export async function kategoriDagilimiGetir(): Promise<KategoriDagilimi[]> {
  const { data } = await apiClient.get<KategoriDagilimi[]>("/admin/istatistikler/kategori-dagilimi");
  return data;
}

export async function mahalleDagilimiGetir(): Promise<MahalleDagilimi[]> {
  const { data } = await apiClient.get<MahalleDagilimi[]>("/admin/istatistikler/mahalle-dagilimi");
  return data;
}

export async function gunlukTalepleriGetir(gunSayisi = 30): Promise<GunlukTalep[]> {
  const { data } = await apiClient.get<GunlukTalep[]>("/admin/istatistikler/gunluk-talepler", {
    params: { gun_sayisi: gunSayisi },
  });
  return data;
}

export async function mahalleAnaliziGetir(): Promise<MahalleAnalizi[]> {
  const { data } = await apiClient.get<MahalleAnalizi[]>("/admin/istatistikler/mahalle-analizi");
  return data;
}

export async function personelPerformansiGetir(): Promise<PersonelPerformansi[]> {
  const { data } = await apiClient.get<PersonelPerformansi[]>("/admin/istatistikler/personel-performans");
  return data;
}

export async function memnuniyetPersonelGetir(): Promise<MemnuniyetPersonel[]> {
  const { data } = await apiClient.get<MemnuniyetPersonel[]>("/admin/istatistikler/memnuniyet-personel");
  return data;
}

export async function memnuniyetKategoriGetir(): Promise<MemnuniyetKategori[]> {
  const { data } = await apiClient.get<MemnuniyetKategori[]>("/admin/istatistikler/memnuniyet-kategori");
  return data;
}

export async function aktiviteKayitlariniListele(sayfa = 1, sayfaBoyutu = 20): Promise<SayfalanmisYanit<AktiviteKaydi>> {
  const { data } = await apiClient.get<SayfalanmisYanit<AktiviteKaydi>>("/admin/aktivite-kayitlari", {
    params: { sayfa, sayfa_boyutu: sayfaBoyutu },
  });
  return data;
}
