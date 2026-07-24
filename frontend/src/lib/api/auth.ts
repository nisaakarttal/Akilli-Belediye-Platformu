import { api } from "@/lib/api";
import type { Kullanici, TokenYaniti } from "@/types";

export interface KayitIstegi {
  ad: string;
  soyad: string;
  e_posta: string;
  telefon: string;
  sifre: string;
  tc_kimlik_no?: string;
  adres?: string;
}

export interface GirisIstegi {
  e_posta: string;
  sifre: string;
}

export const authApi = {
  kayitOl: (istek: KayitIstegi) => api.post<TokenYaniti>("/auth/kayit", istek).then((r) => r.data),

  girisYap: (istek: GirisIstegi) => api.post<TokenYaniti>("/auth/giris", istek).then((r) => r.data),

  benimBilgilerim: () => api.get<Kullanici>("/auth/ben").then((r) => r.data),

  sifremiUnuttum: (e_posta: string) =>
    api.post<{ mesaj: string }>("/auth/sifremi-unuttum", { e_posta }).then((r) => r.data),

  sifreSifirla: (token: string, yeni_sifre: string) =>
    api.post<{ mesaj: string }>("/auth/sifre-sifirla", { token, yeni_sifre }).then((r) => r.data),
};
