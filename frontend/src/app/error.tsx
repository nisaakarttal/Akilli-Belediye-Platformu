"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HataSayfasi({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-bg text-danger">
        <AlertTriangle className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="font-display text-2xl font-bold text-foreground">Bir şeyler ters gitti</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Beklenmedik bir hata oluştu. Tekrar denemek ister misiniz?
      </p>
      <Button onClick={reset}>Tekrar Dene</Button>
    </div>
  );
}
