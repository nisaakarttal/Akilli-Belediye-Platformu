"use client";

import type { ReactNode } from "react";

import { YoneticiMenusu } from "@/components/admin/yonetici-menusu";
import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";

export default function YoneticiDuzeni({ children }: { children: ReactNode }) {
  return (
    <KorumaliRota izinliRoller={["admin"]}>
      <Basli />
      <YoneticiMenusu />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      <Altbilgi />
    </KorumaliRota>
  );
}
