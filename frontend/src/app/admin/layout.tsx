"use client";

import { motion } from "framer-motion";
import {
  Activity,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

import { YoneticiMenusu } from "@/components/admin/yonetici-menusu";
import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";


export default function YoneticiDuzeni({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <KorumaliRota izinliRoller={["admin"]}>

      <div
        className="
        relative flex min-h-screen
        flex-col overflow-x-hidden
        bg-zemin text-metin
        transition-colors duration-300
        "
      >


        {/* Premium arka plan efektleri */}
        <div
          aria-hidden="true"
          className="
          pointer-events-none
          fixed inset-0 -z-10
          overflow-hidden
          "
        >

          <div
            className="
            absolute
            -right-40 -top-40
            h-[500px] w-[500px]
            rounded-full
            bg-birincil-500/10
            blur-[140px]
            "
          />

          <div
            className="
            absolute
            -bottom-40 -left-40
            h-[450px] w-[450px]
            rounded-full
            bg-ikincil-500/10
            blur-[140px]
            "
          />

        </div>





        <Basli />





        {/* SYSTEM STATUS BAR */}

        <section
          role="status"
          aria-label="Sistem durumu"
          className="
          hidden sm:block
          border-b
          border-white/10
          bg-gradient-to-r
          from-slate-950
          via-indigo-950
          to-slate-900
          px-6 py-2
          text-white
          shadow-lg
          "
        >

          <div
            className="
            mx-auto
            flex max-w-7xl
            items-center
            justify-between
            "
          >


            <div
              className="
              flex items-center
              gap-4
              "
            >


              <div
                className="
                flex items-center gap-2
                rounded-full
                border
                border-indigo-400/20
                bg-indigo-500/10
                px-3 py-1
                "
              >

                <ShieldCheck
                  size={14}
                  className="text-basarili"
                />

                <span
                  className="
                  text-[11px]
                  font-black
                  uppercase
                  tracking-wider
                  text-indigo-200
                  "
                >
                  Yönetici Merkezi
                </span>

              </div>



              <div
                className="
                hidden items-center gap-2
                text-xs text-indigo-200/80
                md:flex
                "
              >

                <Activity
                  size={14}
                  className="
                  animate-pulse
                  text-basarili
                  "
                />

                <span>
                  Sistem
                  <strong
                    className="
                    ml-1
                    text-basarili
                    "
                  >
                    Aktif
                  </strong>
                </span>

              </div>


            </div>





            <div
              className="
              flex items-center gap-3
              "
            >

              <div
                className="
                flex items-center gap-2
                rounded-full
                bg-white/5
                px-3 py-1
                text-xs
                text-indigo-200
                "
              >

                <LockKeyhole size={13}/>

                Güvenli Oturum

              </div>



              <Sparkles
                size={15}
                className="text-uyari"
              />

            </div>


          </div>


        </section>







        <YoneticiMenusu />







        {/* CONTENT */}

        <motion.main
          initial={{
            opacity:0,
            y:18,
            filter:"blur(4px)"
          }}
          animate={{
            opacity:1,
            y:0,
            filter:"blur(0)"
          }}
          transition={{
            duration:.35,
            ease:"easeOut"
          }}
          className="
          mx-auto
          flex-1
          w-full
          max-w-7xl
          px-4
          py-8
          sm:px-6
          lg:px-8
          "
        >

          <div
            className="
            rounded-3xl
            "
          >

            {children}

          </div>


        </motion.main>







        <Altbilgi />



      </div>


    </KorumaliRota>
  );
}