"use client";

import dynamic from "next/dynamic";

export const YuzenAsistanWrapper = dynamic(
  () =>
    import("@/components/features/ai/yuzen-asistan").then(
      (m) => m.YuzenAsistan
    ),
  {
    ssr: false,
  }
);