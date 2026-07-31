"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { taleplerListele, talepDurumGuncelle, talepAta, talepCoz } from "@/lib/api/talepler";
import { kullanicilariListele } from "@/lib/api/kullanicilar";
import { DURUM_ETIKETLERI, DURUM_RENKLERI, ONCELIK_ETIKETLERI, ONCELIK_RENKLERI } from "@/constants/durum";
import { tarihFormatla, cn } from "@/lib/utils";
import { apiHataMesaji } from "@/lib/api/client";
import type { TalepDurumu, TalepListe } from "@/types";

const SAYFA_BOYUTU = 12;

const DURUM_SEKMELERI: { deger: TalepDurumu | "tumu"; etiket: string }[] = [
  { deger: "tumu", etiket: "Tümü" },
  { deger: "bekliyor", etiket: DURUM_ETIKETLERI.bekliyor },
  { deger: "inceleniyor", etiket: DURUM_ETIKETLERI.inceleniyor },
  { deger: "atandi", etiket: DURUM_ETIKETLERI.atandi },
  { deger: "cozuldu", etiket: DURUM_ETIKETLERI.cozuldu },
  { deger: "kapatildi", etiket: DURUM_ETIKETLERI.kapatildi },
];

export default function AdminTaleplerSayfasi() {
  const [durum, setDurum] = useState<TalepDurumu | "tumu">("tumu");
  const [sayfa, setSayfa] = useState(1);
  const [seciliTalep, setSeciliTalep] = useState<TalepListe | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "talepler", durum, sayfa],
    queryFn: () => taleplerListele({ durum: durum === "tumu" ? undefined : durum, sayfa, sayfa_boyutu: SAYFA_BOYUTU }),
  });

  const kayitlar = data?.veriler ?? [];
  const toplamSayfa = data ? Math.max(1, Math.ceil(data.toplam / SAYFA_BOYUTU)) : 1;

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Talep Yönetimi</h1>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {DURUM_SEKMELERI.map((sekme) => (
            <button
              key={sekme.deger}
              onClick={() => { setDurum(sekme.deger); setSayfa(1); }}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                durum === sekme.deger ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary-50"
              )}
            >
              {sekme.etiket}
            </button>
          ))}
        </div>

        <Card className="mt-4 overflow-hidden">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />)}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="p-3 font-medium">Talep</th>
                  <th className="p-3 font-medium">Kategori</th>
                  <th className="p-3 font-medium">Öncelik</th>
                  <th className="p-3 font-medium">Durum</th>
                  <th className="p-3 font-medium">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {kayitlar.map((talep) => {
                  const durumRenk = DURUM_RENKLERI[talep.durum];
                  const oncelikRenk = ONCELIK_RENKLERI[talep.oncelik];
                  return (
                    <tr
                      key={talep.id}
                      onClick={() => setSeciliTalep(talep)}
                      className={cn(
                        "cursor-pointer border-b border-border last:border-0 hover:bg-muted/60",
                        seciliTalep?.id === talep.id && "bg-primary-50/60"
                      )}
                    >
                      <td className="max-w-[220px] truncate p-3 font-medium text-foreground">{talep.baslik}</td>
                      <td className="p-3 text-muted-foreground">{talep.kategori.ad}</td>
                      <td className="p-3"><Badge className={cn(oncelikRenk.bg, oncelikRenk.text)}>{ONCELIK_ETIKETLERI[talep.oncelik]}</Badge></td>
                      <td className="p-3"><Badge className={cn(durumRenk.bg, durumRenk.text)} dot>{DURUM_ETIKETLERI[talep.durum]}</Badge></td>
                      <td className="p-3 text-muted-foreground">{tarihFormatla(talep.olusturulma_tarihi)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Card>

        {toplamSayfa > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button onClick={() => setSayfa((s) => Math.max(1, s - 1))} disabled={sayfa === 1} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border disabled:opacity-40" aria-label="Önceki sayfa">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">{sayfa} / {toplamSayfa}</span>
            <button onClick={() => setSayfa((s) => Math.min(toplamSayfa, s + 1))} disabled={sayfa === toplamSayfa} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border disabled:opacity-40" aria-label="Sonraki sayfa">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {seciliTalep && <TalepIslemPaneli talep={seciliTalep} onKapat={() => setSeciliTalep(null)} />}
    </div>
  );
}

function TalepIslemPaneli({ talep, onKapat }: { talep: TalepListe; onKapat: () => void }) {
  const queryClient = useQueryClient();
  const [personelId, setPersonelId] = useState("");
  const [cozumNotu, setCozumNotu] = useState("");

  const { data: personeller } = useQuery({
    queryKey: ["kullanicilar", "personel"],
    queryFn: () => kullanicilariListele({ rol: "personel", sayfa_boyutu: 100 }),
  });

  function yenile() {
    queryClient.invalidateQueries({ queryKey: ["admin", "talepler"] });
    onKapat();
  }

  const durumGuncelle = useMutation({
    mutationFn: (durum: TalepDurumu) => talepDurumGuncelle(talep.id, durum),
    onSuccess: () => { toast.success("Durum güncellendi."); yenile(); },
    onError: (h) => toast.error(apiHataMesaji(h)),
  });

  const ata = useMutation({
    mutationFn: () => talepAta(talep.id, personelId),
    onSuccess: () => { toast.success("Talep atandı."); yenile(); },
    onError: (h) => toast.error(apiHataMesaji(h)),
  });

  const coz = useMutation({
    mutationFn: () => talepCoz(talep.id, cozumNotu),
    onSuccess: () => { toast.success("Talep çözüldü olarak işaretlendi."); yenile(); },
    onError: (h) => toast.error(apiHataMesaji(h)),
  });

  return (
    <Card className="h-fit p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">#{talep.takip_no}</p>
          <h2 className="font-display text-sm font-semibold text-foreground">{talep.baslik}</h2>
        </div>
        <button onClick={onKapat} aria-label="Kapat" className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Durumu Değiştir</p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(DURUM_ETIKETLERI) as TalepDurumu[]).map((d) => (
            <button
              key={d}
              onClick={() => durumGuncelle.mutate(d)}
              disabled={durumGuncelle.isPending || d === talep.durum}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-40",
                d === talep.durum ? "border-primary bg-primary-50 text-primary-700" : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {DURUM_ETIKETLERI[d]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-1.5">
        <label htmlFor="personel" className="text-xs font-medium text-muted-foreground">Personele Ata</label>
        <div className="flex gap-2">
          <select
            id="personel"
            value={personelId}
            onChange={(e) => setPersonelId(e.target.value)}
            className="h-10 flex-1 rounded-lg border border-border bg-surface px-2.5 text-sm"
          >
            <option value="">Personel seçin…</option>
            {personeller?.veriler.map((p) => (
              <option key={p.id} value={p.id}>{p.ad} {p.soyad}</option>
            ))}
          </select>
          <Button size="sm" disabled={!personelId} loading={ata.isPending} onClick={() => ata.mutate()}>Ata</Button>
        </div>
      </div>

      <div className="mt-5 space-y-1.5">
        <label htmlFor="cozum_notu" className="text-xs font-medium text-muted-foreground">Çözüm Notu ile Kapat</label>
        <textarea
          id="cozum_notu"
          rows={3}
          value={cozumNotu}
          onChange={(e) => setCozumNotu(e.target.value)}
          placeholder="Yapılan işlemi özetleyin…"
          className="w-full rounded-lg border border-border bg-surface p-2.5 text-sm placeholder:text-muted-foreground"
        />
        <Button size="sm" className="w-full" disabled={cozumNotu.trim().length < 5} loading={coz.isPending} onClick={() => coz.mutate()}>
          Çözüldü Olarak İşaretle
        </Button>
      </div>
    </Card>
  );
}
