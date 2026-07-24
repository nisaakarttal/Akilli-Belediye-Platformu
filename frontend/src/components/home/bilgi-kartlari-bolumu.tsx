import { AcilNumaralarKarti } from "@/components/home/acil-numaralar-karti";
import { HavaDurumuKarti } from "@/components/home/hava-durumu-karti";
import { NobetciEczaneKarti } from "@/components/home/nobetci-eczane-karti";

export function BilgiKartlariBolumu() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid gap-4 md:grid-cols-3">
        <HavaDurumuKarti />
        <NobetciEczaneKarti />
        <AcilNumaralarKarti />
      </div>
    </section>
  );
}
