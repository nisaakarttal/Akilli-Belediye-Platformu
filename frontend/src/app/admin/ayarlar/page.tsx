"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  kategorileriListele,
  kategoriOlustur,
  kategoriPasifYap,
  kategoriSil,
  type KategoriOlusturIstegi,
} from "@/lib/api/kategoriler";
import { apiHataMesaji } from "@/lib/api/client";

const BOS_FORM: KategoriOlusturIstegi = { ad: "", sorumlu_departman: "", sla_saat: 72, renk: "#0F4C81" };

export default function AyarlarSayfasi() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<KategoriOlusturIstegi>(BOS_FORM);

  const { data: kategoriler, isLoading } = useQuery({ queryKey: ["kategoriler", "ayarlar"], queryFn: kategorileriListele });

  function yenile() {
    queryClient.invalidateQueries({ queryKey: ["kategoriler"] });
  }

  const olustur = useMutation({
    mutationFn: () => kategoriOlustur(form),
    onSuccess: () => { toast.success("Kategori oluşturuldu."); setForm(BOS_FORM); yenile(); },
    onError: (h) => toast.error(apiHataMesaji(h)),
  });

  const pasifYap = useMutation({
    mutationFn: kategoriPasifYap,
    onSuccess: () => { toast.success("Kategori pasif yapıldı."); yenile(); },
    onError: (h) => toast.error(apiHataMesaji(h)),
  });

  const sil = useMutation({
    mutationFn: kategoriSil,
    onSuccess: () => { toast.success("Kategori silindi."); yenile(); },
    onError: (h) => toast.error(apiHataMesaji(h)),
  });

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Ayarlar — Kategoriler</h1>

        <Card className="mt-4">
          {isLoading ? (
            <div className="space-y-3 p-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />)}</div>
          ) : (
            <ul className="divide-y divide-border">
              {kategoriler?.map((k) => (
                <li key={k.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ background: k.renk }} aria-hidden />
                    <div>
                      <p className="text-sm font-medium text-foreground">{k.ad}</p>
                      <p className="text-xs text-muted-foreground">{k.sorumlu_departman} · SLA: {k.sla_saat} saat</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {k.silindi_mi && <Badge variant="neutral">Pasif</Badge>}
                    {!k.silindi_mi && (
                      <button
                        onClick={() => pasifYap.mutate(k.id)}
                        aria-label={`${k.ad} kategorisini pasif yap`}
                        className="text-muted-foreground hover:text-warning"
                      >
                        <EyeOff className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => { if (confirm(`"${k.ad}" kategorisini silmek istediğinize emin misiniz?`)) sil.mutate(k.id); }}
                      aria-label={`${k.ad} kategorisini sil`}
                      className="text-muted-foreground hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="h-fit p-5">
        <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
          <Plus className="h-4 w-4" aria-hidden />
          Yeni Kategori
        </h2>
        <div className="mt-4 space-y-3">
          <FormField label="Kategori Adı" htmlFor="ad">
            <Input id="ad" value={form.ad} onChange={(e) => setForm((f) => ({ ...f, ad: e.target.value }))} />
          </FormField>
          <FormField label="Sorumlu Departman" htmlFor="sorumlu_departman">
            <Input id="sorumlu_departman" value={form.sorumlu_departman} onChange={(e) => setForm((f) => ({ ...f, sorumlu_departman: e.target.value }))} />
          </FormField>
          <FormField label="SLA (saat)" htmlFor="sla_saat">
            <Input id="sla_saat" type="number" min={1} max={720} value={form.sla_saat} onChange={(e) => setForm((f) => ({ ...f, sla_saat: Number(e.target.value) }))} />
          </FormField>
          <FormField label="Renk" htmlFor="renk">
            <input id="renk" type="color" value={form.renk} onChange={(e) => setForm((f) => ({ ...f, renk: e.target.value }))} className="h-10 w-full rounded-lg border border-border" />
          </FormField>
          <Button
            className="w-full"
            disabled={form.ad.trim().length < 2 || form.sorumlu_departman.trim().length < 2}
            loading={olustur.isPending}
            onClick={() => olustur.mutate()}
          >
            Kategori Oluştur
          </Button>
        </div>
      </Card>
    </div>
  );
}
