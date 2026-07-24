"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { useKimlik } from "@/hooks/use-kimlik";
import type { KullaniciRolu } from "@/types";

export function KorumaliRota({
  children,
  izinliRoller,
}: {
  children: ReactNode;
  /** Belirtilirse yalnızca bu rollerdeki kullanıcılar erişebilir. Boş bırakılırsa her giriş yapmış kullanıcı erişebilir. */
  izinliRoller?: KullaniciRolu[];
}) {
  const { kullanici, yukleniyor } = useKimlik();
  const router = useRouter();

  useEffect(() => {
    if (yukleniyor) return;
    if (!kullanici) {
      router.push("/giris");
      return;
    }
    if (izinliRoller && !izinliRoller.includes(kullanici.rol)) {
      router.push("/");
    }
  }, [kullanici, yukleniyor, izinliRoller, router]);

  if (yukleniyor || !kullanici) {
    return <TamSayfaYukleniyor />;
  }

  if (izinliRoller && !izinliRoller.includes(kullanici.rol)) {
    return <TamSayfaYukleniyor />;
  }

  return <>{children}</>;
}
