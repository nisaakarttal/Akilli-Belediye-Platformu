import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const VARSAYILAN_BOYUT = 20;
const TAM_SAYFA_BOYUTU = 28;

interface YukleniyorProps {
  className?: string;
  boyut?: number;
}

export function Yukleniyor({ className, boyut = VARSAYILAN_BOYUT }: YukleniyorProps) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-metin-ikincil" role="status">
      <Loader2 className={cn("animate-spin text-birincil-500", className)} size={boyut} aria-hidden="true" />
      <span>Yükleniyor...</span>
    </span>
  );
}

export function TamSayfaYukleniyor() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <Yukleniyor boyut={TAM_SAYFA_BOYUTU} />
    </div>
  );
}
