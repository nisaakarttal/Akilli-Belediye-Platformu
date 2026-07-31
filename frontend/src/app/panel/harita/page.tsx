"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { taleplerHaritaVerisi } from "@/lib/api/talepler";
import { DURUM_ETIKETLERI, DURUM_RENKLERI } from "@/constants/durum";
import { cn } from "@/lib/utils";

const Harita = dynamic(() => import("@/components/features/talepler/harita"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Harita yükleniyor…</div>,
});

export default function HaritaSayfasi() {
  const router = useRouter();
  const { data: noktalar, isLoading } = useQuery({
    queryKey: ["talepler", "harita"],
    queryFn: taleplerHaritaVerisi,
  });

  return (
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Harita</h1>
      <p className="mt-1 text-sm text-muted-foreground">Şehir genelindeki açık talepler.</p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="h-[520px] overflow-hidden p-0">
          {isLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Yükleniyor…</div>
          ) : (
            <Harita
              mod="goruntule"
              noktalar={noktalar ?? []}
              onNoktaTikla={(nokta) => router.push(`/panel/taleplerim/${nokta.id}`)}
            />
          )}
        </Card>

        <Card className="h-[520px] overflow-y-auto p-4">
          <h2 className="font-display text-sm font-semibold text-foreground">Talepler ({noktalar?.length ?? 0})</h2>
          <ul className="mt-3 space-y-2">
            {noktalar?.map((nokta) => {
              const renk = DURUM_RENKLERI[nokta.durum];
              return (
                <li key={nokta.id}>
                  <button
                    onClick={() => router.push(`/panel/taleplerim/${nokta.id}`)}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-muted"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">{nokta.baslik}</span>
                      <span className="block text-xs text-muted-foreground">#{nokta.takip_no} · {nokta.kategori_adi}</span>
                    </span>
                    <Badge className={cn(renk.bg, renk.text)} dot>{DURUM_ETIKETLERI[nokta.durum]}</Badge>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
