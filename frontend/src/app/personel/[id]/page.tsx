"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, MapPin, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { HaritaSecici } from "@/components/harita/harita-secici";
import { DosyaListesi } from "@/components/sikayet/dosya-listesi";
import { DosyaSecici } from "@/components/sikayet/dosya-yukleme";
import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
import { ZamanTuneli } from "@/components/sikayet/zaman-tuneli";
import { Dugme } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Etiket } from "@/components/ui/label";
import { Secim } from "@/components/ui/select";
import { MetinAlani } from "@/components/ui/textarea";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { apiHataMesaji } from "@/lib/api";
import { taleplerApi } from "@/lib/api/talepler";
import type { TalepDurumu } from "@/types";

const DURUM_SECENEKLERI: { deger: TalepDurumu; etiket: string }[] = [
  { deger: "bekliyor", etiket: "Bekliyor" },
  { deger: "inceleniyor", etiket: "İnceleniyor" },
  { deger: "atandi", etiket: "Atandı" },
  { deger: "cozuldu", etiket: "Çözüldü" },
  { deger: "kapatildi", etiket: "Kapatıldı" },
];

function tarihiBicimlendir(isoTarih: string) {
  return new Date(isoTarih).toLocaleString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PersonelTalepDetaySayfasi() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: talep, isLoading, isError } = useQuery({
    queryKey: ["personel-talep", id],
    queryFn: () => taleplerApi.getir(id),
  });

  const [yeniDurum, setYeniDurum] = useState<TalepDurumu>("inceleniyor");
  const [durumAciklamasi, setDurumAciklamasi] = useState("");
  const [durumGuncelleniyor, setDurumGuncelleniyor] = useState(false);
  const [durumHatasi, setDurumHatasi] = useState<string | null>(null);

  const [cozumNotu, setCozumNotu] = useState("");
  const [sonucDosyalari, setSonucDosyalari] = useState<File[]>([]);
  const [cozuluyor, setCozuluyor] = useState(false);
  const [cozumHatasi, setCozumHatasi] = useState<string | null>(null);

  function yenile() {
    queryClient.invalidateQueries({ queryKey: ["personel-talep", id] });
    queryClient.invalidateQueries({ queryKey: ["atanan-talepler"] });
  }

  async function durumGuncelle(e: FormEvent) {
    e.preventDefault();
    setDurumHatasi(null);
    setDurumGuncelleniyor(true);
    try {
      await taleplerApi.durumGuncelle(id, yeniDurum, durumAciklamasi || undefined);
      setDurumAciklamasi("");
      yenile();
    } catch (hata) {
      setDurumHatasi(apiHataMesaji(hata));
    } finally {
      setDurumGuncelleniyor(false);
    }
  }

  async function talebiCoz(e: FormEvent) {
    e.preventDefault();
    setCozumHatasi(null);
    setCozuluyor(true);
    try {
      await taleplerApi.coz(id, cozumNotu);
      for (const dosya of sonucDosyalari) {
        await taleplerApi.dosyaYukle(id, dosya, "sonuc_fotografi");
      }
      setCozumNotu("");
      setSonucDosyalari([]);
      yenile();
    } catch (hata) {
      setCozumHatasi(apiHataMesaji(hata));
    } finally {
      setCozuluyor(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/personel" className="inline-flex items-center gap-1.5 text-sm text-metin-ikincil hover:text-birincil-600">
        <ArrowLeft size={16} /> Atanan Taleplerime Dön
      </Link>

      {isLoading && <TamSayfaYukleniyor />}
      {isError && <Uyari tur="hata">Talep bulunamadı veya bu talebi görüntüleme yetkiniz yok.</Uyari>}

      {talep && (
        <>
          <Kart>
            <KartBasligi>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-metin-ikincil">{talep.takip_no}</p>
                  <KartBaslik>{talep.baslik}</KartBaslik>
                </div>
                <div className="flex gap-2">
                  <DurumRozeti durum={talep.durum} />
                  <OncelikRozeti oncelik={talep.oncelik} />
                </div>
              </div>
            </KartBasligi>
            <KartIcerik className="space-y-4">
              <p className="text-sm text-metin-ikincil">{talep.aciklama}</p>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs text-metin-ikincil">Bildiren</p>
                  <p className="text-metin">{talep.olusturan.ad} {talep.olusturan.soyad}</p>
                </div>
                <div>
                  <p className="text-xs text-metin-ikincil">Kategori</p>
                  <p className="text-metin">{talep.kategori.ad} ({talep.kategori.sorumlu_departman})</p>
                </div>
                <div>
                  <p className="text-xs text-metin-ikincil">Mahalle</p>
                  <p className="text-metin">{talep.mahalle.ad}</p>
                </div>
                <div>
                  <p className="text-xs text-metin-ikincil">Oluşturulma Tarihi</p>
                  <p className="text-metin">{tarihiBicimlendir(talep.olusturulma_tarihi)}</p>
                </div>
                {talep.adres_detay && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-metin-ikincil">Adres Detayı</p>
                    <p className="text-metin">{talep.adres_detay}</p>
                  </div>
                )}
              </div>
            </KartIcerik>
          </Kart>

          <div className="grid gap-6 lg:grid-cols-2">
            <Kart>
              <KartBasligi>
                <KartBaslik className="flex items-center gap-2 text-lg">
                  <RefreshCw size={18} /> Durum Güncelle
                </KartBaslik>
              </KartBasligi>
              <KartIcerik>
                {durumHatasi && <Uyari tur="hata">{durumHatasi}</Uyari>}
                <form onSubmit={durumGuncelle} className="space-y-3">
                  <div>
                    <Etiket htmlFor="yeni-durum">Yeni Durum</Etiket>
                    <Secim id="yeni-durum" value={yeniDurum} onChange={(e) => setYeniDurum(e.target.value as TalepDurumu)}>
                      {DURUM_SECENEKLERI.map((s) => (
                        <option key={s.deger} value={s.deger}>
                          {s.etiket}
                        </option>
                      ))}
                    </Secim>
                  </div>
                  <div>
                    <Etiket htmlFor="durum-aciklama">Açıklama (İsteğe Bağlı)</Etiket>
                    <MetinAlani
                      id="durum-aciklama"
                      value={durumAciklamasi}
                      onChange={(e) => setDurumAciklamasi(e.target.value)}
                      placeholder="Vatandaşa iletilecek kısa bir not..."
                    />
                  </div>
                  <Dugme type="submit" varyant="birincil" disabled={durumGuncelleniyor}>
                    {durumGuncelleniyor ? "Güncelleniyor..." : "Durumu Güncelle"}
                  </Dugme>
                </form>
              </KartIcerik>
            </Kart>

            <Kart>
              <KartBasligi>
                <KartBaslik className="flex items-center gap-2 text-lg">
                  <CheckCircle2 size={18} /> Talebi Çöz
                </KartBaslik>
              </KartBasligi>
              <KartIcerik>
                {cozumHatasi && <Uyari tur="hata">{cozumHatasi}</Uyari>}
                <form onSubmit={talebiCoz} className="space-y-3">
                  <div>
                    <Etiket htmlFor="cozum-notu">Çözüm Notu</Etiket>
                    <MetinAlani
                      id="cozum-notu"
                      value={cozumNotu}
                      onChange={(e) => setCozumNotu(e.target.value)}
                      placeholder="Yapılan işlemi açıklayınız..."
                      required
                    />
                  </div>
                  <div>
                    <Etiket>Sonuç Fotoğrafı</Etiket>
                    <DosyaSecici dosyalar={sonucDosyalari} onDegistir={setSonucDosyalari} />
                  </div>
                  <Dugme type="submit" varyant="birincil" disabled={cozuluyor || cozumNotu.length < 5}>
                    {cozuluyor ? "Kaydediliyor..." : "Talebi Çözüldü Olarak İşaretle"}
                  </Dugme>
                </form>
              </KartIcerik>
            </Kart>
          </div>

          <Kart>
            <KartBasligi>
              <KartBaslik className="flex items-center gap-2 text-lg">
                <MapPin size={18} /> Konum
              </KartBaslik>
            </KartBasligi>
            <KartIcerik>
              <HaritaSecici enlem={talep.enlem} boylam={talep.boylam} onDegistir={() => {}} saltOkunur />
            </KartIcerik>
          </Kart>

          <Kart>
            <KartBasligi>
              <KartBaslik className="text-lg">Ekler</KartBaslik>
            </KartBasligi>
            <KartIcerik>
              <DosyaListesi dosyalar={talep.dosyalar} />
            </KartIcerik>
          </Kart>

          <Kart>
            <KartBasligi>
              <KartBaslik className="text-lg">Zaman Tüneli</KartBaslik>
            </KartBasligi>
            <KartIcerik>
              <ZamanTuneli gecmis={talep.durum_gecmisi} />
            </KartIcerik>
          </Kart>
        </>
      )}
    </div>
  );
}
