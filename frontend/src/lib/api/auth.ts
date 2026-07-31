import { apiClient, tokenleriKaydet, tokenleriTemizle } from "./client";
import type {
  Kullanici,
  KullaniciGirisIstegi,
  KullaniciKayitIstegi,
  TokenYaniti,
} from "@/types";

export async function girisYap(istek: KullaniciGirisIstegi): Promise<TokenYaniti> {
  const { data } = await apiClient.post<TokenYaniti>("/auth/giris", istek);
  tokenleriKaydet(data);
  return data;
}

export async function kayitOl(istek: KullaniciKayitIstegi): Promise<Kullanici> {
  const { data } = await apiClient.post<Kullanici>("/auth/kayit", istek);
  return data;
}

export async function benKimim(): Promise<Kullanici> {
  const { data } = await apiClient.get<Kullanici>("/auth/ben");
  return data;
}

export async function sifremiUnuttum(e_posta: string): Promise<void> {
  await apiClient.post("/auth/sifremi-unuttum", { e_posta });
}

export async function sifreSifirla(token: string, yeni_sifre: string): Promise<void> {
  await apiClient.post("/auth/sifre-sifirla", { token, yeni_sifre });
}

export function cikisYap() {
  tokenleriTemizle();
  if (typeof window !== "undefined") {
    window.location.href = "/giris";
  }
}
