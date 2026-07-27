from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

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

from app.core.config import get_settings
from app.core.limiter import limiter


load_dotenv()

ayarlar = get_settings()


app = FastAPI(
    title=ayarlar.APP_NAME,
    description="Kapaklı Belediyesi için yapay zekâ destekli dijital belediyecilik platformu API'si.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# ==========================
# RATE LIMITING
# ==========================

app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler
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
        "durum": "saglikli"
    }


# ==========================
# ROUTERS
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