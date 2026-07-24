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

export function Basli() {
  const { kullanici, cikisYap, yukleniyor } = useKimlik();
  const [menuAcikMi, setMenuAcikMi] = useState(false);

  // 🔔 SADECE okunmamış bildirimleri çekiyoruz (Her 5 saniyede bir kontrol eder)
  const { data: okunmamisData } = useQuery({
    queryKey: ["okunmamis-bildirimler"],
    queryFn: () => bildirimlerApi.listele(true),
    enabled: !!kullanici,
    refetchInterval: 5000, // 5 saniyede bir otomatik sorgula
  });

  // 🔍 Esnek Kontrol Mantığı: Dizi mi yoksa obje içinde veriler mi dönüyor?
  const bildirimListesi = Array.isArray(okunmamisData)
    ? okunmamisData
    : (okunmamisData as any)?.veriler || (okunmamisData as any)?.items || [];

  // 🔍 Okunmamış bildirim var mı? (Tüm olası alan isimlerini dener)
  const okunmamisVarMi = bildirimListesi.some((b: any) => {
    // Eğer backend doğrudan sadece okunmamışları döndürüyorsa ve liste boş değilse true'dur.
    if (b.okundu === undefined && b.okundu_mu === undefined && b.is_read === undefined) {
      return true;
    }
    // Alan isimlerinden hangisi varsa ona göre kontrol et:
    return b.okundu === false || b.okundu_mu === false || b.is_read === false;
  });

  // Dinamik gezinme bağlantıları
  const gezinmeBaglantilari = [{ ad: "Ana Sayfa", yol: "/" }];

  if (kullanici) {
    if (kullanici.rol === "vatandas") {
      gezinmeBaglantilari.push(
        { ad: "Şikâyet Oluştur", yol: "/sikayet-olustur" },
        { ad: "Taleplerim", yol: "/taleplerim" }
      );
    } else if (kullanici.rol === "personel") {
      gezinmeBaglantilari.push({ ad: "Atanan Taleplerim", yol: "/personel" });
    } else if (kullanici.rol === "admin") {
      gezinmeBaglantilari.push({ ad: "Talepler", yol: "/admin/talepler" });
    }
  }

  gezinmeBaglantilari.push(
    { ad: "Harita", yol: "/harita" },
    { ad: "Duyurular", yol: "/duyurular" }
  );

  return (
    <header className="sticky top-0 z-50 cam-kart border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-birincil-600">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-birincil-500 to-ikincil-500 text-white">
            K
          </span>
          <span className="hidden sm:inline">Kapaklı Belediyesi</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
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
                    <ClipboardList size={18} />
                  </Dugme>
                </Link>
              )}
              {kullanici.rol === "admin" && (
                <Link href="/admin">
                  <Dugme varyant="hayalet" boyut="simge" aria-label="Yönetici Paneli">
                    <LayoutDashboard size={18} />
                  </Dugme>
                </Link>
              )}

              {/* 🔔 BİLDİRİM İKONU VE YANIP SÖNEN KIRMIZI NOKTA */}
              <Link href="/bildirimler" className="relative inline-flex items-center justify-center">
                <Dugme varyant="hayalet" boyut="simge" aria-label="Bildirimler">
                  <Bell size={18} />
                </Dugme>
                {okunmamisVarMi && (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 pointer-events-none">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
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
                <LogOut size={18} />
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
          >
            {menuAcikMi ? <X size={20} /> : <Menu size={20} />}
          </Dugme>
        </div>
      </div>

      <div className={cn("lg:hidden overflow-hidden transition-all", menuAcikMi ? "max-h-96" : "max-h-0")}>
        <nav className="flex flex-col gap-1 px-4 pb-4">
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