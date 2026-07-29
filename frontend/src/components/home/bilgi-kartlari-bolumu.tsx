import { AcilNumaralarKarti } from "@/components/home/acil-numaralar-karti";
import { HavaDurumuKarti } from "@/components/home/hava-durumu-karti";
import { NobetciEczaneKarti } from "@/components/home/nobetci-eczane-karti";
import { FadeInStagger, StaggerOgesi } from "@/components/ui/animasyon";

export function BilgiKartlariBolumu() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" aria-label="Güncel şehir bilgi kartları">
      <FadeInStagger className="grid gap-5 sm:gap-6 md:grid-cols-3">
        <StaggerOgesi>
          <HavaDurumuKarti />
        </StaggerOgesi>
        <StaggerOgesi>
          <NobetciEczaneKarti />
        </StaggerOgesi>
        <StaggerOgesi>
          <AcilNumaralarKarti />
        </StaggerOgesi>
      </FadeInStagger>
    </section>
  );
}