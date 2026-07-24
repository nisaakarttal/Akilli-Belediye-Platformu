import { DuyurularBolumu } from "@/components/home/duyurular-bolumu";
import { EtkinliklerBolumu } from "@/components/home/etkinlikler-bolumu";
import { HaberlerBolumu } from "@/components/home/haberler-bolumu";
import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";

export default function DuyurularSayfasi() {
  return (
    <>
      <Basli />
      <main className="pt-6">
        <h1 className="mx-auto max-w-7xl px-4 text-2xl font-bold text-metin sm:px-6 sm:text-3xl">
          Duyurular ve Haberler
        </h1>
        <HaberlerBolumu />
        <DuyurularBolumu />
        <EtkinliklerBolumu />
      </main>
      <Altbilgi />
    </>
  );
}
