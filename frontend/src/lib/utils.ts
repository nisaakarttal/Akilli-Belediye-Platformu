import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function baslangicHarfleri(ad: string, soyad: string): string {
  return `${ad.charAt(0)}${soyad.charAt(0)}`.toUpperCase();
}

const gorecelizamanBirimleri: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
];

const rtf = new Intl.RelativeTimeFormat("tr", { numeric: "auto" });

export function goreceliZaman(tarih: string): string {
  const saniyeFarki = (new Date(tarih).getTime() - Date.now()) / 1000;
  for (const [birim, esik] of gorecelizamanBirimleri) {
    if (Math.abs(saniyeFarki) >= esik) {
      return rtf.format(Math.round(saniyeFarki / esik), birim);
    }
  }
  return rtf.format(Math.round(saniyeFarki), "second");
}

export function tarihFormatla(tarih: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(tarih));
}

export function tarihSaatFormatla(tarih: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(tarih));
}
