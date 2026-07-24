"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Activity } from "lucide-react";
import type { ReactNode } from "react";

import { YoneticiMenusu } from "@/components/admin/yonetici-menusu";
import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";

export default function YoneticiDuzeni({ children }: { children: ReactNode }) {
  return (
    <KorumaliRota izinliRoller={["admin"]}>
      {/* Dark mod için bg-slate-950 ve dark:text-slate-100 eklendi */}
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-x-hidden transition-colors duration-200">
        {/* Üst Header */}
        <Basli />

        {/* Hızlı Sistem Bilgi Çubuğu */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950 text-white text-[11px] py-1.5 px-4 shadow-inner border-b border-indigo-800/40 dark:border-slate-800 hidden sm:block">
          <div className="mx-auto max-w-7xl flex items-center justify-between font-medium">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-indigo-300 dark:text-indigo-400 font-bold tracking-wide uppercase text-[10px]">
                <ShieldCheck size={13} className="text-emerald-400" />
                Yönetici Konsolu
              </span>
              <span className="h-3 w-[1px] bg-indigo-700/60 dark:bg-slate-700" />
              <span className="text-indigo-200/80 dark:text-slate-300 flex items-center gap-1">
                <Activity size={12} className="text-emerald-400 animate-pulse" />
                Sistem Durumu: <strong className="text-emerald-400 font-bold">Aktif & Stabil</strong>
              </span>
            </div>

            <div className="flex items-center gap-2 text-indigo-300/80 dark:text-slate-400">
              <Sparkles size={12} className="text-amber-400" />
              <span>Tam Yetkili Yönetici Oturumu</span>
            </div>
          </div>
        </div>

        {/* Yönetici Menü Sub-header */}
        <YoneticiMenusu />

        {/* Ana İçerik Konteyneri */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
        >
          {children}
        </motion.main>

        {/* Altbilgi */}
        <Altbilgi />
      </div>
    </KorumaliRota>
  );
}