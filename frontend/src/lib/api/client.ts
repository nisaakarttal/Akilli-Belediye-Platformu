import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";
import type { TokenYaniti } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const ERISIM_TOKENI_ANAHTARI = "kb_erisim_tokeni";
export const YENILEME_TOKENI_ANAHTARI = "kb_yenileme_tokeni";

export function erisimTokeniniAl(): string | undefined {
  return Cookies.get(ERISIM_TOKENI_ANAHTARI);
}

export function yenilemeTokeniniAl(): string | undefined {
  return Cookies.get(YENILEME_TOKENI_ANAHTARI);
}

export function tokenleriKaydet(yanit: Pick<TokenYaniti, "erisim_tokeni" | "yenileme_tokeni">) {
  // Erişim tokeni kısa ömürlü: 15 dk. Yenileme tokeni: 7 gün.
  Cookies.set(ERISIM_TOKENI_ANAHTARI, yanit.erisim_tokeni, {
    expires: 1 / 96,
    sameSite: "strict",
  });
  Cookies.set(YENILEME_TOKENI_ANAHTARI, yanit.yenileme_tokeni, {
    expires: 7,
    sameSite: "strict",
  });
}

export function tokenleriTemizle() {
  Cookies.remove(ERISIM_TOKENI_ANAHTARI);
  Cookies.remove(YENILEME_TOKENI_ANAHTARI);
}

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = erisimTokeniniAl();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 alındığında refresh token ile tek seferlik otomatik yenileme.
// Eşzamanlı isteklerde tekrar tekrar /yenile çağrılmasını önlemek için
// devam eden yenileme isteğini paylaşırız.
let yenilemePromise: Promise<string | null> | null = null;

async function erisimTokeniniYenile(): Promise<string | null> {
  const yenilemeTokeni = yenilemeTokeniniAl();
  if (!yenilemeTokeni) return null;

  try {
    const { data } = await axios.post<TokenYaniti>(
      `${API_URL}/api/v1/auth/yenile`,
      { yenileme_tokeni: yenilemeTokeni }
    );
    tokenleriKaydet(data);
    return data.erisim_tokeni;
  } catch {
    tokenleriTemizle();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const orijinalIstek = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && orijinalIstek && !orijinalIstek._retry) {
      orijinalIstek._retry = true;

      if (!yenilemePromise) {
        yenilemePromise = erisimTokeniniYenile().finally(() => {
          yenilemePromise = null;
        });
      }

      const yeniToken = await yenilemePromise;

      if (yeniToken) {
        orijinalIstek.headers = {
          ...orijinalIstek.headers,
          Authorization: `Bearer ${yeniToken}`,
        };
        return apiClient(orijinalIstek);
      }

      if (typeof window !== "undefined") {
        window.location.href = "/giris";
      }
    }

    return Promise.reject(error);
  }
);

/** FastAPI hata gövdesinden okunabilir bir mesaj çıkarır. */
export function apiHataMesaji(hata: unknown, varsayilan = "Bir şeyler ters gitti. Lütfen tekrar deneyin."): string {
  if (axios.isAxiosError(hata)) {
    const detail = hata.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  }
  return varsayilan;
}
