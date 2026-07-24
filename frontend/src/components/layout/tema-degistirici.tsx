"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Dugme } from "@/components/ui/button";

export function TemaDegistirici() {
  const { theme, setTheme } = useTheme();
  const [monteEdildi, setMonteEdildi] = useState(false);

  // Hydration uyumsuzluğunu önlemek için istemci tarafında monte edilene kadar bekle
  useEffect(() => setMonteEdildi(true), []);

  if (!monteEdildi) {
    return <div className="h-10 w-10" aria-hidden />;
  }

  const karanlikMi = theme === "dark";

  return (
    <Dugme
      varyant="hayalet"
      boyut="simge"
      onClick={() => setTheme(karanlikMi ? "light" : "dark")}
      aria-label={karanlikMi ? "Aydınlık moda geç" : "Karanlık moda geç"}
    >
      {karanlikMi ? <Sun size={18} /> : <Moon size={18} />}
    </Dugme>
  );
}
