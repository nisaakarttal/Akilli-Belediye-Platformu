"use client";

import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { AlertTriangle, FileText, CheckCircle2, Users, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  genelIstatistikleriGetir,
  kategoriDagilimiGetir,
  gunlukTalepleriGetir,
} from "@/lib/api/admin";
import { taleplerListele } from "@/lib/api/talepler";
import { DURUM_ETIKETLERI, DURUM_RENKLERI } from "@/constants/durum";
import { goreceliZaman } from "@/lib/utils";

const DONUT_RENKLERI = ["#c77700", "#1e88d5", "#0f4c81", "#2e7d32", "#6b7280"];

export default function AdminDashboard() {
  const { data: istatistik } = useQuery({ queryKey: ["admin", "istatistikler"], queryFn: genelIstatistikleriGetir });
  const { data: kategoriDagilimi } = useQuery({ queryKey: ["admin", "kategori-dagilimi"], queryFn: kategoriDagilimiGetir });
  const { data: gunlukTalepler } = useQuery({ queryKey: ["admin", "gunluk-talepler"], queryFn: () => gunlukTalepleriGetir(30) });
  const { data: sonTalepler } = useQuery({
    queryKey: ["admin", "son-talepler"],
    queryFn: () => taleplerListele({ sayfa: 1, sayfa_boyutu: 5 }),
  });

  const durumVerisi = istatistik
    ? [
        { ad: "Bekliyor", deger: istatistik.bekleyen_talep },
        { ad: "Çözülen", deger: istatistik.cozulen_talep },
        { ad: "Toplam", deger: istatistik.toplam_talep },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <OzetKarti ikon={FileText} etiket="Toplam Talep" deger={istatistik?.toplam_talep} renk="text-primary-700" />
        <OzetKarti ikon={CheckCircle2} etiket="Çözülen Talep" deger={istatistik?.cozulen_talep} renk="text-success" />
        <OzetKarti ikon={Users} etiket="Bekleyen Talep" deger={istatistik?.bekleyen_talep} renk="text-warning" />
        <OzetKarti ikon={AlertTriangle} etiket="Geciken" deger={istatistik?.geciken_talep} renk="text-danger" />
        <OzetKarti ikon={AlertTriangle} etiket="Acil" deger={istatistik?.acil_talep} renk="text-warning" />
        <OzetKarti
          ikon={ShieldCheck}
          etiket="SLA Başarısı"
          deger={istatistik ? `%${istatistik.sla_basari_orani.toFixed(0)}` : undefined}
          renk="text-info"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Talep Durumu</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={durumVerisi} dataKey="deger" nameKey="ad" innerRadius={60} outerRadius={90} paddingAngle={2}>
                    {durumVerisi.map((_, i) => (
                      <Cell key={i} fill={DONUT_RENKLERI[i % DONUT_RENKLERI.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              {durumVerisi.map((d, i) => (
                <span key={d.ad} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: DONUT_RENKLERI[i % DONUT_RENKLERI.length] }} />
                  {d.ad}: {d.deger}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Talep Trendi (30 gün)</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gunlukTalepler ?? []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="tarih" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={28} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sayi" stroke="#0f4c81" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Kategorilere Göre Talepler</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kategoriDagilimi ?? []} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis dataKey="kategori_adi" type="category" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={100} />
                  <Tooltip />
                  <Bar dataKey="sayi" fill="#1e88d5" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Son Talepler</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {sonTalepler?.veriler.map((talep) => {
                const renk = DURUM_RENKLERI[talep.durum];
                return (
                  <li key={talep.id} className="flex items-center justify-between gap-2 rounded-lg px-1 py-2.5 hover:bg-muted">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{talep.baslik}</p>
                      <p className="text-xs text-muted-foreground">{talep.mahalle.ad} · {goreceliZaman(talep.olusturulma_tarihi)}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${renk.bg} ${renk.text}`}>
                      {DURUM_ETIKETLERI[talep.durum]}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function OzetKarti({
  ikon: Ikon,
  etiket,
  deger,
  renk,
}: {
  ikon: React.ComponentType<{ className?: string }>;
  etiket: string;
  deger: string | number | undefined;
  renk: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">{etiket}</p>
        <Ikon className={`h-4 w-4 ${renk}`} />
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-foreground">{deger ?? "—"}</p>
    </Card>
  );
}
