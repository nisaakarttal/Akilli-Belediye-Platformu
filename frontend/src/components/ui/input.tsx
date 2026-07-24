import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type GirdiProps = InputHTMLAttributes<HTMLInputElement>;

const Girdi = forwardRef<HTMLInputElement, GirdiProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-kenarlik bg-white/70 dark:bg-white/5 px-4 py-2 text-sm text-metin placeholder:text-metin-ikincil transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-birincil-500 focus-visible:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Girdi.displayName = "Girdi";

export { Girdi };
