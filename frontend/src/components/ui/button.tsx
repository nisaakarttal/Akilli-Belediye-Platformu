import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const dugmeVaryantlari = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-birincil-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      varyant: {
        birincil: "bg-birincil-600 text-white shadow-lg shadow-birincil-600/25 hover:bg-birincil-700",
        ikincil: "bg-ikincil-500 text-white shadow-lg shadow-ikincil-500/25 hover:bg-sky-600",
        hayalet: "bg-transparent text-metin hover:bg-black/5 dark:hover:bg-white/10",
        anahat: "border border-kenarlik bg-transparent hover:bg-black/5 dark:hover:bg-white/10",
        tehlike: "bg-tehlike text-white shadow-lg shadow-tehlike/25 hover:bg-red-600",
        cam: "cam-kart text-metin hover:bg-white/80 dark:hover:bg-white/10",
      },
      boyut: {
        kucuk: "h-9 px-3 text-xs",
        orta: "h-11 px-5",
        buyuk: "h-14 px-8 text-base",
        simge: "h-10 w-10",
      },
    },
    defaultVariants: {
      varyant: "birincil",
      boyut: "orta",
    },
  }
);

export interface DugmeProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dugmeVaryantlari> {
  asChild?: boolean;
}

const Dugme = forwardRef<HTMLButtonElement, DugmeProps>(
  ({ className, varyant, boyut, asChild = false, ...props }, ref) => {
    const Bilesen = asChild ? Slot : "button";
    return (
      <Bilesen className={cn(dugmeVaryantlari({ varyant, boyut, className }))} ref={ref} {...props} />
    );
  }
);
Dugme.displayName = "Dugme";

export { Dugme, dugmeVaryantlari };
