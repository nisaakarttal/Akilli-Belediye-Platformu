"use client";

import dynamic from "next/dynamic";

// { ssr: false } seçeneğini Client Component içinde kullanıyoruz
export const YuzenAsistanWrapper = dynamic(
  () => import("@/components/ai/yuzen-asistan").then((m) => m.YuzenAsistan),
  { ssr: false }
);