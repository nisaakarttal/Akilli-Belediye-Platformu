import type { KullaniciRolu } from "@/types";
import type { VurguRengi } from "@/constants/vurgu";

export const ROL_ETIKETI: Record<KullaniciRolu, string> = {
  vatandas: "Vatandaş",
  personel: "Personel",
  admin: "Yönetici",
};

/**
 * Rol bazlı vurgu rengi. Önceden her rol için ayrı, marka paletiyle
 * ilgisi olmayan iki renkli gradyanlar (`from-purple-500 to-indigo-600` vb.)
 * kullanılıyordu; artık uygulamanın 5 renkli token sistemiyle sınırlı.
 */
export const ROL_VURGU: Record<KullaniciRolu, VurguRengi> = {
  vatandas: "birincil",
  personel: "ikincil",
  admin: "tehlike",
};
