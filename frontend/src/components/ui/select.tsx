"use client";

import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const OK_SIMGE_BOYUTU = 16;

export interface SecimProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Doğrulama hatası olduğunda kırmızı kenarlık/halka gösterir ve `aria-invalid` ekler. */
  hataliMi?: boolean;
}

const Secim = forwardRef<HTMLSelectElement, SecimProps>(
  ({ className, children, hataliMi = false, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          aria-invalid={hataliMi || ariaInvalid}
          className={cn(
            "flex h-11 w-full appearance-none rounded-xl border bg-white px-4 py-2 pr-10 text-sm text-metin transition-colors dark:bg-slate-800",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Option seçeneklerinin arkaplanda görünmez/beyaz kalmasını çözen stil:
            "[&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-white",
            hataliMi
              ? "border-tehlike focus-visible:ring-tehlike"
              : "border-kenarlik focus-visible:ring-birincil-500",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={OK_SIMGE_BOYUTU}
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-metin-ikincil"
        />
      </div>
    );
  }
);
Secim.displayName = "Secim";

export { Secim };
