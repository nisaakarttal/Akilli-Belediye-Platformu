import type { ReactNode } from "react";

import { Etiket } from "@/components/ui/label";

interface FormAlaniProps {
  /** `Etiket`in `htmlFor`ı ve alt bileşenin `id`siyle eşleşmesi beklenir. */
  id?: string;
  etiket?: string;
  hata?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Formlarda tekrar eden "Etiket + girdi + hata mesajı" desenini tek yerde
 * toplayan sarmalayıcı (DRY). Hata mesajına `role="alert"` eklenerek ekran
 * okuyucuların doğrulama hatalarını anında duyurması sağlanır.
 */
export function FormAlani({ id, etiket, hata, children, className }: FormAlaniProps) {
  return (
    <div className={className}>
      {etiket && <Etiket htmlFor={id}>{etiket}</Etiket>}
      {children}
      {hata && (
        <p className="mt-1 text-xs text-tehlike" role="alert">
          {hata}
        </p>
      )}
    </div>
  );
}
