"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Dugme } from "@/components/ui/button";

const TEMA_SIMGE_BOYUTU = 18;

export function TemaDegistirici() {
  const { theme, setTheme } = useTheme();
  const [monteEdildi, setMonteEdildi] = useState(false);

  // Hydration uyumsuzluğunu önlemek için istemci tarafında monte edilene kadar bekle
  useEffect(() => setMonteEdildi(true), []);

  if (!monteEdildi) {
    return <div className="h-10 w-10" aria-hidden="true" />;
  }

  const karanlikMi = theme === "dark";

  return (
    <Dugme
      varyant="hayalet"
      boyut="simge"
      onClick={() => setTheme(karanlikMi ? "light" : "dark")}
      aria-label={karanlikMi ? "Aydınlık moda geç" : "Karanlık moda geç"}
    >
      {karanlikMi ? <Sun size={TEMA_SIMGE_BOYUTU} /> : <Moon size={TEMA_SIMGE_BOYUTU} />}
    </Dugme>
  );
}
