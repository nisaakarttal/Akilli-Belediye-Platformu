"""
Şifre hashleme ve JWT (JSON Web Token) işlemleri.
"""

from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

ayarlar = get_settings()
sifre_baglami = CryptContext(schemes=["bcrypt"], deprecated="auto")


def sifre_hashle(duz_sifre: str) -> str:
    """Düz metin şifreyi bcrypt ile hashler."""
    return sifre_baglami.hash(duz_sifre)


def sifre_dogrula(duz_sifre: str, hashli_sifre: str) -> bool:
    """Girilen şifrenin hashlenmiş şifreyle eşleşip eşleşmediğini kontrol eder."""
    return sifre_baglami.verify(duz_sifre, hashli_sifre)


def erisim_tokeni_olustur(veri: dict[str, Any], sure: timedelta | None = None) -> str:
    """Belirtilen veriyle bir JWT erişim tokeni oluşturur."""
    payload = veri.copy()
    son_kullanma = datetime.now(timezone.utc) + (
        sure or timedelta(minutes=ayarlar.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    payload.update({"exp": son_kullanma, "tip": "erisim"})
    return jwt.encode(payload, ayarlar.SECRET_KEY, algorithm=ayarlar.ALGORITHM)


def yenileme_tokeni_olustur(veri: dict[str, Any]) -> str:
    """Belirtilen veriyle bir JWT yenileme (refresh) tokeni oluşturur."""
    payload = veri.copy()
    son_kullanma = datetime.now(timezone.utc) + timedelta(days=ayarlar.REFRESH_TOKEN_EXPIRE_DAYS)
    payload.update({"exp": son_kullanma, "tip": "yenileme"})
    return jwt.encode(payload, ayarlar.SECRET_KEY, algorithm=ayarlar.ALGORITHM)


def sifre_sifirlama_tokeni_olustur(veri: dict[str, Any]) -> str:
    """Şifre sıfırlama için 30 dakika geçerli, tek amaçlı bir JWT üretir."""
    payload = veri.copy()
    son_kullanma = datetime.now(timezone.utc) + timedelta(minutes=30)
    payload.update({"exp": son_kullanma, "tip": "sifre_sifirlama"})
    return jwt.encode(payload, ayarlar.SECRET_KEY, algorithm=ayarlar.ALGORITHM)


def tokeni_coz(token: str) -> dict[str, Any] | None:
    """Bir JWT tokeni doğrular ve içeriğini döndürür. Geçersizse None döner."""
    try:
        return jwt.decode(token, ayarlar.SECRET_KEY, algorithms=[ayarlar.ALGORITHM])
    except JWTError:
        return None
