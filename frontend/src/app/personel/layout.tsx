"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { useRoleGuard } from "@/providers/auth-provider";

export default function PersonelDuzeni({ children }: { children: React.ReactNode }) {
  const { kullanici, yukleniyor } = useRoleGuard(["personel"]);

  if (yukleniyor || !kullanici) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700"
          aria-label="Yükleniyor"
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar rol="personel" />
      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar baslik={`Personel Paneli · ${kullanici.ad} ${kullanici.soyad}`} />
        <main className="flex-1 p-5">{children}</main>
      </div>
    </div>
  );
}
