"""
Uygulama genel ayarları.

Tüm ortam değişkenleri burada tek bir noktadan okunur. Böylece uygulamanın
herhangi bir yerinde `os.environ` ile doğrudan değişken okunmaz; her zaman
`get_settings()` üzerinden erişilir.
"""

from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Ayarlar(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Uygulama
    APP_NAME: str = "Kapaklı Akıllı Belediye Platformu"
    APP_ENV: str = "development"

    # Veritabanı
    DATABASE_URL: str = "postgresql+psycopg2://kapakli_admin:kapakli_sifre@localhost:5432/kapakli_belediye"

    # JWT
    SECRET_KEY: str = "degistirilmesi_zorunlu_gizli_anahtar"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Yapay Zekâ
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.0-flash"

    # Dosya Yükleme
    MAX_UPLOAD_SIZE_MB: int = 25
    UPLOAD_DIR: str = "uploads"

    # CORS - virgülle ayrılmış origin listesi
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def cors_origin_listesi(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Ayarlar:
    """Ayarları önbellekli şekilde döndürür (uygulama boyunca tek örnek)."""
    return Ayarlar()
