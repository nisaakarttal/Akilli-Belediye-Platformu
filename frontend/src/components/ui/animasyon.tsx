"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Sayfa genelinde tekrar eden "kaydırınca beliren kart/liste" animasyon
 * desenini tek bir yerde tanımlar (DRY). Sunucu bileşenleri bu istemci
 * bileşenlerini `children` olarak sarmalayarak, kendileri "use client"
 * olmadan animasyonlu görünebilir — Next.js App Router'ın sunucu/istemci
 * kompozisyon deseni.
 */

const OGE_VARYANTI: Variants = {
  gizli: { opacity: 0, y: 16 },
  gorunur: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const KAPSAYICI_VARYANTI: Variants = {
  gizli: {},
  gorunur: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const GORUNUM_SECENEKLERI = { once: true, margin: "-80px" } as const;

interface FadeInProps {
  children: ReactNode;
  className?: string;
  gecikme?: number;
}

/** Görünüme girdiğinde tek bir bloğu yumuşakça belirten sarmalayıcı. */
export function FadeIn({ children, className, gecikme = 0 }: FadeInProps) {
  return (
    <motion.div
      initial="gizli"
      whileInView="gorunur"
      viewport={GORUNUM_SECENEKLERI}
      variants={OGE_VARYANTI}
      transition={{ delay: gecikme }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FadeInStaggerProps {
  children: ReactNode;
  className?: string;
}

/** Alt öğeleri (StaggerOgesi) görünüme girdiğinde sırayla belirten grid/liste sarmalayıcısı. */
export function FadeInStagger({ children, className }: FadeInStaggerProps) {
  return (
    <motion.div
      initial="gizli"
      whileInView="gorunur"
      viewport={GORUNUM_SECENEKLERI}
      variants={KAPSAYICI_VARYANTI}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerOgesiProps {
  children: ReactNode;
  className?: string;
}

/** Yalnızca bir `FadeInStagger` içinde kullanılması amaçlanan tekil öğe. */
export function StaggerOgesi({ children, className }: StaggerOgesiProps) {
  return (
    <motion.div variants={OGE_VARYANTI} className={className}>
      {children}
    </motion.div>
  );
}
