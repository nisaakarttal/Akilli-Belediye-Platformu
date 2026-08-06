"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { bildirimleriListele, bildirimiOkunduYap, tumBildirimleriOkunduYap } from "@/lib/api/bildirimler";
import { goreceliZaman, cn } from "@/lib/utils";

export default function PersonelBildirimleriSayfasi() {
  const queryClient = useQueryClient();
  const { data: bildirimler = [], isLoading } = useQuery({ queryKey: ["bildirimler"], queryFn: bildirimleriListele });
  const yenile = () => queryClient.invalidateQueries({ queryKey: ["bildirimler"] });
  const okundu = useMutation({ mutationFn: bildirimiOkunduYap, onSuccess: yenile });
  const tumu = useMutation({ mutationFn: tumBildirimleriOkunduYap, onSuccess: yenile });
  const okunmamisVar = bildirimler.some((b) => !b.okundu_mu);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold text-foreground">Bildirimler</h1><p className="text-sm text-muted-foreground">Atamalar ve talep işlemleriyle ilgili bildirimlerinizi takip edin.</p></div>
        {okunmamisVar && <Button size="sm" variant="secondary" onClick={() => tumu.mutate()} disabled={tumu.isPending}><CheckCheck className="h-4 w-4" />Tümünü okundu yap</Button>}
      </div>

      <Card className="overflow-hidden">
        {isLoading ? <div className="space-y-3 p-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}</div>
        : bildirimler.length === 0 ? <div className="flex flex-col items-center gap-3 py-14 text-center"><Bell className="h-9 w-9 text-muted-foreground" /><p className="text-sm text-muted-foreground">Henüz bildiriminiz yok.</p></div>
        : <ul className="divide-y divide-border">{bildirimler.map((bildirim) => <li key={bildirim.id} className={cn("flex items-start gap-3 p-4", !bildirim.okundu_mu && "bg-primary-50/50")}>
            <button onClick={() => !bildirim.okundu_mu && okundu.mutate(bildirim.id)} className="min-w-0 flex-1 text-left">
              <span className="block text-sm font-medium text-foreground">{bildirim.baslik}</span><span className="mt-0.5 block text-sm text-muted-foreground">{bildirim.mesaj}</span><span className="mt-1 block text-xs text-muted-foreground">{goreceliZaman(bildirim.olusturulma_tarihi)}</span>
            </button>
            {bildirim.ilgili_talep_id && <Link href={`/personel/${bildirim.ilgili_talep_id}`} className="shrink-0 text-xs font-medium text-primary-700 hover:underline">Talebi Gör</Link>}
          </li>)}</ul>}
      </Card>
    </div>
  );
}
