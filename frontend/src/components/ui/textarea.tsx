import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface MetinAlaniProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Doğrulama hatası olduğunda kırmızı kenarlık/halka gösterir ve `aria-invalid` ekler. */
  hataliMi?: boolean;
}

const MetinAlani = forwardRef<HTMLTextAreaElement, MetinAlaniProps>(
  ({ className, hataliMi = false, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        aria-invalid={hataliMi || ariaInvalid}
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border bg-white/70 px-4 py-3 text-sm text-metin placeholder:text-metin-ikincil transition-colors dark:bg-white/5",
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
MetinAlani.displayName = "MetinAlani";

export { MetinAlani };
