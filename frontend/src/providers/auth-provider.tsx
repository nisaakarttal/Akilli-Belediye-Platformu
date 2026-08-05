"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { benKimim, cikisYap as apiCikisYap, girisYap as apiGirisYap } from "@/lib/api/auth";
import { erisimTokeniniAl } from "@/lib/api/client";
import type { Kullanici, KullaniciGirisIstegi } from "@/types";

interface AuthContextValue {
  kullanici: Kullanici | null;
  yukleniyor: boolean;
  girisYap: (istek: KullaniciGirisIstegi) => Promise<Kullanici>;
  cikisYap: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [hazir, setHazir] = React.useState(false);

  React.useEffect(() => setHazir(true), []);

  const { data: kullanici, isLoading } = useQuery({
    queryKey: ["ben"],
    queryFn: benKimim,
    enabled: hazir && !!erisimTokeniniAl(),
    retry: false,
  });

  const girisYap = React.useCallback(
    async (istek: KullaniciGirisIstegi) => {
      const yanit = await apiGirisYap(istek);
      queryClient.setQueryData(["ben"], yanit.kullanici);
      return yanit.kullanici;
    },
    [queryClient]
  );

  const cikisYap = React.useCallback(() => {
    queryClient.setQueryData(["ben"], null);
    apiCikisYap();
  }, [queryClient]);

  return (
    <AuthContext.Provider
      value={{
        kullanici: kullanici ?? null,
        yukleniyor: !hazir || (!!erisimTokeniniAl() && isLoading),
        girisYap,
        cikisYap,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalıdır.");
  return ctx;
}

/** İstemci bileşenlerinde belirli rollerle korunan sayfalar için basit kapı. */
export function useRoleGuard(izinliRoller: Kullanici["rol"][]) {
  const { kullanici, yukleniyor } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (yukleniyor) return;
    if (!kullanici) {
      router.replace("/giris");
      return;
    }
    if (!izinliRoller.includes(kullanici.rol)) {
      router.replace(kullanici.rol === "admin" ? "/admin" : kullanici.rol === "personel" ? "/personel" : "/panel");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kullanici, yukleniyor]);

  return { kullanici, yukleniyor };
}
