"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { AiSohbetWidget } from "@/components/features/ai/sohbet-widget";
import { useRoleGuard } from "@/providers/auth-provider";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { kullanici, yukleniyor } = useRoleGuard(["admin"]);

  if (yukleniyor || !kullanici) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-200 border-t-primary-700" aria-label="Yükleniyor" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar rol="admin" />
      <div className="flex min-h-screen flex-1 flex-col">
        <DashboardTopbar baslik={`Hoş Geldiniz, ${kullanici.ad} 👋`} />
        <main className="flex-1 p-5">{children}</main>
      </div>
      <AiSohbetWidget />
    </div>
  );
}
