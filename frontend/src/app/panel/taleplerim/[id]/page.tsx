"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { ArrowLeft, Star, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { talepDetayGetir, memnuniyetBildir, memnuniyetGetir } from "@/lib/api/talepler";
import { DURUM_ETIKETLERI, DURUM_RENKLERI, ONCELIK_ETIKETLERI, ONCELIK_RENKLERI } from "@/constants/durum";
import { tarihSaatFormatla, cn } from "@/lib/utils";
import { apiHataMesaji } from "@/lib/api/client";

const Harita = dynamic(() => import("@/components/features/talepler/harita"), { ssr: false });

export default function TalepDetaySayfasi() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: talep, isLoading } = useQuery({
    queryKey: ["talep", id],
    queryFn: () => talepDetayGetir(id),
  });

  const cozulduMu = talep?.durum === "cozuldu" || talep?.durum === "kapatildi";

  const { data: memnuniyet } = useQuery({
    queryKey: ["memnuniyet", id],
    queryFn: () => memnuniyetGetir(id),
    enabled: !!cozulduMu,
    retry: false,
  });

  if (isLoading || !talep) {
    return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;
  }

  const durumRenk = DURUM_RENKLERI[talep.durum];
  const oncelikRenk = ONCELIK_RENKLERI[talep.oncelik];

  return (
    <div className="mx-auto max-w-4xl">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Geri
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{talep.baslik}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            #{talep.takip_no} · {talep.kategori.ad} · {talep.mahalle.ad}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge className={cn(oncelikRenk.bg, oncelikRenk.text)}>{ONCELIK_ETIKETLERI[talep.oncelik]}</Badge>
          <Badge className={cn(durumRenk.bg, durumRenk.text)} dot>{DURUM_ETIKETLERI[talep.durum]}</Badge>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Açıklama</CardTitle></CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{talep.aciklama}</p>
              {talep.adres_detay && (
                <p className="mt-3 text-xs text-muted-foreground">Adres detayı: {talep.adres_detay}</p>
              )}
            </CardContent>
          </Card>

          {talep.dosyalar.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Dosyalar</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {talep.dosyalar.map((dosya) => (
                    <a
                      key={dosya.id}
                      href={dosya.dosya_yolu}
                      target="_blank"
                      rel="noreferrer"
                      className="aspect-square overflow-hidden rounded-xl border border-border bg-muted"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={dosya.dosya_yolu} alt={dosya.orijinal_ad} className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Konum</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64 overflow-hidden rounded-xl border border-border">
                <Harita
                  mod="goruntule"
                  noktalar={[{
                    id: talep.id,
                    takip_no: talep.takip_no,
                    baslik: talep.baslik,
                    enlem: talep.enlem,
                    boylam: talep.boylam,
                    durum: talep.durum,
                    oncelik: talep.oncelik,
                    kategori_adi: talep.kategori.ad,
                  }]}
                />
              </div>
            </CardContent>
          </Card>

          {cozulduMu && <MemnuniyetKarti talepId={talep.id} mevcutDegerlendirme={memnuniyet ?? null} />}
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle>Talep Geçmişi</CardTitle></CardHeader>
          <CardContent>
            <ol className="space-y-5 border-l-2 border-border pl-4">
              {talep.durum_gecmisi.map((adim, i) => (
                <li key={adim.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-[22px] flex h-4 w-4 items-center justify-center rounded-full bg-surface",
                      i === 0 ? "text-primary-700" : "text-muted-foreground"
                    )}
                  >
                    {i === 0 ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3 fill-current" />}
                  </span>
                  <p className="text-sm font-medium text-foreground">{DURUM_ETIKETLERI[adim.yeni_durum]}</p>
                  {adim.aciklama && <p className="mt-0.5 text-xs text-muted-foreground">{adim.aciklama}</p>}
                  <p className="mt-0.5 text-xs text-muted-foreground">{tarihSaatFormatla(adim.olusturulma_tarihi)}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MemnuniyetKarti({
  talepId,
  mevcutDegerlendirme,
}: {
  talepId: string;
  mevcutDegerlendirme: { puan: number; yorum: string | null } | null;
}) {
  const queryClient = useQueryClient();
  const [puan, setPuan] = useState(mevcutDegerlendirme?.puan ?? 0);
  const [yorum, setYorum] = useState(mevcutDegerlendirme?.yorum ?? "");

  const gonder = useMutation({
    mutationFn: () => memnuniyetBildir(talepId, puan, yorum || undefined),
    onSuccess: () => {
      toast.success("Değerlendirmeniz için teşekkürler.");
      queryClient.invalidateQueries({ queryKey: ["memnuniyet", talepId] });
    },
    onError: (hata) => toast.error(apiHataMesaji(hata)),
  });

  return (
    <Card>
      <CardHeader><CardTitle>Memnuniyet Değerlendirmesi</CardTitle></CardHeader>
      <CardContent>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((deger) => (
            <button
              key={deger}
              type="button"
              disabled={!!mevcutDegerlendirme}
              onClick={() => setPuan(deger)}
              aria-label={`${deger} yıldız`}
              className="disabled:cursor-default"
            >
              <Star
                className={cn(
                  "h-6 w-6",
                  deger <= puan ? "fill-warning text-warning" : "text-border"
                )}
              />
            </button>
          ))}
        </div>
        {!mevcutDegerlendirme ? (
          <>
            <textarea
              value={yorum}
              onChange={(e) => setYorum(e.target.value)}
              rows={3}
              placeholder="Deneyiminizi paylaşın (isteğe bağlı)"
              className="mt-3 w-full rounded-xl border border-border bg-surface p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
            />
            <Button
              className="mt-3"
              size="sm"
              disabled={puan === 0}
              loading={gonder.isPending}
              onClick={() => gonder.mutate()}
            >
              Değerlendirmeyi Gönder
            </Button>
          </>
        ) : (
          mevcutDegerlendirme.yorum && <p className="mt-3 text-sm text-muted-foreground">{mevcutDegerlendirme.yorum}</p>
        )}
      </CardContent>
    </Card>
  );
}
