"use client";

import { FileText, Paperclip, X } from "lucide-react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

interface DosyaSeciciProps {
  dosyalar: File[];
  onDegistir: (dosyalar: File[]) => void;
  className?: string;
}

const KABUL_EDILEN_UZANTILAR = ".jpg,.jpeg,.png,.webp,.mp4,.mov,.webm,.mp3,.wav,.m4a,.pdf,.doc,.docx";
const BAYT_BASINA_MEGABAYT = 1024 * 1024;
const DOSYA_SIMGE_BOYUTU = 16;
const YUKLEME_ALANI_SIMGE_BOYUTU = 18;

const FOTOGRAF_UZANTILARI = ["jpg", "jpeg", "png", "webp"];
const VIDEO_UZANTILARI = ["mp4", "mov", "webm"];
const SES_UZANTILARI = ["mp3", "wav", "m4a", "ogg"];

export function DosyaSecici({ dosyalar, onDegistir, className }: DosyaSeciciProps) {
  const girdiRef = useRef<HTMLInputElement>(null);

  function dosyaEkle(secilenler: FileList | null) {
    if (!secilenler) return;
    onDegistir([...dosyalar, ...Array.from(secilenler)]);
    if (girdiRef.current) girdiRef.current.value = "";
  }

  function dosyaCikar(index: number) {
    onDegistir(dosyalar.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("space-y-3", className)}>
      <button
        type="button"
        onClick={() => girdiRef.current?.click()}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-kenarlik px-4 py-6 text-sm text-metin-ikincil transition-colors hover:border-birincil-500 hover:text-birincil-600"
      >
        <Paperclip size={YUKLEME_ALANI_SIMGE_BOYUTU} aria-hidden="true" />
        Fotoğraf, video, ses veya belge eklemek için tıklayın
      </button>

      <input
        ref={girdiRef}
        type="file"
        multiple
        accept={KABUL_EDILEN_UZANTILAR}
        className="hidden"
        onChange={(e) => dosyaEkle(e.target.files)}
        aria-label="Dosya seç"
      />

      {dosyalar.length > 0 && (
        <ul className="space-y-2">
          {dosyalar.map((dosya, i) => (
            <li
              key={`${dosya.name}-${i}`}
              className="flex items-center justify-between gap-2 rounded-lg bg-black/5 px-3 py-2 text-sm dark:bg-white/5"
            >
              <span className="flex min-w-0 items-center gap-2">
                <FileText size={DOSYA_SIMGE_BOYUTU} className="shrink-0 text-metin-ikincil" aria-hidden="true" />
                <span className="truncate">{dosya.name}</span>
                <span className="shrink-0 text-xs text-metin-ikincil">
                  ({(dosya.size / BAYT_BASINA_MEGABAYT).toFixed(1)} MB)
                </span>
              </span>
              <button
                type="button"
                onClick={() => dosyaCikar(i)}
                className="shrink-0 text-metin-ikincil hover:text-tehlike"
                aria-label={`${dosya.name} dosyasını kaldır`}
              >
                <X size={DOSYA_SIMGE_BOYUTU} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Dosya adının uzantısına göre backend `DosyaTuru` enum değerini tahmin eder. */
export function dosyaTuruTahminEt(dosyaAdi: string): "fotograf" | "video" | "ses" | "belge" {
  const uzanti = dosyaAdi.split(".").pop()?.toLowerCase() ?? "";
  if (FOTOGRAF_UZANTILARI.includes(uzanti)) return "fotograf";
  if (VIDEO_UZANTILARI.includes(uzanti)) return "video";
  if (SES_UZANTILARI.includes(uzanti)) return "ses";
  return "belge";
}
