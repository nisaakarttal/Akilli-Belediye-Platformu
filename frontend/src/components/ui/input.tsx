import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface GirdiProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Doğrulama hatası olduğunda kırmızı kenarlık/halka gösterir ve `aria-invalid` ekler. */
  hataliMi?: boolean;
}

const Girdi = forwardRef<HTMLInputElement, GirdiProps>(
  ({ className, type, hataliMi = false, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={hataliMi || ariaInvalid}
        className={cn(
          "flex h-11 w-full rounded-xl border bg-white/70 px-4 py-2 text-sm text-metin placeholder:text-metin-ikincil transition-colors dark:bg-white/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hataliMi
            ? "border-tehlike focus-visible:ring-tehlike"
            : "border-kenarlik focus-visible:ring-birincil-500",
          className
        )}
        {...props}
      />
    );
  }
);
Girdi.displayName = "Girdi";

export { Girdi };
