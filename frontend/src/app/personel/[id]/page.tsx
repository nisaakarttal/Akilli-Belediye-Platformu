"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  MessageSquare,
  NotebookPen,
  RefreshCw,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { DosyaListesi } from "@/components/sikayet/dosya-listesi";
import { DosyaSecici } from "@/components/sikayet/dosya-yukleme";
import { DurumRozeti } from "@/components/sikayet/durum-rozeti";
import { OncelikRozeti } from "@/components/sikayet/oncelik-rozeti";
import { ZamanTuneli } from "@/components/sikayet/zaman-tuneli";
import {
  FadeInStagger,
  StaggerOgesi,
} from "@/components/ui/animasyon";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Etiket } from "@/components/ui/label";
import { Secim } from "@/components/ui/select";
import { MetinAlani } from "@/components/ui/textarea";
import { Uyari } from "@/components/ui/uyari";
import { TamSayfaYukleniyor } from "@/components/ui/yukleniyor";

import { apiHataMesaji } from "@/lib/api/client";
import {
  atananTalepCoz,
  atananTalepDetayGetir,
  atananTalepDosyaYukle,
  atananTalepDurumGuncelle,
  islemNotuEkle,
  vatandasiBilgilendir,
} from "@/lib/api/personel";
import { tarihSaatFormatla } from "@/lib/tarih";
import type { TalepDurumu } from "@/types";

const COZUM_NOTU_MIN_UZUNLUK = 5;

const PERSONEL_DURUM_SECENEKLERI: {
  deger: TalepDurumu;
  etiket: string;
}[] = [
  { deger: "bekliyor", etiket: "Beklemede" },
  { deger: "inceleniyor", etiket: "İşlemde" },
  { deger: "cozuldu", etiket: "Çözüldü" },
  { deger: "kapatildi", etiket: "İptal edildi" },
];

const HaritaSecici = dynamic(
  () =>
    import("@/components/harita/harita-secici").then(
      (mod) => mod.HaritaSecici
    ),
  {
    ssr: false,
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
    queryFn: () => atananTalepDetayGetir(id),
    enabled: Boolean(id),
  });

  const [yeniDurum, setYeniDurum] =
    useState<TalepDurumu>("inceleniyor");

  const [durumAciklamasi, setDurumAciklamasi] =
    useState("");

  const [islemNotu, setIslemNotu] =
    useState("");

  const [mesaj, setMesaj] =
    useState("");

  const [cozumNotu, setCozumNotu] =
    useState("");

  const [sonucDosyalari, setSonucDosyalari] =
    useState<File[]>([]);

  const [islem, setIslem] = useState<
    "durum" | "not" | "mesaj" | "cozum" | null
  >(null);

  const [hata, setHata] =
    useState<string | null>(null);

  function yenile() {
    queryClient.invalidateQueries({
      queryKey: ["personel-talep", id],
    });

    queryClient.invalidateQueries({
      queryKey: ["atanan-talepler"],
    });

    queryClient.invalidateQueries({
      queryKey: ["personel-dashboard"],
    });
  }

  async function durumGuncelle(e: FormEvent) {
    e.preventDefault();

    setHata(null);
    setIslem("durum");

    try {
      await atananTalepDurumGuncelle(
        id,
        yeniDurum,
        durumAciklamasi.trim() || undefined
      );

      setDurumAciklamasi("");
      yenile();

      toast.success(
        "Talep durumu güncellendi."
      );
    } catch (err) {
      setHata(apiHataMesaji(err));
    } finally {
      setIslem(null);
    }
  }

  async function talebiCoz(e: FormEvent) {
    e.preventDefault();

    setHata(null);
    setIslem("cozum");

    try {
      await atananTalepCoz(
        id,
        cozumNotu.trim()
      );

      for (const dosya of sonucDosyalari) {
        await atananTalepDosyaYukle(
          id,
          dosya,
          "sonuc_fotografi"
        );
      }

      setCozumNotu("");
      setSonucDosyalari([]);

      yenile();

      toast.success(
        "Talep çözüldü olarak işaretlendi."
      );
    } catch (err) {
      setHata(apiHataMesaji(err));
    } finally {
      setIslem(null);
    }
  }

  async function notEkle(e: FormEvent) {
    e.preventDefault();

    setHata(null);
    setIslem("not");

    try {
      await islemNotuEkle(
        id,
        islemNotu.trim()
      );

      setIslemNotu("");
      yenile();

      toast.success(
        "İşlem notu eklendi. Bu not vatandaşa gösterilmez."
      );
    } catch (err) {
      setHata(apiHataMesaji(err));
    } finally {
      setIslem(null);
    }
  }

  async function bilgilendir(e: FormEvent) {
    e.preventDefault();

    setHata(null);
    setIslem("mesaj");

    try {
      await vatandasiBilgilendir(
        id,
        mesaj.trim()
      );

      setMesaj("");
      yenile();

      toast.success(
        "Bilgilendirme vatandaşa gönderildi."
      );
    } catch (err) {
      setHata(apiHataMesaji(err));
    } finally {
      setIslem(null);
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/personel"
        className="inline-flex items-center gap-1.5 text-sm text-metin-ikincil hover:text-birincil-600"
      >
        <ArrowLeft size={16} />
        Atanan Taleplere Dön
      </Link>

      {isLoading && (
        <TamSayfaYukleniyor />
      )}

      {isError && (
        <Uyari tur="hata">
          Talep bulunamadı veya bu talep
          güncel olarak size atanmamış.
        </Uyari>
      )}

      {hata && (
        <Uyari tur="hata">
          {hata}
        </Uyari>
      )}

      {talep && (
        <FadeInStagger className="space-y-6">
          <StaggerOgesi>
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-metin-ikincil">
                      {talep.takip_no}
                    </p>

                    <CardTitle>
                      {talep.baslik}
                    </CardTitle>
                  </div>

                  <div className="flex gap-2">
                    <DurumRozeti
                      durum={talep.durum}
                    />

                    <OncelikRozeti
                      oncelik={talep.oncelik}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-metin-ikincil">
                  {talep.aciklama}
                </p>

                <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-metin-ikincil">
                      Talep Sahibi
                    </p>

                    <p>
                      {talep.olusturan.ad}{" "}
                      {talep.olusturan.soyad}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-metin-ikincil">
                      Kategori
                    </p>

                    <p>
                      {talep.kategori.ad}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-metin-ikincil">
                      Öncelik
                    </p>

                    <p className="capitalize">
                      {talep.oncelik}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-metin-ikincil">
                      Oluşturulma
                    </p>

                    <p>
                      {tarihSaatFormatla(
                        talep.olusturulma_tarihi
                      )}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-metin-ikincil">
                      Sorumlu Departman
                    </p>

                    <p>
                      {
                        talep.kategori
                          .sorumlu_departman
                      }
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs text-metin-ikincil">
                      Adres
                    </p>

                    <p>
                      {talep.mahalle.ad}
                      {talep.adres_detay
                        ? ` · ${talep.adres_detay}`
                        : ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerOgesi>

          <StaggerOgesi>
            <div className="grid gap-6 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <RefreshCw size={18} />
                    Talep Yönetimi
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <form
                    onSubmit={durumGuncelle}
                    className="space-y-3"
                  >
                    <div>
                      <Etiket htmlFor="durum">
                        Durum
                      </Etiket>

                      <Secim
                        id="durum"
                        value={yeniDurum}
                        onChange={(e) =>
                          setYeniDurum(
                            e.target
                              .value as TalepDurumu
                          )
                        }
                      >
                        {PERSONEL_DURUM_SECENEKLERI.map(
                          (secenek) => (
                            <option
                              key={
                                secenek.deger
                              }
                              value={
                                secenek.deger
                              }
                            >
                              {
                                secenek.etiket
                              }
                            </option>
                          )
                        )}
                      </Secim>
                    </div>

                    <div>
                      <Etiket htmlFor="durum-aciklama">
                        Güncelleme Açıklaması
                      </Etiket>

                      <MetinAlani
                        id="durum-aciklama"
                        value={
                          durumAciklamasi
                        }
                        onChange={(e) =>
                          setDurumAciklamasi(
                            e.target.value
                          )
                        }
                        placeholder="Vatandaşın zaman tünelinde görülebilecek güncelleme..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={islem !== null}
                      className="gap-2"
                    >
                      {islem ===
                        "durum" && (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      )}

                      Güncelle
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle2
                      size={18}
                    />
                    Talebi Çöz
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <form
                    onSubmit={talebiCoz}
                    className="space-y-3"
                  >
                    <div>
                      <Etiket htmlFor="cozum-notu">
                        Çözüm Açıklaması
                      </Etiket>

                      <MetinAlani
                        id="cozum-notu"
                        value={cozumNotu}
                        onChange={(e) =>
                          setCozumNotu(
                            e.target.value
                          )
                        }
                        placeholder="Yapılan çözümü açıklayın..."
                        required
                      />
                    </div>

                    <div>
                      <Etiket>
                        Sonuç Fotoğrafı
                      </Etiket>

                      <DosyaSecici
                        dosyalar={
                          sonucDosyalari
                        }
                        onDegistir={
                          setSonucDosyalari
                        }
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={
                        islem !== null ||
                        cozumNotu.trim()
                          .length <
                          COZUM_NOTU_MIN_UZUNLUK
                      }
                      className="gap-2"
                    >
                      {islem ===
                        "cozum" && (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      )}

                      Çözüldü Olarak İşaretle
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <NotebookPen
                      size={18}
                    />
                    İşlem Notu
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <form
                    onSubmit={notEkle}
                    className="space-y-3"
                  >
                    <div>
                      <Etiket htmlFor="islem-notu">
                        Personel İç Notu
                      </Etiket>

                      <MetinAlani
                        id="islem-notu"
                        value={islemNotu}
                        onChange={(e) =>
                          setIslemNotu(
                            e.target.value
                          )
                        }
                        placeholder="Yalnızca personel/admin için iç not..."
                        required
                      />
                    </div>

                    <p className="text-xs text-metin-ikincil">
                      Bu not vatandaş
                      panelinde ve public
                      takip ekranında
                      gösterilmez.
                    </p>

                    <Button
                      type="submit"
                      disabled={
                        islem !== null ||
                        islemNotu.trim()
                          .length < 2
                      }
                      className="gap-2"
                    >
                      {islem === "not" && (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      )}

                      Not Ekle
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare
                      size={18}
                    />
                    Vatandaşı Bilgilendir
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <form
                    onSubmit={bilgilendir}
                    className="space-y-3"
                  >
                    <div>
                      <Etiket htmlFor="mesaj">
                        Mesaj
                      </Etiket>

                      <MetinAlani
                        id="mesaj"
                        value={mesaj}
                        onChange={(e) =>
                          setMesaj(
                            e.target.value
                          )
                        }
                        placeholder="Vatandaşa gönderilecek bilgilendirme..."
                        required
                      />
                    </div>

                    <p className="text-xs text-metin-ikincil">
                      Bu mesaj bildirim
                      olarak gönderilir ve
                      vatandaşın talep
                      geçmişinde görünür.
                    </p>

                    <Button
                      type="submit"
                      disabled={
                        islem !== null ||
                        mesaj.trim().length <
                          2
                      }
                      className="gap-2"
                    >
                      {islem ===
                        "mesaj" && (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      )}

                      Mesaj Gönder
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </StaggerOgesi>

          <StaggerOgesi>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin size={18} />
                  Konum
                </CardTitle>
              </CardHeader>

              <CardContent>
                <HaritaSecici
                  enlem={talep.enlem}
                  boylam={talep.boylam}
                  saltOkunur
                />
              </CardContent>
            </Card>
          </StaggerOgesi>

          <StaggerOgesi>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Ekler
                </CardTitle>
              </CardHeader>

              <CardContent>
                <DosyaListesi
                  dosyalar={
                    talep.dosyalar
                  }
                />
              </CardContent>
            </Card>
          </StaggerOgesi>

          <StaggerOgesi>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Talep Geçmişi
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ZamanTuneli
                  gecmis={
                    talep.durum_gecmisi
                  }
                />
              </CardContent>
            </Card>
          </StaggerOgesi>
        </FadeInStagger>
      )}
    </div>
  );
}