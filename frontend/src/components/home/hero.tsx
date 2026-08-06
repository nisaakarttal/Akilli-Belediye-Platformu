"use client";

import { motion, type Variants } from "framer-motion";
import { MapPin, MessageSquarePlus, Search } from "lucide-react";
import Link from "next/link";

import { PikselSehir } from "@/components/home/piksel/piksel-sehir";
import { Button } from "@/components/ui/button";

const KART_VARYANTI: Variants = {
  gizli: { opacity: 0, y: 20 },
  gorunur: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Button_GRUBU_VARYANTI: Variants = {
  gizli: {},
  gorunur: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
};

const Button_VARYANTI: Variants = {
  gizli: { opacity: 0, y: 12 },
  gorunur: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-label="Kapaklı Belediyesi tanıtım alanı">
      <div className="relative h-[420px] sm:h-[480px]">
        <PikselSehir />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center">
          <motion.div
            initial="gizli"
            animate="gorunur"
            variants={KART_VARYANTI}
            className="cam-kart rounded-3xl px-6 py-8 sm:px-12 sm:py-10"
          >
            <span className="mb-3 inline-block rounded-full bg-birincil-600/10 px-3 py-1 text-xs font-medium text-birincil-700 dark:text-birincil-300">
              Kapaklı Belediyesi Dijital Hizmetleri
            </span>
            <h1 className="text-3xl font-bold text-metin sm:text-5xl">
              Kapaklı Akıllı Belediye Platformu
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-metin-ikincil sm:text-base">
              Şikâyet ve taleplerinizi saniyeler içinde oluşturun, yapay zekâ asistanımızla
              sohbet edin, belediye hizmetlerine tek noktadan ulaşın.
            </p>

            <motion.div
              initial="gizli"
              animate="gorunur"
              variants={Button_GRUBU_VARYANTI}
              className="mt-6 flex flex-wrap items-center justify-center gap-3"
            >
              <motion.div variants={Button_VARYANTI}>
                <Link href="/panel/talep-olustur">
                  <Button varyant="birincil" boyut="buyuk" className="gap-2">
                    <MessageSquarePlus size={20} aria-hidden="true" />
                    Hızlı Şikâyet Oluştur
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={Button_VARYANTI}>
                <Link href="/panel/taleplerim">
                  <Button varyant="cam" boyut="buyuk" className="gap-2">
                    <Search size={20} aria-hidden="true" />
                    Talep Takip Et
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={Button_VARYANTI}>
                <Link href="/panel/harita">
                  <Button varyant="hayalet" boyut="buyuk" className="gap-2">
                    <MapPin size={20} aria-hidden="true" />
                    Haritada Gör
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
