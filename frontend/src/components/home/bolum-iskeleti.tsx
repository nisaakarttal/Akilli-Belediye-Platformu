const ISKELET_KART_SAYISI = 3;

/**
 * `Suspense` ile lazy-load edilen ana sayfa bölümleri (Haberler, Duyurular,
 * Etkinlikler) yüklenirken gösterilen master seviye iskelet (skeleton) yer tutucu.
 */
export function BolumIskeleti() {
  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      role="status"
      aria-label="İçerik yükleniyor"
    >
      {/* Başlık İskeleti */}
      <div className="mb-8 flex items-center gap-3.5">
        <div className="h-11 w-11 animate-pulse rounded-2xl bg-birincil-500/10" />
        <div className="space-y-2">
          <div className="h-6 w-52 animate-pulse rounded-lg bg-metin-ikincil/15" />
          <div className="h-4 w-72 animate-pulse rounded-lg bg-metin-ikincil/10" />
        </div>
      </div>

      {/* Kart Grid İskeleti */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: ISKELET_KART_SAYISI }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-3xl border border-kenarlik/60 bg-zemin/60 backdrop-blur-md p-6 shadow-sm"
          >
            <div className="space-y-4">
              <div className="h-48 w-full animate-pulse rounded-2xl bg-metin-ikincil/10" />
              <div className="h-5 w-3/4 animate-pulse rounded-lg bg-metin-ikincil/15" />
              <div className="space-y-2">
                <div className="h-3.5 w-full animate-pulse rounded bg-metin-ikincil/10" />
                <div className="h-3.5 w-5/6 animate-pulse rounded bg-metin-ikincil/10" />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-kenarlik/60 pt-4">
              <div className="h-4 w-24 animate-pulse rounded bg-metin-ikincil/10" />
              <div className="h-8 w-8 animate-pulse rounded-xl bg-metin-ikincil/10" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}