"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Bell,
  User,
  MapPin,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  Landmark,
  Home,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { KullaniciRolu } from "@/types";

interface NavOgesi {
  href: string;
  etiket: string;
  ikon: React.ComponentType<{ className?: string }>;
}

const VATANDAS_MENU: NavOgesi[] = [
  { href: "/panel", etiket: "Ana Sayfa", ikon: LayoutDashboard },
  { href: "/panel/taleplerim", etiket: "Taleplerim", ikon: FileText },
  { href: "/panel/talep-olustur", etiket: "Yeni Talep Oluştur", ikon: PlusCircle },
  { href: "/panel/harita", etiket: "Harita", ikon: MapPin },
  { href: "/panel/bildirimler", etiket: "Bildirimler", ikon: Bell },
  { href: "/panel/profil", etiket: "Profilim", ikon: User },
];

const PERSONEL_MENU: NavOgesi[] = [
  { href: "/personel", etiket: "Personel Dashboard", ikon: LayoutDashboard },
];

const ADMIN_MENU: NavOgesi[] = [
  { href: "/admin", etiket: "Dashboard", ikon: LayoutDashboard },
  { href: "/admin/talepler", etiket: "Talep Yönetimi", ikon: FileText },
  { href: "/admin/kullanicilar", etiket: "Kullanıcı Yönetimi", ikon: Users },
  { href: "/admin/raporlar", etiket: "Raporlar", ikon: BarChart3 },
  { href: "/admin/istatistikler", etiket: "İstatistikler", ikon: BarChart3 },
  { href: "/admin/ai-analiz", etiket: "AI Analiz", ikon: Sparkles },
  { href: "/admin/ayarlar", etiket: "Ayarlar", ikon: Settings },
];

const MENULER: Record<KullaniciRolu, NavOgesi[]> = {
  vatandas: VATANDAS_MENU,
  personel: PERSONEL_MENU,
  admin: ADMIN_MENU,
};

export function DashboardSidebar({ rol }: { rol: KullaniciRolu }) {
  const pathname = usePathname();
  const menu = MENULER[rol];

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <Link href="/" className="flex h-16 items-center gap-2.5 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
          <Landmark className="h-5 w-5" aria-hidden />
        </span>

        <span className="font-display leading-tight">
          <span className="block text-xs font-bold tracking-tight text-white">
            AKILLI BELEDİYE
          </span>

          <span className="block text-[9px] font-medium uppercase tracking-widest text-sidebar-foreground/60">
            Platformu
          </span>
        </span>
      </Link>

      <nav
        className="flex-1 space-y-1 px-3 py-4"
        aria-label="Panel menüsü"
      >
        {menu.map((oge) => {
          const aktif =
            pathname === oge.href ||
            (oge.href !== "/personel" &&
              pathname.startsWith(`${oge.href}/`));

          return (
            <Link
              key={`${rol}-${oge.href}-${oge.etiket}`}
              href={oge.href}
              aria-current={aktif ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                aktif
                  ? "bg-sidebar-active text-white shadow-sm"
                  : "text-sidebar-foreground/75 hover:bg-white/5 hover:text-white"
              )}
            >
              <oge.ikon className="h-4.5 w-4.5 shrink-0" />
              {oge.etiket}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Home className="h-4.5 w-4.5 shrink-0" />
          Ana Sayfaya Dön
        </Link>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-3.5 text-xs text-sidebar-foreground/70">
          <p className="font-medium text-sidebar-foreground/90">
            İhtiyacınız mı var?
          </p>

          <p className="mt-1">
            7/24 destek hattı: 0850 123 45 67
          </p>
        </div>
      </div>
    </aside>
  );
}