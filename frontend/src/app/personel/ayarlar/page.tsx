"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, LockKeyhole, Mail, Palette, Save, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { sifreDegistir } from "@/lib/api/auth";
import { kullaniciGuncelle } from "@/lib/api/kullanicilar";
import { useAuth } from "@/providers/auth-provider";
import type { KullaniciGuncelleIstegi } from "@/types";

function hataMesaji(hata: unknown, varsayilan: string) {
  const aday = hata as { response?: { data?: { detail?: string } } };
  return aday?.response?.data?.detail || varsayilan;
}

export default function PersonelAyarlarSayfasi() {
  const { kullanici } = useAuth();
  const queryClient = useQueryClient();

  const [profil, setProfil] = useState({ ad: "", soyad: "", telefon: "", adres: "" });
  const [sifre, setSifre] = useState({ mevcut: "", yeni: "", tekrar: "" });

  useEffect(() => {
    if (!kullanici) return;
    setProfil({
      ad: kullanici.ad ?? "",
      soyad: kullanici.soyad ?? "",
      telefon: kullanici.telefon ?? "",
      adres: kullanici.adres ?? "",
    });
  }, [kullanici]);

  const profilMutation = useMutation({
    mutationFn: (istek: KullaniciGuncelleIstegi) => {
      if (!kullanici) throw new Error("Kullanıcı bilgisi bulunamadı.");
      return kullaniciGuncelle(kullanici.id, istek);
    },
    onSuccess: (guncelKullanici) => {
      queryClient.setQueryData(["ben"], guncelKullanici);
      toast.success("Hesap bilgileriniz güncellendi.");
    },
    onError: (hata) => toast.error(hataMesaji(hata, "Profil güncellenemedi.")),
  });

  const sifreMutation = useMutation({
    mutationFn: () => sifreDegistir(sifre.mevcut, sifre.yeni),
    onSuccess: () => {
      setSifre({ mevcut: "", yeni: "", tekrar: "" });
      toast.success("Şifreniz başarıyla değiştirildi.");
    },
    onError: (hata) => toast.error(hataMesaji(hata, "Şifre değiştirilemedi.")),
  });

  if (!kullanici) return null;

  function profilKaydet(event: FormEvent) {
    event.preventDefault();
    const ad = profil.ad.trim();
    const soyad = profil.soyad.trim();
    const telefon = profil.telefon.trim();

    if (ad.length < 2 || soyad.length < 2) {
      toast.error("Ad ve soyad en az 2 karakter olmalıdır.");
      return;
    }
    if (!/^05\d{9}$/.test(telefon)) {
      toast.error("Telefon numarası 05XXXXXXXXX formatında olmalıdır.");
      return;
    }

    profilMutation.mutate({
      ad,
      soyad,
      telefon,
      adres: profil.adres.trim() || undefined,
    });
  }

  function sifreKaydet(event: FormEvent) {
    event.preventDefault();
    if (sifre.yeni.length < 8 || !/[A-Za-z]/.test(sifre.yeni) || !/\d/.test(sifre.yeni)) {
      toast.error("Yeni şifre en az 8 karakter, bir harf ve bir rakam içermelidir.");
      return;
    }
    if (sifre.yeni !== sifre.tekrar) {
      toast.error("Yeni şifreler eşleşmiyor.");
      return;
    }
    sifreMutation.mutate();
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">Hesap bilgilerinizi, şifrenizi ve panel görünümünüzü yönetin.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5" /> Hesap Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profilKaydet} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Alan etiket="Ad" htmlFor="personel-ad">
                <Input id="personel-ad" value={profil.ad} onChange={(e) => setProfil((p) => ({ ...p, ad: e.target.value }))} maxLength={100} />
              </Alan>
              <Alan etiket="Soyad" htmlFor="personel-soyad">
                <Input id="personel-soyad" value={profil.soyad} onChange={(e) => setProfil((p) => ({ ...p, soyad: e.target.value }))} maxLength={100} />
              </Alan>
              <Alan etiket="Telefon" htmlFor="personel-telefon">
                <Input id="personel-telefon" value={profil.telefon} onChange={(e) => setProfil((p) => ({ ...p, telefon: e.target.value }))} placeholder="05XXXXXXXXX" inputMode="tel" maxLength={11} />
              </Alan>
              <Alan etiket="E-posta" htmlFor="personel-eposta">
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input id="personel-eposta" value={kullanici.e_posta} disabled className="pl-9" />
                </div>
              </Alan>
              <Alan etiket="Departman" htmlFor="personel-departman">
                <div className="relative">
                  <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Input id="personel-departman" value={kullanici.departman || "Tanımlanmamış"} disabled className="pl-9" />
                </div>
              </Alan>
              <Alan etiket="Adres" htmlFor="personel-adres">
                <Input id="personel-adres" value={profil.adres} onChange={(e) => setProfil((p) => ({ ...p, adres: e.target.value }))} maxLength={500} placeholder="Adres bilgisi" />
              </Alan>
            </div>
            <div className="flex justify-end">
              <Button type="submit" loading={profilMutation.isPending}>
                <Save className="h-4 w-4" /> Değişiklikleri Kaydet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LockKeyhole className="h-5 w-5" /> Şifre Değiştir</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={sifreKaydet} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Alan etiket="Mevcut Şifre" htmlFor="mevcut-sifre">
                <Input id="mevcut-sifre" type="password" autoComplete="current-password" value={sifre.mevcut} onChange={(e) => setSifre((p) => ({ ...p, mevcut: e.target.value }))} required />
              </Alan>
              <Alan etiket="Yeni Şifre" htmlFor="yeni-sifre">
                <Input id="yeni-sifre" type="password" autoComplete="new-password" value={sifre.yeni} onChange={(e) => setSifre((p) => ({ ...p, yeni: e.target.value }))} required />
              </Alan>
              <Alan etiket="Yeni Şifre Tekrar" htmlFor="yeni-sifre-tekrar">
                <Input id="yeni-sifre-tekrar" type="password" autoComplete="new-password" value={sifre.tekrar} onChange={(e) => setSifre((p) => ({ ...p, tekrar: e.target.value }))} required />
              </Alan>
            </div>
            <p className="text-xs text-muted-foreground">Şifre en az 8 karakter, bir harf ve bir rakam içermelidir.</p>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" loading={sifreMutation.isPending}>Şifreyi Değiştir</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5" /> Görünüm</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Tema</p>
            <p className="text-xs text-muted-foreground">Açık/koyu görünümü değiştirebilirsiniz.</p>
          </div>
          <ThemeToggle />
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">E-posta, departman ve yetki değişiklikleri yönetici tarafından yapılır.</p>
    </div>
  );
}

function Alan({ etiket, htmlFor, children }: { etiket: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">{etiket}</label>
      {children}
    </div>
  );
}
