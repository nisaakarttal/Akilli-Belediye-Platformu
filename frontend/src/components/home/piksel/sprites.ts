import { pikselOlustur } from "./piksel-sprite";

// -----------------------------------------------------------------------
// AĞAÇ (Tree)
// -----------------------------------------------------------------------
export const AGAC_GRID = pikselOlustur(9, 11, [
  [4, 0, 4, 0, 2],
  [3, 1, 5, 1, 2],
  [2, 2, 6, 2, 2],
  [1, 3, 7, 3, 2],
  [2, 4, 6, 4, 2],
  [0, 5, 8, 5, 2],
  [2, 6, 6, 6, 2],
  [4, 7, 4, 9, 1],
  [3, 10, 5, 10, 1],
]);
export const AGAC_PALET = ["#78350F", "#16A34A"];

// -----------------------------------------------------------------------
// BULUT (Cloud)
// -----------------------------------------------------------------------
export const BULUT_GRID = pikselOlustur(16, 6, [
  [3, 0, 7, 0, 1],
  [1, 1, 10, 1, 1],
  [0, 2, 12, 2, 1],
  [0, 3, 14, 3, 1],
  [1, 4, 13, 4, 1],
]);
export const BULUT_PALET = ["#F1F5F9"];

// -----------------------------------------------------------------------
// BELEDİYE BİNASI (Municipality Building)
// -----------------------------------------------------------------------
export const BELEDIYE_BINASI_GRID = pikselOlustur(22, 14, [
  [10, 0, 10, 5, 6], // bayrak direği
  [11, 0, 14, 1, 7], // bayrak
  [9, 3, 12, 3, 2], // çatı üçgeni
  [7, 4, 14, 4, 2],
  [3, 5, 18, 5, 2], // çatı saçağı
  [3, 6, 18, 11, 1], // ana duvar
  [4, 6, 4, 11, 3], // sütun 1
  [7, 6, 7, 11, 3], // sütun 2
  [10, 6, 10, 11, 3], // sütun 3
  [13, 6, 13, 11, 3], // sütun 4
  [16, 6, 16, 11, 3], // sütun 5
  [5, 7, 6, 9, 4], // pencere 1
  [8, 7, 9, 9, 4], // pencere 2
  [14, 7, 15, 9, 4], // pencere 3
  [17, 7, 17, 9, 4], // pencere 4
  [9, 9, 11, 11, 4], // kapı
  [2, 12, 19, 12, 5], // basamak 1
  [1, 13, 20, 13, 5], // basamak 2
]);
export const BELEDIYE_BINASI_PALET = [
  "#E7D9B9", // 1 duvar
  "#1E3A8A", // 2 çatı
  "#F8FAFC", // 3 sütun
  "#93C5FD", // 4 pencere/kapı
  "#94A3B8", // 5 basamak
  "#475569", // 6 bayrak direği
  "#DC2626", // 7 bayrak
];

// -----------------------------------------------------------------------
// ÇÖP KAMYONU (Garbage Truck)
// -----------------------------------------------------------------------
export const COP_KAMYONU_GRID = pikselOlustur(20, 9, [
  [1, 1, 13, 5, 1], // kasa (kutu)
  [14, 2, 18, 5, 2], // kabin
  [16, 3, 17, 4, 3], // ön cam
  [0, 6, 19, 6, 5], // şasi
  [3, 7, 5, 8, 4], // tekerlek 1
  [15, 7, 17, 8, 4], // tekerlek 2
  [2, 2, 12, 2, 6], // belediye şeridi
]);
export const COP_KAMYONU_PALET = [
  "#16A34A", // 1 kasa (yeşil)
  "#F8FAFC", // 2 kabin
  "#93C5FD", // 3 ön cam
  "#0F172A", // 4 tekerlek
  "#64748B", // 5 şasi
  "#2563EB", // 6 belediye şeridi
];

// -----------------------------------------------------------------------
// AMBULANS (Ambulance)
// -----------------------------------------------------------------------
export const AMBULANS_GRID = pikselOlustur(20, 10, [
  [1, 2, 16, 6, 1], // gövde
  [13, 2, 16, 4, 2], // ön cam
  [8, 1, 8, 1, 3], // tepe lambası
  [6, 3, 6, 5, 3], // artı - dikey
  [5, 4, 7, 4, 3], // artı - yatay
  [0, 7, 17, 7, 5], // şasi
  [3, 8, 5, 8, 4], // tekerlek 1
  [12, 8, 14, 8, 4], // tekerlek 2
]);
export const AMBULANS_PALET = [
  "#F8FAFC", // 1 gövde
  "#93C5FD", // 2 cam
  "#DC2626", // 3 kırmızı çapraz/lamba
  "#0F172A", // 4 tekerlek
  "#64748B", // 5 şasi
];
