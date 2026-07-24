"use client";

import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type SecimProps = SelectHTMLAttributes<HTMLSelectElement>;

const Secim = forwardRef<HTMLSelectElement, SecimProps>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full appearance-none rounded-xl border border-kenarlik bg-white dark:bg-slate-800 px-4 py-2 pr-10 text-sm text-metin transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-birincil-500 focus-visible:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // 🔴 Option seçeneklerinin arkaplanda görünmez/beyaz kalmasını çözen CSS:
          "[&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-white",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-metin-ikincil" />
    </div>
  );
});
Secim.displayName = "Secim";

export { Secim };