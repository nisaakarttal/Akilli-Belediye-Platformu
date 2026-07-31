import { apiClient } from "./client";
import type {
  SayfalanmisYanit,
  DosyaTuru,
  Memnuniyet,
  TalepDetay,
  TalepDurumu,
  TalepFiltreleri,
  TalepHaritaNoktasi,
  TalepListe,
  TalepOlusturIstegi,
} from "@/types";

/** Vatandaşsa yalnızca kendi talepleri, personel/admin ise tümü döner (backend rolüne göre filtreler). */
export async function taleplerListele(filtreler: TalepFiltreleri = {}): Promise<SayfalanmisYanit<TalepListe>> {
  const { data } = await apiClient.get<SayfalanmisYanit<TalepListe>>("/talepler", { params: filtreler });
  return data;
}

export async function talepOlustur(istek: TalepOlusturIstegi): Promise<TalepDetay> {
  const { data } = await apiClient.post<TalepDetay>("/talepler", istek);
  return data;
}

export async function talepDetayGetir(id: string): Promise<TalepDetay> {
  const { data } = await apiClient.get<TalepDetay>(`/talepler/${id}`);
  return data;
}

export async function takipNoIleSorgula(takipNo: string): Promise<TalepDetay> {
  const { data } = await apiClient.get<TalepDetay>(`/talepler/takip/${takipNo}`);
  return data;
}

export async function talepDosyaYukle(id: string, dosya: File, dosyaTuru: DosyaTuru = "fotograf"): Promise<void> {
  const form = new FormData();
  form.append("dosya", dosya);
  await apiClient.post(`/talepler/${id}/dosya`, form, {
    params: { dosya_turu: dosyaTuru },
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function memnuniyetBildir(id: string, puan: number, yorum?: string): Promise<Memnuniyet> {
  const { data } = await apiClient.post<Memnuniyet>(`/talepler/${id}/memnuniyet`, { puan, yorum });
  return data;
}

export async function memnuniyetGetir(id: string): Promise<Memnuniyet> {
  const { data } = await apiClient.get<Memnuniyet>(`/talepler/${id}/memnuniyet`);
  return data;
}

export async function gecikenTalepleriListele(): Promise<TalepListe[]> {
  const { data } = await apiClient.get<TalepListe[]>("/talepler/gecikenler");
  return data;
}

export async function talepDurumGuncelle(id: string, durum: TalepDurumu, aciklama?: string): Promise<TalepDetay> {
  const { data } = await apiClient.put<TalepDetay>(`/talepler/${id}/durum`, { durum, aciklama });
  return data;
}

export async function talepAta(id: string, personelId: string, not_?: string): Promise<TalepDetay> {
  const { data } = await apiClient.post<TalepDetay>(`/talepler/${id}/ata`, {
    personel_id: personelId,
    not: not_,
  });
  return data;
}

export async function talepCoz(id: string, cozumNotu: string): Promise<TalepDetay> {
  const { data } = await apiClient.post<TalepDetay>(`/talepler/${id}/coz`, { cozum_notu: cozumNotu });
  return data;
}

export async function taleplerHaritaVerisi(): Promise<TalepHaritaNoktasi[]> {
  const { data } = await apiClient.get<TalepHaritaNoktasi[]>("/talepler/harita");
  return data;
}
