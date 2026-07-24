import { forwardRef, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type MetinAlaniProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const MetinAlani = forwardRef<HTMLTextAreaElement, MetinAlaniProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-kenarlik bg-white/70 dark:bg-white/5 px-4 py-3 text-sm text-metin placeholder:text-metin-ikincil transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-birincil-500 focus-visible:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
MetinAlani.displayName = "MetinAlani";

export { MetinAlani };
