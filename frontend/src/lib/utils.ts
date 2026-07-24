import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind sınıflarını çakışmaları çözerek birleştirir. */
export function cn(...girdiler: ClassValue[]) {
  return twMerge(clsx(girdiler));
}
