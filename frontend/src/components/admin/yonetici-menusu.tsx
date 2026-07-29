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

const MENU_IKON_BOYUTU = 17;

export function YoneticiMenusu() {
  const yol = usePathname();

  return (
    <nav
      aria-label="Yönetici bölümleri"
      className="flex gap-1.5 overflow-x-auto border-b border-kenarlik/60 bg-zemin/60 backdrop-blur-md px-4 sm:px-6 no-scrollbar"
    >
      {MENU_OGELERI.map((oge) => {
        const aktifMi = yol === oge.yol;
        return (
          <Link
            key={oge.yol}
            href={oge.yol}
            aria-current={aktifMi ? "page" : undefined}
            className={cn(
              "relative flex shrink-0 items-center gap-2.5 border-b-2 px-4 py-3.5 text-xs font-bold transition-all duration-200",
              aktifMi
                ? "border-birincil-600 text-birincil-600 dark:border-birincil-400 dark:text-birincil-400 bg-birincil-500/5"
                : "border-transparent text-metin-ikincil hover:text-metin hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
            )}
          >
            <oge.ikon size={MENU_IKON_BOYUTU} aria-hidden="true" />
            <span>{oge.ad}</span>
          </Link>
        );
      })}
    </nav>
  );
}