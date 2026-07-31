"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";

import { Girdi } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Göz ikonuyla göster/gizle özelliğine sahip şifre girdisi.
 * Önceden `giris` sayfasında bir kez, `kayit` sayfasında iki kez
 * (şifre + şifre tekrar) neredeyse birebir aynı şekilde tekrarlanan
 * deseni tek bileşende topluyor (DRY).
 */
export const SifreGirdisi = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const [goster, setGoster] = useState(false);

    return (
      <div className="relative">
        <Input ref={ref} type={goster ? "text" : "password"} className={cn("pr-10", className)} {...props} />
        <button
          type="button"
          onClick={() => setGoster((oncekiDeger) => !oncekiDeger)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-metin-ikincil transition-colors hover:text-metin"
          aria-label={goster ? "Şifreyi gizle" : "Şifreyi göster"}
        >
          {goster ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    );
  }
);
SifreGirdisi.displayName = "SifreGirdisi";
