"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { sikayetiAnalizEt, type AiAnalizYaniti } from "@/lib/api/ai";
import { ONCELIK_ETIKETLERI, ONCELIK_RENKLERI } from "@/constants/durum";
import { apiHataMesaji } from "@/lib/api/client";
import { cn } from "@/lib/utils";

export default function AiAnalizSayfasi() {
  const [baslik, setBaslik] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [sonuc, setSonuc] = useState<AiAnalizYaniti | null>(null);

  const analiz = useMutation({
    mutationFn: () => sikayetiAnalizEt({ baslik, aciklama }),
    onSuccess: setSonuc,
    onError: (h) => alert(apiHataMesaji(h)),
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
        <Sparkles className="h-5 w-5 text-primary-700" aria-hidden />
        AI Analiz
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Bir şikayet metni girin; yapay zeka önerilen kategori, öncelik ve eksik bilgileri tahmin etsin.
      </p>

      <Card className="mt-5">
        <CardHeader><CardTitle>Şikayet Metni</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Başlık" htmlFor="baslik">
            <Input id="baslik" value={baslik} onChange={(e) => setBaslik(e.target.value)} placeholder="Örn. Sokak lambası çalışmıyor" />
          </FormField>
          <FormField label="Açıklama" htmlFor="aciklama">
            <textarea
              id="aciklama"
              rows={4}
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface p-3.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
              placeholder="Şikayetin detayını yazın…"
            />
          </FormField>
          <Button
            disabled={baslik.trim().length < 5 || aciklama.trim().length < 10}
            loading={analiz.isPending}
            onClick={() => analiz.mutate()}
          >
            Analiz Et
          </Button>
        </CardContent>
      </Card>

      {sonuc && (
        <Card className="mt-5 animate-fade-up">
          <CardHeader><CardTitle>AI Önerisi</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">
                Kategori: {sonuc.onerilen_kategori_adi ?? "Belirlenemedi"}
              </Badge>
              <Badge className={cn(ONCELIK_RENKLERI[sonuc.onerilen_oncelik].bg, ONCELIK_RENKLERI[sonuc.onerilen_oncelik].text)}>
                Öncelik: {ONCELIK_ETIKETLERI[sonuc.onerilen_oncelik]}
              </Badge>
              <Badge variant="info">Güven Skoru: %{Math.round(sonuc.guven_skoru * 100)}</Badge>
            </div>
            <p className="text-sm text-foreground">{sonuc.ai_mesaji}</p>
            {sonuc.eksik_bilgiler.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Eksik bilgiler:</p>
                <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                  {sonuc.eksik_bilgiler.map((eksik) => <li key={eksik}>{eksik}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
