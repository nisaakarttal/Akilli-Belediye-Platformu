"use client";

import { motion } from "framer-motion";
import { MapPin, MessageSquarePlus, Search } from "lucide-react";
import Link from "next/link";

import { PikselSehir } from "@/components/home/piksel/piksel-sehir";
import { Dugme } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[420px] sm:h-[480px]">
        <PikselSehir />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
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

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link href="/sikayet-olustur">
                <Dugme varyant="birincil" boyut="buyuk" className="gap-2">
                  <MessageSquarePlus size={20} />
                  Hızlı Şikâyet Oluştur
                </Dugme>
              </Link>
              <Link href="/taleplerim">
                <Dugme varyant="cam" boyut="buyuk" className="gap-2">
                  <Search size={20} />
                  Talep Takip Et
                </Dugme>
              </Link>
              <Link href="/harita">
                <Dugme varyant="hayalet" boyut="buyuk" className="gap-2">
                  <MapPin size={20} />
                  Haritada Gör
                </Dugme>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
