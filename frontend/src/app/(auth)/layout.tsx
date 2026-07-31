import Link from "next/link";
import { Landmark } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary-50/50 to-background">
      <div className="container flex flex-1 flex-col items-center justify-center py-12">
        <Link href="/" className="mb-8 flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Landmark className="h-5 w-5" aria-hidden />
          </span>
          <span className="font-display leading-tight">
            <span className="block text-sm font-bold tracking-tight text-foreground">AKILLI BELEDİYE</span>
            <span className="block text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Platformu
            </span>
          </span>
        </Link>
        <div className="w-full max-w-md animate-fade-up">{children}</div>
      </div>
    </div>
  );
}
