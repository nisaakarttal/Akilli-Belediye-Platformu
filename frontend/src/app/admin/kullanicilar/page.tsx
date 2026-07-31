"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { kullanicilariListele, kullaniciRoluGuncelle, kullaniciDurumuGuncelle } from "@/lib/api/kullanicilar";
import { apiHataMesaji } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { KullaniciRolu } from "@/types";

const SAYFA_BOYUTU = 15;

const ROL_SEKMELERI: { deger: KullaniciRolu | "tumu"; etiket: string }[] = [
  { deger: "tumu", etiket: "Tümü" },
  { deger: "vatandas", etiket: "Vatandaş" },
  { deger: "personel", etiket: "Personel" },
  { deger: "admin", etiket: "Admin" },
];

export default function KullaniciYonetimiSayfasi() {
  const [rol, setRol] = useState<KullaniciRolu | "tumu">("tumu");
  const [sayfa, setSayfa] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "kullanicilar", rol, sayfa],
    queryFn: () => kullanicilariListele({ rol: rol === "tumu" ? undefined : rol, sayfa, sayfa_boyutu: SAYFA_BOYUTU }),
  });

  function yenile() {
    queryClient.invalidateQueries({ queryKey: ["admin", "kullanicilar"] });
  }

  const roluGuncelle = useMutation({
    mutationFn: ({ id, rol }: { id: string; rol: KullaniciRolu }) => kullaniciRoluGuncelle(id, rol),
    onSuccess: () => { toast.success("Rol güncellendi."); yenile(); },
    onError: (h) => toast.error(apiHataMesaji(h)),
  });

  const durumuGuncelle = useMutation({
    mutationFn: ({ id, aktifMi }: { id: string; aktifMi: boolean }) => kullaniciDurumuGuncelle(id, aktifMi),
    onSuccess: () => { toast.success("Kullanıcı durumu güncellendi."); yenile(); },
    onError: (h) => toast.error(apiHataMesaji(h)),
  });

  const kayitlar = data?.veriler ?? [];
  const toplamSayfa = data ? Math.max(1, Math.ceil(data.toplam / SAYFA_BOYUTU)) : 1;

  return (
    <div>
      <h1 className="font-display text-xl font-bold text-foreground">Kullanıcı Yönetimi</h1>

      <div className="mt-4 flex gap-2">
        {ROL_SEKMELERI.map((sekme) => (
          <button
            key={sekme.deger}
            onClick={() => { setRol(sekme.deger); setSayfa(1); }}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              rol === sekme.deger ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary-50"
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
                <th className="p-3 font-medium">Kullanıcı</th>
                <th className="p-3 font-medium">Telefon</th>
                <th className="p-3 font-medium">Rol</th>
                <th className="p-3 font-medium">Durum</th>
              </tr>
            </thead>
            <tbody>
              {kayitlar.map((k) => (
                <tr key={k.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar ad={k.ad} soyad={k.soyad} src={k.profil_fotografi} className="h-8 w-8 text-xs" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{k.ad} {k.soyad}</p>
                        <p className="truncate text-xs text-muted-foreground">{k.e_posta}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{k.telefon}</td>
                  <td className="p-3">
                    <select
                      value={k.rol}
                      onChange={(e) => roluGuncelle.mutate({ id: k.id, rol: e.target.value as KullaniciRolu })}
                      className="h-9 rounded-lg border border-border bg-surface px-2 text-xs"
                    >
                      <option value="vatandas">Vatandaş</option>
                      <option value="personel">Personel</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => durumuGuncelle.mutate({ id: k.id, aktifMi: !k.aktif_mi })}
                      className="inline-block"
                    >
                      <Badge variant={k.aktif_mi ? "success" : "neutral"}>{k.aktif_mi ? "Aktif" : "Pasif"}</Badge>
                    </button>
                  </td>
                </tr>
              ))}
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
  );
}
