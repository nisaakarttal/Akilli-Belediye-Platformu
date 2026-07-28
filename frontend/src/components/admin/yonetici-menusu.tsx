"use client";

import { FileText, LayoutDashboard, MapPin, Tags, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface MenuOgesi {
  ad: string;
  yol: string;
  ikon: LucideIcon;
}

const MENU_OGELERI: MenuOgesi[] = [
  { ad: "Genel Bakış", yol: "/admin", ikon: LayoutDashboard },
  { ad: "Talepler", yol: "/admin/talepler", ikon: FileText },
  { ad: "Kullanıcılar", yol: "/admin/kullanicilar", ikon: Users },
  { ad: "Kategoriler", yol: "/admin/kategoriler", ikon: Tags },
  { ad: "İlçe / Mahalle", yol: "/admin/konum", ikon: MapPin },
];

const MENU_IKON_BOYUTU = 16;

export function YoneticiMenusu() {
  const yol = usePathname();

  return (
    <nav
      aria-label="Yönetici bölümleri"
      className="flex gap-1 overflow-x-auto border-b border-kenarlik px-4 sm:px-6"
    >
      {MENU_OGELERI.map((oge) => {
        const aktifMi = yol === oge.yol;
        return (
          <Link
            key={oge.yol}
            href={oge.yol}
            aria-current={aktifMi ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
              aktifMi
                ? "border-birincil-600 text-birincil-600"
                : "border-transparent text-metin-ikincil hover:text-metin"
            )}
          >
            <oge.ikon size={MENU_IKON_BOYUTU} aria-hidden="true" />
            {oge.ad}
          </Link>
        );
      })}
    </nav>
  );
}
