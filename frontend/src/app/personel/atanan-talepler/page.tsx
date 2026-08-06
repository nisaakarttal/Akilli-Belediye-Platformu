"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Search } from "lucide-react";

import { TalepKarti } from "@/components/sikayet/talep-karti";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Secim } from "@/components/ui/select";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { atananTalepleriListele } from "@/lib/api/personel";
import type { TalepDurumu, TalepOnceligi } from "@/types";

export default function AtananTaleplerSayfasi() {
  const [arama, setArama] = useState("");
  const [durum, setDurum] = useState<TalepDurumu | "">("");
  const [oncelik, setOncelik] = useState<TalepOnceligi | "">("");

  const { data: talepler = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["personel", "atanan-talepler"],
    queryFn: atananTalepleriListele,
  });

  const filtrelenmis = useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr-TR");
    return talepler.filter((talep) => {
      const aramaUyuyor = !q || [talep.baslik, talep.takip_no, talep.kategori.ad, talep.mahalle.ad]
        .some((deger) => deger.toLocaleLowerCase("tr-TR").includes(q));
      return aramaUyuyor && (!durum || talep.durum === durum) && (!oncelik || talep.oncelik === oncelik);
    });
  }, [arama, durum, oncelik, talepler]);

  if (isLoading) return <TamSayfaYukleniyor />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Atanan Talepler</h1>
        <p className="text-sm text-muted-foreground">Yalnızca güncel olarak size atanmış talepleri görüntüleyin ve yönetin.</p>
      </div>

      <Card>
        <CardContent className="grid gap-3 p-4 md:grid-cols-[1fr_190px_190px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={arama} onChange={(e) => setArama(e.target.value)} placeholder="Başlık, takip no, kategori veya mahalle ara" className="pl-9" />
          </div>
          <Secim value={durum} onChange={(e) => setDurum(e.target.value as TalepDurumu | "")}>
            <option value="">Tüm durumlar</option>
            <option value="bekliyor">Bekliyor</option>
            <option value="atandi">Atandı</option>
            <option value="inceleniyor">İnceleniyor</option>
            <option value="cozuldu">Çözüldü</option>
            <option value="kapatildi">Kapatıldı</option>
          </Secim>
          <Secim value={oncelik} onChange={(e) => setOncelik(e.target.value as TalepOnceligi | "")}>
            <option value="">Tüm öncelikler</option>
            <option value="dusuk">Düşük</option>
            <option value="orta">Orta</option>
            <option value="yuksek">Yüksek</option>
            <option value="acil">Acil</option>
          </Secim>
        </CardContent>
      </Card>

      {isError ? (
        <Card><CardContent className="py-10 text-center"><p className="text-sm text-danger">Talepler yüklenemedi.</p><button onClick={() => refetch()} className="mt-2 text-sm font-medium text-primary-700 hover:underline">Tekrar dene</button></CardContent></Card>
      ) : filtrelenmis.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-3 py-12 text-center"><ClipboardList className="h-10 w-10 text-muted-foreground" /><p className="text-sm text-muted-foreground">Filtrelere uygun atanmış talep bulunamadı.</p></CardContent></Card>
      ) : (
        <div className="space-y-3">{filtrelenmis.map((talep) => <TalepKarti key={talep.id} talep={talep} href={`/personel/${talep.id}`} />)}</div>
      )}
    </div>
  );
}
