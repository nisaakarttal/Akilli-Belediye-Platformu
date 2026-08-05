"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { YuzenAsistanWrapper } from "@/components/features/ai/yuzen-asistan-wrapper";
import { useRoleGuard } from "@/providers/auth-provider";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { kullanici, yukleniyor } = useRoleGuard(["vatandas"]);

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
      <DashboardSidebar rol={kullanici.rol} />

      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar baslik={`Merhaba, ${kullanici.ad} 👋`} />
        <main className="flex-1 p-5">{children}</main>
      </div>

      <YuzenAsistanWrapper />
    </div>
  );
}