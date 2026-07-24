"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { type GirisIstegi, type KayitIstegi, authApi } from "@/lib/api/auth";
import { ERISIM_TOKEN_ANAHTARI, tokenleriKaydet, tokenleriTemizle } from "@/lib/api";
import type { Kullanici } from "@/types";

interface KimlikBaglami {
  kullanici: Kullanici | null;
  yukleniyor: boolean;
  girisYap: (istek: GirisIstegi) => Promise<void>;
  kayitOl: (istek: KayitIstegi) => Promise<void>;
  cikisYap: () => void;
}

const KimlikContext = createContext<KimlikBaglami | undefined>(undefined);

export function KimlikSaglayici({ children }: { children: ReactNode }) {
  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem(ERISIM_TOKEN_ANAHTARI);
    if (!token) {
      setYukleniyor(false);
      return;
    }

    authApi
      .benimBilgilerim()
      .then(setKullanici)
      .catch(() => tokenleriTemizle())
      .finally(() => setYukleniyor(false));
  }, []);

  async function girisYap(istek: GirisIstegi) {
    const yanit = await authApi.girisYap(istek);
    tokenleriKaydet(yanit);
    setKullanici(yanit.kullanici);
  }

  async function kayitOl(istek: KayitIstegi) {
    const yanit = await authApi.kayitOl(istek);
    tokenleriKaydet(yanit);
    setKullanici(yanit.kullanici);
  }

  function cikisYap() {
    tokenleriTemizle();
    setKullanici(null);
    router.push("/giris");
  }

  return (
    <KimlikContext.Provider value={{ kullanici, yukleniyor, girisYap, kayitOl, cikisYap }}>
      {children}
    </KimlikContext.Provider>
  );
}

export function useKimlik(): KimlikBaglami {
  const baglam = useContext(KimlikContext);
  if (baglam === undefined) {
    throw new Error("useKimlik yalnızca <KimlikSaglayici> içinde kullanılabilir.");
  }
  return baglam;
}
