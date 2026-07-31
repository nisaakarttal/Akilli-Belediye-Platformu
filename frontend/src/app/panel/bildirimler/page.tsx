"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { bildirimleriListele, bildirimiOkunduYap, tumBildirimleriOkunduYap } from "@/lib/api/bildirimler";
import { goreceliZaman, cn } from "@/lib/utils";

export default function BildirimlerSayfasi() {
  const queryClient = useQueryClient();

  const { data: bildirimler, isLoading } = useQuery({
    queryKey: ["bildirimler", "panel"],
    queryFn: bildirimleriListele,
  });

  const okunduIsaretle = useMutation({
    mutationFn: bildirimiOkunduYap,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bildirimler"] }),
  });

  const tumunuOkunduIsaretle = useMutation({
    mutationFn: tumBildirimleriOkunduYap,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bildirimler"] }),
  });

  const okunmamisVar = bildirimler?.some((b) => !b.okundu_mu);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Bildirimler</h1>
        {okunmamisVar && (
          <Button size="sm" variant="secondary" onClick={() => tumunuOkunduIsaretle.mutate()} loading={tumunuOkunduIsaretle.isPending}>
            <CheckCheck className="h-4 w-4" aria-hidden />
            Tümünü Okundu İşaretle
          </Button>
        )}
      </div>

      <Card className="mt-4">
        {isLoading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />)}
          </div>
        ) : !bildirimler || bildirimler.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <Bell className="h-8 w-8 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">Henüz bildiriminiz yok.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {bildirimler.map((bildirim) => (
              <li key={bildirim.id}>
                <button
                  onClick={() => !bildirim.okundu_mu && okunduIsaretle.mutate(bildirim.id)}
                  className={cn("flex w-full items-start gap-3 p-4 text-left hover:bg-muted/60", !bildirim.okundu_mu && "bg-primary-50/50")}
                >
                  <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", bildirim.okundu_mu ? "bg-transparent" : "bg-primary")} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">{bildirim.baslik}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{bildirim.mesaj}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{goreceliZaman(bildirim.olusturulma_tarihi)}</span>
                  </span>
                  {bildirim.ilgili_talep_id && (
                    <Link
                      href={`/panel/taleplerim/${bildirim.ilgili_talep_id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 text-xs font-medium text-primary-700 hover:underline"
                    >
                      Talebi Gör
                    </Link>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
