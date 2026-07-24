import { YuzenAsistan } from "@/components/ai/yuzen-asistan";
import { BilgiKartlariBolumu } from "@/components/home/bilgi-kartlari-bolumu";
import { DuyurularBolumu } from "@/components/home/duyurular-bolumu";
import { EtkinliklerBolumu } from "@/components/home/etkinlikler-bolumu";
import { HaberlerBolumu } from "@/components/home/haberler-bolumu";
import { Hero } from "@/components/home/hero";
import { Altbilgi } from "@/components/layout/altbilgi";
import { Basli } from "@/components/layout/basli";

export default function AnaSayfa() {
  return (
    <>
      <Basli />
      <Hero />
      <BilgiKartlariBolumu />
      <HaberlerBolumu />
      <DuyurularBolumu />
      <EtkinliklerBolumu />
      <Altbilgi />
      <YuzenAsistan />
    </>
  );
}
