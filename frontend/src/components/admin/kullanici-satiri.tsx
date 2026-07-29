import { Loader2, Mail, Phone, ShieldCheck, ShieldOff } from "lucide-react";

import { Dugme } from "@/components/ui/button";
import { Kart, KartIcerik } from "@/components/ui/card";
import { Secim } from "@/components/ui/select";
import { ROL_ETIKETI, ROL_VURGU } from "@/constants/kullanici";
import { VURGU_SOLID_SINIFLARI } from "@/constants/vurgu";
import { cn } from "@/lib/utils";
import type { Kullanici, KullaniciRolu } from "@/types";

interface KullaniciSatiriProps {
  kullanici: Kullanici;
  rolGuncelleniyorMu: boolean;
  durumGuncelleniyorMu: boolean;
  onRolDegistir: (rol: KullaniciRolu) => void;
  onDurumDegistir: () => void;
}

/** Admin "Kullanıcı Yönetimi" listesindeki tek bir kullanıcı satırı. */
export function KullaniciSatiri({
  kullanici,
  rolGuncelleniyorMu,
  durumGuncelleniyorMu,
  onRolDegistir,
  onDurumDegistir,
}: KullaniciSatiriProps) {
  const vurgu = ROL_VURGU[kullanici.rol];

  return (
    <Kart
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        !kullanici.aktif_mi ? "border-tehlike/30 bg-tehlike/5 opacity-80" : "hover:shadow-md"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1.5",
          !kullanici.aktif_mi ? "bg-tehlike" : VURGU_SOLID_SINIFLARI[vurgu]
        )}
        aria-hidden="true"
      />

      <KartIcerik className="flex flex-wrap items-center justify-between gap-4 p-4 pl-6 sm:p-5 sm:pl-6">
        <div className="flex items-center gap-3.5">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black shadow-sm",
              !kullanici.aktif_mi ? "bg-slate-400 text-white" : VURGU_SOLID_SINIFLARI[vurgu]
            )}
            aria-hidden="true"
          >
            {kullanici.ad?.[0]}
            {kullanici.soyad?.[0]}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base font-extrabold text-metin">
                {kullanici.ad} {kullanici.soyad}
              </p>

              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold",
                  VURGU_SOLID_SINIFLARI[vurgu]
                )}
              >
                {ROL_ETIKETI[kullanici.rol]}
              </span>

              {!kullanici.aktif_mi && (
                <span className="rounded-full bg-tehlike/10 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:text-red-300">
                  Donduruldu
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-metin-ikincil">
              <span className="flex items-center gap-1">
                <Mail size={12} className="text-birincil-500" aria-hidden="true" />
                {kullanici.e_posta}
              </span>
              {kullanici.telefon && (
                <span className="flex items-center gap-1">
                  <Phone size={12} className="text-birincil-500" aria-hidden="true" />
                  {kullanici.telefon}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Secim
              value={kullanici.rol}
              disabled={rolGuncelleniyorMu}
              onChange={(e) => onRolDegistir(e.target.value as KullaniciRolu)}
              className="h-9 w-36 text-xs font-bold"
              aria-label={`${kullanici.ad} ${kullanici.soyad} için rol seç`}
            >
              {Object.entries(ROL_ETIKETI).map(([deger, etiket]) => (
                <option key={deger} value={deger}>
                  {etiket}
                </option>
              ))}
            </Secim>
            {rolGuncelleniyorMu && (
              <Loader2
                size={14}
                className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-birincil-600"
                aria-hidden="true"
              />
            )}
          </div>

          <Dugme
            varyant={kullanici.aktif_mi ? "anahat" : "birincil"}
            boyut="kucuk"
            disabled={durumGuncelleniyorMu}
            className={cn(
              "gap-1.5 font-bold",
              kullanici.aktif_mi && "border-tehlike/30 text-tehlike hover:bg-tehlike/10"
            )}
            onClick={onDurumDegistir}
          >
            {durumGuncelleniyorMu ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : kullanici.aktif_mi ? (
              <ShieldOff size={14} aria-hidden="true" />
            ) : (
              <ShieldCheck size={14} aria-hidden="true" />
            )}
            <span>{kullanici.aktif_mi ? "Pasife Al" : "Etkinleştir"}</span>
          </Dugme>
        </div>
      </KartIcerik>
    </Kart>
  );
}
