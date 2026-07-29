"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const GENISLIK_SINIFLARI = { orta: "max-w-md", genis: "max-w-lg" } as const;

interface KimlikKartiProps {
  ikon?: LucideIcon;
  baslik: string;
  aciklama?: string;
  genislik?: keyof typeof GENISLIK_SINIFLARI;
  children: ReactNode;
  altBilgi?: ReactNode;
}

/**
 * `giris`, `kayit`, `sifremi-unuttum` ve `sifre-sifirla` sayfalarının ortak
 * kart/layout iskeleti. Önceden her sayfada ayrı ayrı tanımlanan (ve iki
 * sayfada tailwind.config.ts'te karşılığı olmayan class'larla bozulmuş)
 * ortalanmış kart + giriş animasyonu deseni tek bileşende toplanmıştır.
 */
export function KimlikKarti({ ikon: Ikon, baslik, aciklama, genislik = "orta", children, altBilgi }: KimlikKartiProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn("w-full", GENISLIK_SINIFLARI[genislik])}
      >
        <Kart>
          <KartBasligi className="text-center">
            {Ikon && (
              <span className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-birincil-600/10 text-birincil-600">
                <Ikon className="h-7 w-7" aria-hidden="true" />
              </span>
            )}
            <KartBaslik>{baslik}</KartBaslik>
            {aciklama && <p className="mx-auto max-w-sm text-sm text-metin-ikincil">{aciklama}</p>}
          </KartBasligi>

          <KartIcerik>
            {children}
            {altBilgi && (
              <div className="mt-6 border-t border-kenarlik pt-6 text-center text-sm text-metin-ikincil">
                {altBilgi}
              </div>
            )}
          </KartIcerik>
        </Kart>
      </motion.div>
    </div>
  );
}
