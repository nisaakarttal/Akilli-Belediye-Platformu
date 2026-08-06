"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { useAuth } from "@/providers/auth-provider";
import type { KullaniciRolu } from "@/types";

export function KorumaliRota({
  children,
  izinliRoller,
}: {
  children: ReactNode;
  /** Belirtilirse yalnızca bu rollerdeki kullanıcılar erişebilir. Boş bırakılırsa her giriş yapmış kullanıcı erişebilir. */
  izinliRoller?: KullaniciRolu[];
}) {
  const { kullanici, yukleniyor } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (yukleniyor) return;
    if (!kullanici) {
      router.replace("/giris");
      return;
    }
    if (izinliRoller && !izinliRoller.includes(kullanici.rol)) {
      router.replace(kullanici.rol === "admin" ? "/admin" : kullanici.rol === "personel" ? "/personel" : "/panel");
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
