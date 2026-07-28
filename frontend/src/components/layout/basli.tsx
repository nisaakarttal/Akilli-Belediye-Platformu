"use client";

import { useQuery } from "@tanstack/react-query";
import { Bell, ClipboardList, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { TemaDegistirici } from "@/components/layout/tema-degistirici";
import { Dugme } from "@/components/ui/button";
import { useKimlik } from "@/hooks/use-kimlik";
import { bildirimlerApi } from "@/lib/api/bildirimler";
import { cn } from "@/lib/utils";
import type { Bildirim, KullaniciRolu } from "@/types";

interface GezinmeBaglantisi {
  ad: string;
  yol: string;
}

/** Backend, bazı uçlarda diziyi doğrudan, bazılarında sayfalanmış obje içinde döndürebilir. */
interface SayfalanmisBildirimYaniti {
  veriler?: Bildirim[];
  items?: Bildirim[];
}

/** Okunma alanının olası isimlerinin hepsini tolere eden gevşek bildirim şekli. */
type EsnekBildirim = Partial<Pick<Bildirim, "okundu_mu">> & {
  okundu?: boolean;
  is_read?: boolean;
};

const BILDIRIM_YENILEME_ARALIGI_MS = 5000;
const BASLIK_IKON_BOYUTU = 18;
const MOBIL_MENU_IKON_BOYUTU = 20;

function gezinmeBaglantilariniOlustur(rol: KullaniciRolu | undefined): GezinmeBaglantisi[] {
  const baglantilar: GezinmeBaglantisi[] = [{ ad: "Ana Sayfa", yol: "/" }];

  if (rol === "vatandas") {
    baglantilar.push(
      { ad: "Şikâyet Oluştur", yol: "/sikayet-olustur" },
      { ad: "Taleplerim", yol: "/taleplerim" }
    );
  } else if (rol === "personel") {
    baglantilar.push({ ad: "Atanan Taleplerim", yol: "/personel" });
  } else if (rol === "admin") {
    baglantilar.push({ ad: "Talepler", yol: "/admin/talepler" });
  }

  baglantilar.push({ ad: "Harita", yol: "/harita" }, { ad: "Duyurular", yol: "/duyurular" });
  return baglantilar;
}

/** Bir bildirimin okunmamış sayılıp sayılmayacağını, alan adı farklılıklarını tolere ederek belirler. */
function bildirimOkunmamisMi(bildirim: EsnekBildirim): boolean {
  const okundu = bildirim.okundu_mu ?? bildirim.okundu ?? bildirim.is_read;
  // Backend zaten yalnızca okunmamışları döndürüyorsa bu alanların hiçbiri gelmeyebilir.
  if (okundu === undefined) return true;
  return okundu === false;
}

export function Basli() {
  const { kullanici, cikisYap, yukleniyor } = useKimlik();
  const [menuAcikMi, setMenuAcikMi] = useState(false);

  // Yalnızca okunmamış bildirimleri çeker, kısa aralıklarla otomatik günceller.
  const { data: okunmamisData } = useQuery({
    queryKey: ["okunmamis-bildirimler"],
    queryFn: () => bildirimlerApi.listele(true),
    enabled: !!kullanici,
    refetchInterval: BILDIRIM_YENILEME_ARALIGI_MS,
  });

  const bildirimListesi: Bildirim[] = Array.isArray(okunmamisData)
    ? okunmamisData
    : (okunmamisData as SayfalanmisBildirimYaniti | undefined)?.veriler ??
      (okunmamisData as SayfalanmisBildirimYaniti | undefined)?.items ??
      [];

  const okunmamisVarMi = bildirimListesi.some(bildirimOkunmamisMi);
  const gezinmeBaglantilari = gezinmeBaglantilariniOlustur(kullanici?.rol);

  return (
    <header className="sticky top-0 z-50 cam-kart border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-birincil-600">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-birincil-500 to-ikincil-500 text-white">
            K
          </span>
          <span className="hidden sm:inline">Kapaklı Belediyesi</span>
        </Link>

        <nav aria-label="Ana gezinme" className="hidden items-center gap-1 lg:flex">
          {gezinmeBaglantilari.map((baglanti) => (
            <Link
              key={baglanti.yol}
              href={baglanti.yol}
              className="rounded-lg px-3 py-2 text-sm font-medium text-metin-ikincil transition-colors hover:bg-black/5 hover:text-metin dark:hover:bg-white/10"
            >
              {baglanti.ad}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <TemaDegistirici />

          {!yukleniyor && kullanici && (
            <>
              {kullanici.rol === "personel" && (
                <Link href="/personel">
                  <Dugme varyant="hayalet" boyut="simge" aria-label="Personel Paneli">
                    <ClipboardList size={BASLIK_IKON_BOYUTU} />
                  </Dugme>
                </Link>
              )}
              {kullanici.rol === "admin" && (
                <Link href="/admin">
                  <Dugme varyant="hayalet" boyut="simge" aria-label="Yönetici Paneli">
                    <LayoutDashboard size={BASLIK_IKON_BOYUTU} />
                  </Dugme>
                </Link>
              )}

              <Link href="/bildirimler" className="relative inline-flex items-center justify-center">
                <Dugme varyant="hayalet" boyut="simge" aria-label="Bildirimler">
                  <Bell size={BASLIK_IKON_BOYUTU} />
                </Dugme>
                {okunmamisVarMi && (
                  <span className="pointer-events-none absolute right-1.5 top-1.5 flex h-2.5 w-2.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
                  </span>
                )}
              </Link>

              <Link href="/profil" className="hidden items-center gap-2 sm:flex">
                <Dugme varyant="hayalet" boyut="orta" className="gap-2">
                  <User size={16} />
                  {kullanici.ad}
                </Dugme>
              </Link>
              <Dugme varyant="hayalet" boyut="simge" onClick={cikisYap} aria-label="Çıkış Yap">
                <LogOut size={BASLIK_IKON_BOYUTU} />
              </Dugme>
            </>
          )}

          {!yukleniyor && !kullanici && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/giris">
                <Dugme varyant="hayalet">Giriş Yap</Dugme>
              </Link>
              <Link href="/kayit">
                <Dugme varyant="birincil">Kayıt Ol</Dugme>
              </Link>
            </div>
          )}

          <Dugme
            varyant="hayalet"
            boyut="simge"
            className="lg:hidden"
            onClick={() => setMenuAcikMi((v) => !v)}
            aria-label="Menüyü Aç/Kapat"
            aria-expanded={menuAcikMi}
          >
            {menuAcikMi ? <X size={MOBIL_MENU_IKON_BOYUTU} /> : <Menu size={MOBIL_MENU_IKON_BOYUTU} />}
          </Dugme>
        </div>
      </div>

      <div className={cn("overflow-hidden transition-all lg:hidden", menuAcikMi ? "max-h-96" : "max-h-0")}>
        <nav aria-label="Mobil gezinme" className="flex flex-col gap-1 px-4 pb-4">
          {gezinmeBaglantilari.map((baglanti) => (
            <Link
              key={baglanti.yol}
              href={baglanti.yol}
              onClick={() => setMenuAcikMi(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-metin-ikincil hover:bg-black/5 dark:hover:bg-white/10"
            >
              {baglanti.ad}
            </Link>
          ))}
          {!kullanici && (
            <div className="mt-2 flex gap-2">
              <Link href="/giris" className="flex-1">
                <Dugme varyant="anahat" className="w-full">Giriş Yap</Dugme>
              </Link>
              <Link href="/kayit" className="flex-1">
                <Dugme varyant="birincil" className="w-full">Kayıt Ol</Dugme>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
