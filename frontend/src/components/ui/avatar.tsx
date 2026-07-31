import { cn } from "@/lib/utils";

export function Avatar({
  ad,
  soyad,
  src,
  className,
}: {
  ad: string;
  soyad: string;
  src?: string | null;
  className?: string;
}) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={`${ad} ${soyad}`} className={cn("h-9 w-9 rounded-full object-cover", className)} />;
  }
  return (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-700",
        className
      )}
      aria-hidden
    >
      {ad.charAt(0)}
      {soyad.charAt(0)}
    </div>
  );
}
