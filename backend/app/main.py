import asyncio
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from slowapi.middleware import SlowAPIMiddleware

from dotenv import load_dotenv

from app.api.v1 import (
    admin,
    ai,
    auth,
    bildirimler,
    kategoriler,
    konum,
    kullanicilar,
    personel,
    talepler,
)
from app.api import v2

from app.core.config import get_settings
from app.core.database import OturumYerel
from app.core.limiter import limiter
from app.core.scheduler import zamanlayiciyi_baslat, zamanlayiciyi_durdur
from app.core.ws_manager import baglanti_yoneticisi
from app.models.aktivite_kaydi import AktiviteKaydi

from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

load_dotenv()

ayarlar = get_settings()
logger = logging.getLogger("main")

# ==========================
# SECURITY HEADERS
# ==========================

class SecurityHeadersMiddleware(BaseHTTPMiddleware):

    async def dispatch(
        self,
        request: Request,
        call_next
    ) -> Response:

        response = await call_next(request)

        # Tarayıcı MIME tahmini yapmasın
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Clickjacking koruması
        response.headers["X-Frame-Options"] = "DENY"

        # Referrer bilgisi azaltma
        response.headers["Referrer-Policy"] = (
            "strict-origin-when-cross-origin"
        )

        # Kamera, mikrofon vb erişimlerini kapatma
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=()"
        )

        # HTTPS zorlaması
        if ayarlar.ENVIRONMENT == "production":
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )

        # Content Security Policy
        if ayarlar.ENVIRONMENT == "production":
            response.headers["Content-Security-Policy"] = (
                "default-src 'self'; "
                "img-src 'self' data: https:; "
                "style-src 'self' 'unsafe-inline'; "
                "script-src 'self' 'unsafe-inline'; "
                "connect-src 'self' https:; "
                "font-src 'self' https:;"
            )


        return response


# ==========================
# OPENAPI / SWAGGER DOKÜMANTASYONU
# ==========================

OPENAPI_ETIKETLERI = [
    {"name": "Sistem", "description": "Sağlık kontrolü ve API sürüm bilgisi uç noktaları."},
    {"name": "Kimlik Doğrulama", "description": "Kayıt, giriş, token yenileme, e-posta doğrulama ve şifre sıfırlama."},
    {"name": "Kullanıcılar", "description": "Kullanıcı listeleme, profil, rol ve hesap durumu yönetimi."},
    {"name": "Kategoriler", "description": "Şikâyet/talep kategorileri; SLA süresi ve soft delete (pasif/geri yükleme) desteğiyle."},
    {"name": "İlçeler ve Mahalleler", "description": "Konum (ilçe/mahalle) tanımlama ve listeleme."},
    {"name": "Talepler", "description": "Şikâyet/talep oluşturma, takip, atama, çözüm, SLA takibi ve vatandaş memnuniyet değerlendirmesi."},
    {"name": "Yapay Zekâ", "description": "Gemini destekli şikâyet analizi ve sohbet asistanı."},
    {"name": "Bildirimler", "description": "Uygulama içi bildirimler ve WebSocket üzerinden gerçek zamanlı bildirim kanalı."},
    {"name": "Personel", "description": "Personele atanan taleplerin yönetimi."},
    {"name": "Yönetici", "description": "Dashboard istatistikleri, mahalle/personel analizleri ve denetim (audit) kayıtları."},
]

app = FastAPI(
    title=ayarlar.APP_NAME,
    description=(
        "Kapaklı Belediyesi için yapay zekâ destekli dijital belediyecilik "
        "platformu API'si.\n\n"
        "Sürümleme: `/api/v1` üretimde kullanılan kararlı sürümdür ve geriye "
        "dönük uyumluluğu korur. `/api/v2`, aynı uç noktaları barındırır ve "
        "gelecekteki değişiklikler önce burada yayınlanır."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=OPENAPI_ETIKETLERI,
    contact={"name": "Kapaklı Belediyesi Bilgi İşlem Müdürlüğü"},
)


# ==========================
# RATE LIMITING
# ==========================

app.state.limiter = limiter


async def rate_limit_asildi_handler(request: Request, exc: RateLimitExceeded):
    """Rate limit ihlallerini denetim (audit) kaydına yazar ve standart 429 yanıtını döner."""
    db = OturumYerel()
    try:
        db.add(
            AktiviteKaydi(
                kullanici_id=None,
                eylem="rate_limit_asildi",
                hedef_tablo="http_istek",
                hedef_id=None,
                detay=f"{request.method} {request.url.path} — limit: {exc.detail}",
                ip_adresi=request.client.host if request.client else None,
            )
        )
        db.commit()
    except Exception:  # noqa: BLE001 — loglama hatası isteği bloklamamalı
        db.rollback()
        logger.exception("Rate limit ihlali kaydedilemedi.")
    finally:
        db.close()

    return _rate_limit_exceeded_handler(request, exc)


app.add_exception_handler(RateLimitExceeded, rate_limit_asildi_handler)

# Limiter.default_limits (IP başına dakikada 200 istek) tüm uç noktalara
# otomatik uygulanır; @limiter.limit(...) ile işaretlenmiş hassas uç
# noktalarda ise o dekoratörün özel limiti geçerli olur.
app.add_middleware(SlowAPIMiddleware)

# ==========================
# SECURITY
# ==========================

app.add_middleware(
    SecurityHeadersMiddleware
)

if ayarlar.ENVIRONMENT == "production":

    app.add_middleware(
        HTTPSRedirectMiddleware
    )

if ayarlar.ENVIRONMENT == "production":

    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=[
            "api.kapakli.bel.tr",
            "*.kapakli.bel.tr"
        ]
    )
# ==========================
# CORS
# ==========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=ayarlar.cors_origin_listesi,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================
# STATIC FILES
# ==========================

app.mount(
    "/uploads",
    StaticFiles(directory=ayarlar.UPLOAD_DIR),
    name="uploads"
)


# ==========================
# BAŞLANGIÇ / KAPANIŞ OLAYLARI
# ==========================

@app.on_event("startup")
async def uygulama_baslangici() -> None:
    """WebSocket bildirim yöneticisine olay döngüsünü tanıtır ve zamanlanmış görevleri başlatır."""
    baglanti_yoneticisi.ana_donguyu_ayarla(asyncio.get_running_loop())
    zamanlayiciyi_baslat()


@app.on_event("shutdown")
async def uygulama_kapanisi() -> None:
    """Zamanlayıcıyı düzgün şekilde durdurur."""
    zamanlayiciyi_durdur()


# ==========================
# SYSTEM ENDPOINTS
# ==========================

@app.get("/", tags=["Sistem"])
def kok():
    return {
        "mesaj": f"{ayarlar.APP_NAME} API'sine hoş geldiniz.",
        "durum": "calisiyor",
        "surum": "0.1.0",
    }


@app.get("/api/v1/saglik", tags=["Sistem"])
def saglik_kontrolu():
    return {
        "durum": "saglikli",
        "surum": "v1",
    }


@app.get("/api/v2/saglik", tags=["Sistem"])
def saglik_kontrolu_v2():
    return {
        "durum": "saglikli",
        "surum": "v2",
    }


# ==========================
# ROUTERS — /api/v1
# ==========================

app.include_router(
    auth.router,
    prefix="/api/v1/auth",
    tags=["Kimlik Doğrulama"]
)


app.include_router(
    kullanicilar.router,
    prefix="/api/v1/kullanicilar",
    tags=["Kullanıcılar"]
)


app.include_router(
    kategoriler.router,
    prefix="/api/v1/kategoriler",
    tags=["Kategoriler"]
)


app.include_router(
    konum.router,
    prefix="/api/v1",
    tags=["İlçeler ve Mahalleler"]
)


app.include_router(
    talepler.router,
    prefix="/api/v1/talepler",
    tags=["Talepler"]
)


app.include_router(
    ai.router,
    prefix="/api/v1/ai",
    tags=["Yapay Zekâ"]
)


app.include_router(
    bildirimler.router,
    prefix="/api/v1/bildirimler",
    tags=["Bildirimler"]
)


app.include_router(
    personel.router,
    prefix="/api/v1/personel",
    tags=["Personel"]
)


app.include_router(
    admin.router,
    prefix="/api/v1/admin",
    tags=["Yönetici"]
)


# ==========================
# ROUTERS — /api/v2
# ==========================
# v2, şimdilik v1 ile aynı uç noktaları barındırır (tam geriye dönük
# uyumluluk); v1'i etkilemeden yalnızca v2'de yayınlanacak değişiklikler
# app/api/v2 altında yönetilir (bkz. app/api/v2/__init__.py).

for yonlendirici, on_ek, etiketler in v2.V2_ROUTER_LISTESI:
    app.include_router(yonlendirici, prefix=on_ek, tags=etiketler)
