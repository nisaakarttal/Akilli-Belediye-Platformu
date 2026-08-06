"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquareText, Star, ThumbsUp, UsersRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { personelMemnuniyetIstatistikleriGetir } from "@/lib/api/personel";
import { tarihSaatFormatla } from "@/lib/tarih";

function Yildizlar({ puan }: { puan: number }) {
  return <span className="flex gap-0.5" aria-label={`${puan} yıldız`}>{[1,2,3,4,5].map((i) => <Star key={i} className={`h-4 w-4 ${i <= puan ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />)}</span>;
}

export default function PersonelMemnuniyetSayfasi() {
  const { data, isLoading, isError } = useQuery({ queryKey: ["personel", "memnuniyet-istatistikleri"], queryFn: personelMemnuniyetIstatistikleriGetir });
  if (isLoading) return <TamSayfaYukleniyor />;

  if (isError || !data) return <Card><CardContent className="py-12 text-center text-sm text-danger">Memnuniyet istatistikleri yüklenemedi.</CardContent></Card>;

  const kartlar = [
    { etiket: "Değerlendirme", deger: data.toplam_degerlendirme, ikon: UsersRound },
    { etiket: "Ortalama Puan", deger: data.ortalama_puan == null ? "—" : `${data.ortalama_puan.toFixed(1)} / 5`, ikon: Star },
    { etiket: "Olumlu Oran", deger: `%${data.olumlu_oran.toFixed(0)}`, ikon: ThumbsUp },
    { etiket: "5 Yıldız", deger: data.bes_yildiz, ikon: MessageSquareText },
  ];

  return <div className="space-y-6">
    <div><h1 className="text-2xl font-bold text-foreground">Memnuniyet İstatistikleri</h1><p className="text-sm text-muted-foreground">Size atanmış taleplere vatandaşların verdiği değerlendirmelerin özeti.</p></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kartlar.map(({etiket,deger,ikon:Ikon}) => <Card key={etiket}><CardContent className="flex items-center justify-between p-5"><div><p className="text-xs font-medium text-muted-foreground">{etiket}</p><p className="mt-1 text-2xl font-bold text-foreground">{deger}</p></div><Ikon className="h-6 w-6 text-primary-600" /></CardContent></Card>)}</div>
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <Card><CardHeader><CardTitle>Puan Dağılımı</CardTitle></CardHeader><CardContent className="space-y-3">{[5,4,3,2,1].map((puan) => { const sayi=data.dagilim[puan] ?? 0; const oran=data.toplam_degerlendirme ? (sayi/data.toplam_degerlendirme)*100 : 0; return <div key={puan}><div className="mb-1 flex justify-between text-xs"><span>{puan} yıldız</span><span className="text-muted-foreground">{sayi}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-amber-400" style={{width:`${oran}%`}} /></div></div>; })}</CardContent></Card>
      <Card><CardHeader><CardTitle>Son Değerlendirmeler</CardTitle></CardHeader><CardContent>{data.son_degerlendirmeler.length===0 ? <p className="py-8 text-center text-sm text-muted-foreground">Henüz değerlendirme bulunmuyor.</p> : <div className="divide-y divide-border">{data.son_degerlendirmeler.map((kayit) => <div key={`${kayit.talep_id}-${kayit.olusturulma_tarihi}`} className="py-4 first:pt-0 last:pb-0"><div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-sm font-medium text-foreground">{kayit.baslik}</p><p className="text-xs text-muted-foreground">{kayit.takip_no} · {tarihSaatFormatla(kayit.olusturulma_tarihi)}</p></div><Yildizlar puan={kayit.puan} /></div>{kayit.yorum && <p className="mt-2 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">{kayit.yorum}</p>}</div>)}</div>}</CardContent></Card>
    </div>
  </div>;
}
