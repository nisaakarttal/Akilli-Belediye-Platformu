"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { tema, temayiDegistir } = useTheme();

  return (
    <button
      onClick={temayiDegistir}
      aria-label={tema === "dark" ? "Aydınlık moda geç" : "Karanlık moda geç"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
    >
      {tema === "dark" ? <Sun className="h-4.5 w-4.5" aria-hidden /> : <Moon className="h-4.5 w-4.5" aria-hidden />}
    </button>
  );
}
