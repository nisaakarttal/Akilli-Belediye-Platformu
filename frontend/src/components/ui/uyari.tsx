"use client";

import { AlertTriangle, CheckCircle2, Info, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type UyariTuru = "hata" | "basari" | "bilgi";

const UYARI_SIMGE_BOYUTU = 18;

const SIMGE_HARITASI: Record<UyariTuru, LucideIcon> = {
  hata: AlertTriangle,
  basari: CheckCircle2,
  bilgi: Info,
};

const RENK_HARITASI: Record<UyariTuru, string> = {
  hata: "border-tehlike/30 bg-tehlike/10 text-red-700 dark:text-red-300",
  basari: "border-basarili/30 bg-basarili/10 text-green-700 dark:text-green-300",
  bilgi: "border-birincil-500/30 bg-birincil-500/10 text-birincil-700 dark:text-birincil-300",
};

interface UyariProps {
  tur?: UyariTuru;
  children: ReactNode;
  className?: string;
}

export function Uyari({
  tur = "bilgi",
  children,
  className,
}: UyariProps) {
  const Simge = SIMGE_HARITASI[tur];

  return (
    <motion.div
      role={tur === "hata" ? "alert" : "status"}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
        RENK_HARITASI[tur],
        className
      )}
    >
      <Simge
        size={UYARI_SIMGE_BOYUTU}
        className="mt-0.5 shrink-0"
      />
      <div>{children}</div>
    </motion.div>
  );
}