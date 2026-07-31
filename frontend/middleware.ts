import { NextRequest, NextResponse } from "next/server";

// NOT: Bu, yalnızca kullanıcı deneyimi için hafif bir sunucu tarafı yönlendirmedir.
// Gerçek yetkilendirme her zaman backend'de (`gecerli_kullanicial` / `sadece_admin`
// bağımlılıkları) uygulanır — burada token imzası doğrulanmıyor, yalnızca cookie'nin
// varlığına ve JWT payload'ındaki role bakılıyor. Amaç, girişi olmayan bir kullanıcının
// /panel veya /admin'e gidip API'den art arda 401 almasını önlemek.

const ERISIM_TOKENI_ANAHTARI = "kb_erisim_tokeni";

function tokendenRolCoz(token: string): string | null {
  try {
    const govde = token.split(".")[1];
    if (!govde) return null;
    const json = JSON.parse(Buffer.from(govde, "base64").toString("utf-8"));
    return json.rol ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ERISIM_TOKENI_ANAHTARI)?.value;

  const korumaliMi = pathname.startsWith("/panel") || pathname.startsWith("/admin");
  const authSayfasiMi = pathname.startsWith("/giris") || pathname.startsWith("/kayit");

  if (korumaliMi && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/giris";
    url.searchParams.set("devam", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin") && token) {
    const rol = tokendenRolCoz(token);
    if (rol && rol !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/panel";
      return NextResponse.redirect(url);
    }
  }

  if (authSayfasiMi && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/panel";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/:path*", "/admin/:path*", "/giris", "/kayit"],
};
