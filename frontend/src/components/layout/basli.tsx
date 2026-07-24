"use client";

import { Bell, ClipboardList, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { TemaDegistirici } from "@/components/layout/tema-degistirici";
import { Dugme } from "@/components/ui/button";
import { useKimlik } from "@/hooks/use-kimlik";
import { cn } from "@/lib/utils";

export function Basli() {
  const { kullanici, cikisYap, yukleniyor } = useKimlik();
  const [menuAcikMi, setMenuAcikMi] = useState(false);

  // Dinamik gezinme bağlantıları: Ortak linkler ile başla
  const gezinmeBaglantilari = [
    { ad: "Ana Sayfa", yol: "/" },
  ];

  // Kullanıcının rolüne göre ilgili linkleri ekle
  if (kullanici) {
    if (kullanici.rol === "vatandas") {
      gezinmeBaglantilari.push(
        { ad: "Şikâyet Oluştur", yol: "/sikayet-olustur" },
        { ad: "Taleplerim", yol: "/taleplerim" }
      );
    } else if (kullanici.rol === "personel") {
      gezinmeBaglantilari.push(
        { ad: "Atanan Taleplerim", yol: "/personel" }
      );
    } else if (kullanici.rol === "admin") {
      gezinmeBaglantilari.push(
        { ad: "Talepler", yol: "/admin/talepler" }
      );
    }
  }

  // Ortak linkleri sona ekle
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
              {/* Pano ikonu SADECE personel rolüne özel yapıldı */}
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
              <Link href="/bildirimler">
                <Dugme varyant="hayalet" boyut="simge" aria-label="Bildirimler">
                  <Bell size={18} />
                </Dugme>
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