"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Paperclip, Send, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField, Input } from "@/components/ui/input";
import { kategorileriListele } from "@/lib/api/kategoriler";
import { mahalleleriListele } from "@/lib/api/konum";
import { talepOlustur, talepDosyaYukle } from "@/lib/api/talepler";
import { apiHataMesaji } from "@/lib/api/client";

const Harita = dynamic(() => import("@/components/features/talepler/harita"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Harita yükleniyor…</div>,
});

const semasi = z.object({
  baslik: z.string().min(5, "En az 5 karakter olmalı.").max(200),
  aciklama: z.string().min(20, "Lütfen sorunu en az 20 karakterle açıklayın.").max(2000),
  kategori_id: z.string().uuid("Bir kategori seçin."),
  mahalle_id: z.string().uuid("Bir mahalle seçin."),
  adres_detay: z.string().optional(),
  konum: z.object({ enlem: z.number(), boylam: z.number() }, { required_error: "Haritadan konum seçin." }),
});

type FormDegerleri = z.infer<typeof semasi>;

export default function TalepOlusturSayfasi() {
  const router = useRouter();
  const [dosyalar, setDosyalar] = useState<File[]>([]);

  const { data: kategoriler } = useQuery({ queryKey: ["kategoriler"], queryFn: kategorileriListele });
  const { data: mahalleler } = useQuery({ queryKey: ["mahalleler"], queryFn: () => mahalleleriListele() });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormDegerleri>({ resolver: zodResolver(semasi) });

  async function gonder(degerler: FormDegerleri) {
    try {
      const talep = await talepOlustur({
        baslik: degerler.baslik,
        aciklama: degerler.aciklama,
        kategori_id: degerler.kategori_id,
        mahalle_id: degerler.mahalle_id,
        adres_detay: degerler.adres_detay || null,
        enlem: degerler.konum.enlem,
        boylam: degerler.konum.boylam,
      });

      for (const dosya of dosyalar) {
        await talepDosyaYukle(talep.id, dosya, "fotograf").catch(() =>
          toast.warning(`"${dosya.name}" yüklenemedi, talebiniz yine de oluşturuldu.`)
        );
      }

      toast.success(`Talebiniz oluşturuldu — takip no: #${talep.takip_no}`);
      router.push(`/panel/taleplerim/${talep.id}`);
    } catch (hata) {
      toast.error(apiHataMesaji(hata, "Talep oluşturulurken bir sorun oluştu."));
    }
  }

  function dosyaSec(e: React.ChangeEvent<HTMLInputElement>) {
    const secilenler = Array.from(e.target.files ?? []);
    setDosyalar((mevcut) => [...mevcut, ...secilenler].slice(0, 5));
    e.target.value = "";
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-xl font-bold text-foreground">Yeni Talep Oluştur</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Karşılaştığınız sorunu ayrıntılı anlatın, harita üzerinde konumunu işaretleyin.
      </p>

      <form onSubmit={handleSubmit(gonder)} className="mt-6 space-y-5" noValidate>
        <Card>
          <CardHeader>
            <CardTitle>Talep Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField label="Başlık" htmlFor="baslik" error={errors.baslik?.message}>
              <Input id="baslik" placeholder="Örn. Park Aydınlatma Arızası" {...register("baslik")} />
            </FormField>

            <FormField label="Açıklama" htmlFor="aciklama" error={errors.aciklama?.message}>
              <textarea
                id="aciklama"
                rows={5}
                className="w-full rounded-xl border border-border bg-surface p-3.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
                placeholder="Sorunu, konumu ve varsa tekrar sıklığını detaylandırın…"
                {...register("aciklama")}
              />
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Kategori" htmlFor="kategori_id" error={errors.kategori_id?.message}>
                <select
                  id="kategori_id"
                  className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
                  {...register("kategori_id")}
                  defaultValue=""
                >
                  <option value="" disabled>Seçin…</option>
                  {kategoriler?.map((k) => (
                    <option key={k.id} value={k.id}>{k.ad}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Mahalle" htmlFor="mahalle_id" error={errors.mahalle_id?.message}>
                <select
                  id="mahalle_id"
                  className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
                  {...register("mahalle_id")}
                  defaultValue=""
                >
                  <option value="" disabled>Seçin…</option>
                  {mahalleler?.map((m) => (
                    <option key={m.id} value={m.id}>{m.ad}</option>
                  ))}
                </select>
              </FormField>
            </div>

            <FormField label="Adres Detayı (isteğe bağlı)" htmlFor="adres_detay">
              <Input id="adres_detay" placeholder="Örn. Atatürk Parkı, Merkez İşe girişi yanı" {...register("adres_detay")} />
            </FormField>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-700" aria-hidden />
                Konum Seçin
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs text-muted-foreground">Sorunun yerini işaretlemek için haritaya tıklayın.</p>
            <div className="h-80 overflow-hidden rounded-2xl border border-border">
              <Controller
                name="konum"
                control={control}
                render={({ field }) => (
                  <Harita mod="sec" deger={field.value ?? null} onDegisim={field.onChange} />
                )}
              />
            </div>
            {errors.konum && <p className="mt-2 text-xs text-danger">{errors.konum.message as string}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <span className="flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-primary-700" aria-hidden />
                Fotoğraf Ekle (en fazla 5)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground hover:border-primary-300 hover:text-primary-700">
              <Paperclip className="h-5 w-5" aria-hidden />
              Dosya seçmek için tıklayın
              <input type="file" accept="image/*" multiple className="hidden" onChange={dosyaSec} />
            </label>
            {dosyalar.length > 0 && (
              <ul className="mt-3 space-y-2">
                {dosyalar.map((dosya, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                    <span className="truncate">{dosya.name}</span>
                    <button
                      type="button"
                      onClick={() => setDosyalar((d) => d.filter((_, idx) => idx !== i))}
                      aria-label={`${dosya.name} dosyasını kaldır`}
                      className="text-muted-foreground hover:text-danger"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          <Send className="h-4 w-4" aria-hidden />
          Talebi Gönder
        </Button>
      </form>
    </div>
  );
}
