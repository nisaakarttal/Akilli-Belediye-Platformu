/**
 * Genel amaçlı piksel sanat render bileşeni.
 * Bir sayı matrisini (0 = boş, 1+ = palet rengi) SVG <rect> ızgarasına dönüştürür.
 * `shapeRendering="crispEdges"` sayesinde büyütüldüğünde bulanıklaşmaz, tam piksel görünümü korunur.
 */

interface PikselSpriteProps {
  grid: number[][];
  palet: string[];
  className?: string;
}

export function PikselSprite({ grid, palet, className }: PikselSpriteProps) {
  const genislik = grid[0]?.length ?? 0;
  const yukseklik = grid.length;

  return (
    <svg
      viewBox={`0 0 ${genislik} ${yukseklik}`}
      className={className}
      shapeRendering="crispEdges"
      preserveAspectRatio="xMidYMid meet"
    >
      {grid.map((satir, y) =>
        satir.map((deger, x) => {
          if (deger === 0) return null;
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palet[deger - 1]} />;
        })
      )}
    </svg>
  );
}

/** Dikdörtgen dolgu listesinden bir piksel ızgarası üretir — sprite tanımlamayı kolaylaştırır. */
export function pikselOlustur(
  genislik: number,
  yukseklik: number,
  dolgular: [x1: number, y1: number, x2: number, y2: number, deger: number][]
): number[][] {
  const grid: number[][] = Array.from({ length: yukseklik }, () => Array(genislik).fill(0));
  for (const [x1, y1, x2, y2, deger] of dolgular) {
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        if (grid[y] && x >= 0 && x < genislik) grid[y][x] = deger;
      }
    }
  }
  return grid;
}
