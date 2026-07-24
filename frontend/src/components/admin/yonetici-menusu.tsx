"use client";

import { FileText, LayoutDashboard, MapPin, Tags, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const MENU_OGELERI = [
  { ad: "Genel Bakış", yol: "/admin", ikon: LayoutDashboard },
  { ad: "Talepler", yol: "/admin/talepler", ikon: FileText },
  { ad: "Kullanıcılar", yol: "/admin/kullanicilar", ikon: Users },
  { ad: "Kategoriler", yol: "/admin/kategoriler", ikon: Tags },
  { ad: "İlçe / Mahalle", yol: "/admin/konum", ikon: MapPin },
];

export function YoneticiMenusu() {
  const yol = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-kenarlik px-4 sm:px-6">
      {MENU_OGELERI.map((oge) => {
        const aktifMi = yol === oge.yol;
        return (
          <Link
            key={oge.yol}
            href={oge.yol}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
              aktifMi
                ? "border-birincil-600 text-birincil-600"
                : "border-transparent text-metin-ikincil hover:text-metin"
            )}
          >
            <oge.ikon size={16} />
            {oge.ad}
          </Link>
        );
      })}
    </nav>
  );
}