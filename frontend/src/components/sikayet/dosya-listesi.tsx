import { File, FileAudio, FileText, Image as ImageIcon, Video } from "lucide-react";

import { dosyaUrlOlustur } from "@/lib/api";
import type { TalepDosyasi } from "@/types";

const TUR_SIMGESI: Record<string, typeof File> = {
  fotograf: ImageIcon,
  sonuc_fotografi: ImageIcon,
  video: Video,
  ses: FileAudio,
  belge: FileText,
};

const TUR_ETIKETI: Record<string, string> = {
  fotograf: "Fotoğraf",
  sonuc_fotografi: "Sonuç Fotoğrafı",
  video: "Video",
  ses: "Ses Kaydı",
  belge: "Belge",
};

export function DosyaListesi({ dosyalar }: { dosyalar: TalepDosyasi[] }) {
  if (dosyalar.length === 0) {
    return <p className="text-sm text-metin-ikincil">Bu talebe henüz dosya eklenmemiş.</p>;
  }

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {dosyalar.map((dosya) => {
        const Simge = TUR_SIMGESI[dosya.dosya_turu] ?? File;
        return (
          <li key={dosya.id}>
            <a
              href={dosyaUrlOlustur(dosya.dosya_yolu)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-black/5 px-3 py-2 text-sm transition-colors hover:bg-birincil-600/10 dark:bg-white/5"
            >
              <Simge size={16} className="shrink-0 text-birincil-500" />
              <span className="min-w-0 flex-1 truncate">{dosya.orijinal_ad}</span>
              <span className="shrink-0 text-xs text-metin-ikincil">{TUR_ETIKETI[dosya.dosya_turu]}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
