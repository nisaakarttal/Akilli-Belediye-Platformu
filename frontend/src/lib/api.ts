import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import type { TokenYaniti } from "@/types";

const TEMEL_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/** Yüklenen dosyaların (fotoğraf, video vb.) sunulduğu temel adres — backend'de /api/v1 altında değil, doğrudan /uploads altında sunulur. */
export const DOSYA_TEMEL_URL = TEMEL_URL.replace(/\/api\/v1\/?$/, "");

export function dosyaUrlOlustur(goreliYol: string): string {
  return `${DOSYA_TEMEL_URL}/uploads/${goreliYol}`;
}

export const ERISIM_TOKEN_ANAHTARI = "kapakli_erisim_tokeni";
export const YENILEME_TOKEN_ANAHTARI = "kapakli_yenileme_tokeni";

export const api = axios.create({
  baseURL: TEMEL_URL,
  headers: { "Content-Type": "application/json" },
});

function tokenOku(anahtar: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(anahtar);
}

function tokenleriKaydet(yanit: TokenYaniti) {
  window.localStorage.setItem(ERISIM_TOKEN_ANAHTARI, yanit.erisim_tokeni);
  window.localStorage.setItem(YENILEME_TOKEN_ANAHTARI, yanit.yenileme_tokeni);
}

export function tokenleriTemizle() {
  window.localStorage.removeItem(ERISIM_TOKEN_ANAHTARI);
  window.localStorage.removeItem(YENILEME_TOKEN_ANAHTARI);
}

// Her isteğe erişim tokenini ekler
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenOku(ERISIM_TOKEN_ANAHTARI);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let yenilemeIslemiSurmekte: Promise<string | null> | null = null;

// 401 alındığında yenileme tokeniyle otomatik olarak yeni erişim tokeni almayı dener
api.interceptors.response.use(
  (yanit) => yanit,
  async (hata: AxiosError) => {
    const orijinalIstek = hata.config as InternalAxiosRequestConfig & { _tekrarDenendi?: boolean };

    if (hata.response?.status !== 401 || orijinalIstek._tekrarDenendi || orijinalIstek.url?.includes("/auth/")) {
      return Promise.reject(hata);
    }

    orijinalIstek._tekrarDenendi = true;
    const yenilemeTokeni = tokenOku(YENILEME_TOKEN_ANAHTARI);

    if (!yenilemeTokeni) {
      tokenleriTemizle();
      return Promise.reject(hata);
    }

    try {
      if (!yenilemeIslemiSurmekte) {
        yenilemeIslemiSurmekte = axios
          .post<TokenYaniti>(`${TEMEL_URL}/auth/yenile`, { yenileme_tokeni: yenilemeTokeni })
          .then((yanit) => {
            tokenleriKaydet(yanit.data);
            return yanit.data.erisim_tokeni;
          })
          .catch(() => {
            tokenleriTemizle();
            return null;
          })
          .finally(() => {
            yenilemeIslemiSurmekte = null;
          });
      }

      const yeniToken = await yenilemeIslemiSurmekte;
      if (!yeniToken) return Promise.reject(hata);

      if (orijinalIstek.headers) {
        orijinalIstek.headers.Authorization = `Bearer ${yeniToken}`;
      }
      return api(orijinalIstek);
    } catch (yenilemeHatasi) {
      tokenleriTemizle();
      return Promise.reject(yenilemeHatasi);
    }
  }
);

export { tokenleriKaydet };

/** API hata yanıtından kullanıcıya gösterilecek Türkçe mesajı çıkarır. */
export function apiHataMesaji(hata: unknown, varsayilan = "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin."): string {
  if (axios.isAxiosError(hata)) {
    const detay = (hata.response?.data as { detail?: string } | undefined)?.detail;
    if (detay) return detay;
  }
  return varsayilan;
}
