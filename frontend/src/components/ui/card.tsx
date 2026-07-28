import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const Kart = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "cam-kart rounded-2xl shadow-cam transition-shadow duration-200 dark:shadow-cam-koyu",
        className
      )}
      {...props}
    />
  )
);
Kart.displayName = "Kart";

const KartBasligi = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />
  )
);
KartBasligi.displayName = "KartBasligi";

const KartBaslik = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold leading-none tracking-tight text-metin", className)}
      {...props}
    />
  )
);
KartBaslik.displayName = "KartBaslik";

const KartAciklama = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-metin-ikincil", className)} {...props} />
  )
);
KartAciklama.displayName = "KartAciklama";

const KartIcerik = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
);
KartIcerik.displayName = "KartIcerik";

const KartAlti = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
KartAlti.displayName = "KartAlti";

export { Kart, KartBasligi, KartBaslik, KartAciklama, KartIcerik, KartAlti };
