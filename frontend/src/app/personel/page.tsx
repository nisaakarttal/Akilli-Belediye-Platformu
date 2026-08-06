"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Clock3,
  LoaderCircle,
} from "lucide-react";

import { TalepKarti } from "@/components/sikayet/talep-karti";
import { Card, CardContent } from "@/components/ui/card";
import {
  FadeIn,
  FadeInStagger,
  StaggerOgesi,
} from "@/components/ui/animasyon";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { personelDashboardGetir } from "@/lib/api/personel";

const KARTLAR = [
  {
    alan: "toplam",
    etiket: "Toplam Atanan",
    ikon: ClipboardList,
    renk: "text-birincil-600",
  },
  {
    alan: "bekleyen",
    etiket: "Bekleyen",
    ikon: Clock3,
    renk: "text-amber-500",
  },
  {
    alan: "inceleniyor",
    etiket: "İncelenen",
    ikon: LoaderCircle,
    renk: "text-sky-500",
  },
  {
    alan: "atandi",
    etiket: "Atandı",
    ikon: ClipboardList,
    renk: "text-indigo-500",
  },
  {
    alan: "cozuldu",
    etiket: "Çözüldü",
    ikon: CheckCircle2,
    renk: "text-green-500",
  },
  {
    alan: "geciken",
    etiket: "Geciken",
    ikon: AlertTriangle,
    renk: "text-red-600",
  },
  {
    alan: "acil",
    etiket: "Acil",
    ikon: AlertTriangle,
    renk: "text-orange-500",
  },
  {
    alan: "son_7_gun_cozulen",
    etiket: "Son 7 Gün Çözülen",
    ikon: CheckCircle2,
    renk: "text-emerald-600",
  },
] as const;

export default function PersonelAnaSayfasi() {
  const { data, isLoading } = useQuery({
    queryKey: ["personel-dashboard"],
    queryFn: personelDashboardGetir,
  });

  if (isLoading) {
    return <TamSayfaYukleniyor />;
  }

  const talepler = data?.son_atananlar ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-metin sm:text-3xl">
          Personel Dashboard
        </h1>

        <p className="text-sm text-metin-ikincil">
          Size güncel olarak atanmış talepleri ve işlem durumlarını yönetin.
        </p>
      </div>

      {data && (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {KARTLAR.map(({ alan, etiket, ikon: Ikon, renk }) => (
            <Card key={alan}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-medium text-metin-ikincil">
                    {etiket}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-metin">
                    {data.istatistikler[alan]}
                  </p>
                </div>

                <Ikon
                  size={24}
                  className={renk}
                  aria-hidden="true"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="mb-3 text-lg font-semibold text-metin">
          Son Atanan Talepler
        </h2>

        {talepler.length === 0 ? (
          <FadeIn>
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <ClipboardList
                  size={40}
                  className="text-metin-ikincil"
                  aria-hidden="true"
                />

                <p className="text-metin-ikincil">
                  Şu anda size atanmış bir talep bulunmuyor.
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        ) : (
          <FadeInStagger className="space-y-3">
            {talepler.map((talep) => (
              <StaggerOgesi key={talep.id}>
                <TalepKarti
                  talep={talep}
                  href={`/personel/${talep.id}`}
                />
              </StaggerOgesi>
            ))}
          </FadeInStagger>
        )}
      </div>

      {data && data.acil_talepler.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-metin">
            Acil Talepler
          </h2>

          <div className="space-y-3">
            {data.acil_talepler.map((talep) => (
              <TalepKarti
                key={talep.id}
                talep={talep}
                href={`/personel/${talep.id}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}