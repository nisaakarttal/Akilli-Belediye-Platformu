import { forwardRef, type LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type EtiketProps = LabelHTMLAttributes<HTMLLabelElement>;

const Etiket = forwardRef<HTMLLabelElement, EtiketProps>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("mb-1.5 block text-sm font-medium text-metin", className)}
    {...props}
  />
));
Etiket.displayName = "Etiket";

export { Etiket };
