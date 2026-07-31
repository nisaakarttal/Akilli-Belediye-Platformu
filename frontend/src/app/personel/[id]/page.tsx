"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Loader2, MapPin, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type FormEvent } from "react";

import { DosyaListesi } from "@/components/sikayet/dosya-listesi";
import { DosyaSecici } from "@/components/sikayet/dosya-yukleme";
import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
import { ZamanTuneli } from "@/components/sikayet/zaman-tuneli";
import { FadeInStagger, StaggerOgesi } from "@/components/ui/animasyon";
import { Button } from "@/components/ui/button";
import { Kart, KartBaslik, KartBasligi, KartIcerik } from "@/components/ui/card";
import { Etiket } from "@/components/ui/label";
import { Secim } from "@/components/ui/select";
import { MetinAlani } from "@/components/ui/textarea";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";
import { DURUM_GUNCELLEME_SECENEKLERI } from "@/constants/talep";
import { apiHataMesaji } from "@/lib/api";
import { taleplerApi } from "@/lib/api/talepler";
import { tarihSaatFormatla } from "@/lib/tarih";
import type { TalepDurumu } from "@/types";

/** "Talebi Çöz" formundaki çözüm notu için minimum karakter uzunluğu. */
const COZUM_NOTU_MIN_UZUNLUK = 5;

const HaritaSecici = dynamic(
  () => import("@/components/harita/harita-secici").then((mod) => mod.HaritaSecici),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-full animate-pulse items-center justify-center rounded-lg bg-black/5 text-sm text-metin-ikincil dark:bg-white/5">
        Harita yükleniyor...
      </div>
    ),
  }
);

export default function PersonelTalepDetaySayfasi() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: talep,
    isLoading,
    isError,
  } = useQuery({
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
      <Link
        href="/personel"
        className="inline-flex items-center gap-1.5 text-sm text-metin-ikincil transition-colors hover:text-birincil-600"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Atanan Taleplerime Dön
      </Link>

      {isLoading && <TamSayfaYukleniyor />}
      {isError && <Uyari tur="hata">Talep bulunamadı veya bu talebi görüntüleme yetkiniz yok.</Uyari>}

      {talep && (
        <FadeInStagger className="space-y-6">
          <StaggerOgesi>
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
                    <p className="text-metin">
                      {talep.olusturan.ad} {talep.olusturan.soyad}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-metin-ikincil">Kategori</p>
                    <p className="text-metin">
                      {talep.kategori.ad} ({talep.kategori.sorumlu_departman})
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-metin-ikincil">Mahalle</p>
                    <p className="text-metin">{talep.mahalle.ad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-metin-ikincil">Oluşturulma Tarihi</p>
                    <p className="text-metin">{tarihSaatFormatla(talep.olusturulma_tarihi)}</p>
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
          </StaggerOgesi>

          <StaggerOgesi>
            <div className="grid gap-6 lg:grid-cols-2">
              <Kart>
                <KartBasligi>
                  <KartBaslik className="flex items-center gap-2 text-lg">
                    <RefreshCw size={18} aria-hidden="true" /> Durum Güncelle
                  </KartBaslik>
                </KartBasligi>
                <KartIcerik>
                  {durumHatasi && <Uyari tur="hata">{durumHatasi}</Uyari>}
                  <form onSubmit={durumGuncelle} className="space-y-3">
                    <div>
                      <Etiket htmlFor="yeni-durum">Yeni Durum</Etiket>
                      <Secim id="yeni-durum" value={yeniDurum} onChange={(e) => setYeniDurum(e.target.value as TalepDurumu)}>
                        {DURUM_GUNCELLEME_SECENEKLERI.map((s) => (
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
                    <Button type="submit" varyant="birincil" disabled={durumGuncelleniyor} className="gap-2">
                      {durumGuncelleniyor && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
                      {durumGuncelleniyor ? "Güncelleniyor..." : "Durumu Güncelle"}
                    </Button>
                  </form>
                </KartIcerik>
              </Kart>

              <Kart>
                <KartBasligi>
                  <KartBaslik className="flex items-center gap-2 text-lg">
                    <CheckCircle2 size={18} aria-hidden="true" /> Talebi Çöz
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
                    <Button
                      type="submit"
                      varyant="birincil"
                      disabled={cozuluyor || cozumNotu.length < COZUM_NOTU_MIN_UZUNLUK}
                      className="gap-2"
                    >
                      {cozuluyor && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
                      {cozuluyor ? "Kaydediliyor..." : "Talebi Çözüldü Olarak İşaretle"}
                    </Button>
                  </form>
                </KartIcerik>
              </Kart>
            </div>
          </StaggerOgesi>

          <StaggerOgesi>
            <Kart>
              <KartBasligi>
                <KartBaslik className="flex items-center gap-2 text-lg">
                  <MapPin size={18} aria-hidden="true" /> Konum
                </KartBaslik>
              </KartBasligi>
              <KartIcerik>
                <HaritaSecici enlem={talep.enlem} boylam={talep.boylam} saltOkunur />
              </KartIcerik>
            </Kart>
          </StaggerOgesi>

          <StaggerOgesi>
            <Kart>
              <KartBasligi>
                <KartBaslik className="text-lg">Ekler</KartBaslik>
              </KartBasligi>
              <KartIcerik>
                <DosyaListesi dosyalar={talep.dosyalar} />
              </KartIcerik>
            </Kart>
          </StaggerOgesi>

          <StaggerOgesi>
            <Kart>
              <KartBasligi>
                <KartBaslik className="text-lg">Zaman Tüneli</KartBaslik>
              </KartBasligi>
              <KartIcerik>
                <ZamanTuneli gecmis={talep.durum_gecmisi} />
              </KartIcerik>
            </Kart>
          </StaggerOgesi>
        </FadeInStagger>
      )}
    </div>
  );
}
