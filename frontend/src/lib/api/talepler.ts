import { api } from "@/lib/api";
import type {
  DosyaTuru,
  SayfalanmisYanit,
  TalepDetay,
  TalepDosyasi,
  TalepDurumu,
  TalepHaritaNoktasi,
  TalepListe,
  TalepOnceligi,
} from "@/types";

export interface TalepOlusturIstegi {
  baslik: string;
  aciklama: string;
  kategori_id: string;
  mahalle_id: string;
  adres_detay?: string;
  enlem: number;
  boylam: number;
  oncelik: TalepOnceligi;
  ai_onerilen_kategori_id?: string | null;
  ai_onerilen_oncelik?: TalepOnceligi | null;
  ai_guven_skoru?: number | null;
}

export interface TalepListeFiltreleri {
  durum?: TalepDurumu;
  kategori_id?: string;
  mahalle_id?: string;
  oncelik?: TalepOnceligi;
  sayfa?: number;
  sayfa_boyutu?: number;
}

export const taleplerApi = {
  olustur: (istek: TalepOlusturIstegi) => api.post<TalepDetay>("/talepler/", istek).then((r) => r.data),

  listele: (filtreler: TalepListeFiltreleri = {}) =>
    api.get<SayfalanmisYanit<TalepListe>>("/talepler/", { params: filtreler }).then((r) => r.data),

  getir: (id: string) => api.get<TalepDetay>(`/talepler/${id}`).then((r) => r.data),

  takipNoIleGetir: (takipNo: string) => api.get<TalepDetay>(`/talepler/takip/${takipNo}`).then((r) => r.data),

  haritaNoktalari: (filtreler: { durum?: TalepDurumu; kategori_id?: string } = {}) =>
    api.get<TalepHaritaNoktasi[]>("/talepler/harita", { params: filtreler }).then((r) => r.data),

  dosyaYukle: (talepId: string, dosya: File, dosyaTuru: DosyaTuru) => {
    const form = new FormData();
    form.append("dosya", dosya);
    return api
      .post<TalepDosyasi>(`/talepler/${talepId}/dosya`, form, {
        params: { dosya_turu: dosyaTuru },
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  durumGuncelle: (talepId: string, durum: TalepDurumu, aciklama?: string) =>
    api.put<TalepDetay>(`/talepler/${talepId}/durum`, { durum, aciklama }).then((r) => r.data),

  ata: (talepId: string, personelId: string, not_?: string) =>
    api.post<TalepDetay>(`/talepler/${talepId}/ata`, { personel_id: personelId, not: not_ }).then((r) => r.data),

  coz: (talepId: string, cozumNotu: string) =>
    api.post<TalepDetay>(`/talepler/${talepId}/coz`, { cozum_notu: cozumNotu }).then((r) => r.data),
};
