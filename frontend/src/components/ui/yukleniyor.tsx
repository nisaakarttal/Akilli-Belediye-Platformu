import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Yukleniyor({ className, boyut = 20 }: { className?: string; boyut?: number }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-metin-ikincil" role="status">
      <Loader2 className={cn("animate-spin text-birincil-500", className)} size={boyut} />
      <span>Yükleniyor...</span>
    </span>
  );
}

export function TamSayfaYukleniyor() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <Yukleniyor boyut={28} />
    </div>
  );
}
