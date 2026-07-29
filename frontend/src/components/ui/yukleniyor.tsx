import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const VARSAYILAN_BOYUT = 20;
const TAM_SAYFA_BOYUTU = 32;

interface YukleniyorProps {
  className?: string;
  boyut?: number;
  metin?: string;
}

export function Yukleniyor({ className, boyut = VARSAYILAN_BOYUT, metin = "Yükleniyor..." }: YukleniyorProps) {
  return (
    <span className="inline-flex items-center gap-2.5 text-xs font-bold text-metin-ikincil" role="status">
      <Loader2 className={cn("animate-spin text-birincil-600 dark:text-birincil-400", className)} size={boyut} aria-hidden="true" />
      <span>{metin}</span>
    </span>
  );
}

export function TamSayfaYukleniyor() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-kenarlik/60 bg-zemin/60 backdrop-blur-xl px-8 py-6 shadow-xl shadow-black/[0.02]">
        <Yukleniyor boyut={TAM_SAYFA_BOYUTU} metin="Bilgiler yükleniyor, lütfen bekleyin..." />
      </div>
    </div>
  );
}