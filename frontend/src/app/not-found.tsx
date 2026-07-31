import Link from "next/link";
import { MapPinOff } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BulunamadiSayfasi() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <MapPinOff className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="font-display text-2xl font-bold text-foreground">Sayfa bulunamadı</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Aradığınız sayfa taşınmış veya hiç var olmamış olabilir.
      </p>
      <Link href="/" className={cn(buttonVariants())}>Ana Sayfaya Dön</Link>
    </div>
  );
}
