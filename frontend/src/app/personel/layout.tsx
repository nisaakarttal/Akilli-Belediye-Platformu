"use client";

import type { ReactNode } from "react";

import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";
import { KorumaliRota } from "@/components/layout/korumali-rota";

export default function PersonelDuzeni({ children }: { children: ReactNode }) {
  return (
    <KorumaliRota izinliRoller={["personel", "admin"]}>
      <Basli />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      <Altbilgi />
    </KorumaliRota>
  );
}
