"""
Şifre hashleme ve JWT (JSON Web Token) işlemleri.
"""

import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings
import hmac
import hashlib


ayarlar = get_settings()

sifre_baglami = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def sifre_hashle(duz_sifre: str) -> str:
    """Düz metin şifreyi bcrypt ile hashler."""
    return sifre_baglami.hash(duz_sifre)


def sifre_dogrula(
    duz_sifre: str,
    hashli_sifre: str
) -> bool:
    """Girilen şifrenin hashlenmiş şifreyle eşleşip eşleşmediğini kontrol eder."""
    return sifre_baglami.verify(
        duz_sifre,
        hashli_sifre
    )


def erisim_tokeni_olustur(
    veri: dict[str, Any],
    sure: timedelta | None = None
) -> str:
    """JWT erişim (Access) tokeni oluşturur."""

    simdi = datetime.now(timezone.utc)

    payload = veri.copy()

    payload.update(
        {
            "jti": str(uuid.uuid4()),
            "iat": simdi,
            "exp": simdi
            + (
                sure
                or timedelta(
                    minutes=ayarlar.ACCESS_TOKEN_EXPIRE_MINUTES
                )
            ),
            "tip": "erisim",
        }
    )

    return jwt.encode(
        payload,
        ayarlar.SECRET_KEY,
        algorithm=ayarlar.ALGORITHM,
    )


def yenileme_tokeni_olustur(
    veri: dict[str, Any]
) -> str:
    """JWT yenileme (Refresh) tokeni oluşturur."""

    simdi = datetime.now(timezone.utc)

    payload = veri.copy()

    payload.update(
        {
            "jti": str(uuid.uuid4()),
            "iat": simdi,
            "exp": simdi
            + timedelta(
                days=ayarlar.REFRESH_TOKEN_EXPIRE_DAYS
            ),
            "tip": "yenileme",
        }
    )

    return jwt.encode(
        payload,
        ayarlar.SECRET_KEY,
        algorithm=ayarlar.ALGORITHM,
    )


def sifre_sifirlama_tokeni_olustur(
    veri: dict[str, Any]
) -> str:
    """30 dakika geçerli şifre sıfırlama tokeni oluşturur."""

    simdi = datetime.now(timezone.utc)

    payload = veri.copy()

    payload.update(
        {
            "jti": str(uuid.uuid4()),
            "iat": simdi,
            "exp": simdi + timedelta(minutes=30),
            "tip": "sifre_sifirlama",
        }
    )

    return jwt.encode(
        payload,
        ayarlar.SECRET_KEY,
        algorithm=ayarlar.ALGORITHM,
    )


def tokeni_coz(
    token: str
) -> dict[str, Any] | None:
    """JWT tokenini doğrular ve içeriğini döndürür."""

    try:
        return jwt.decode(
            token,
            ayarlar.SECRET_KEY,
            algorithms=[ayarlar.ALGORITHM],
        )


    except JWTError:
        return None

def token_hashle(token: str) -> str:
    """
    Token değerini HMAC-SHA256 ile hashler.
    Veritabanında düz token saklanmaz.
    """
    return hmac.new(
        ayarlar.SECRET_KEY.encode(),
        token.encode(),
        hashlib.sha256
    ).hexdigest()

def email_dogrulama_tokeni_olustur(
    veri: dict[str, Any]
) -> str:
    """
    Email doğrulama JWT tokeni oluşturur.
    24 saat geçerlidir.
    """

    simdi = datetime.now(timezone.utc)

    payload = veri.copy()

    payload.update(
        {
            "jti": str(uuid.uuid4()),
            "iat": simdi,
            "exp": simdi + timedelta(hours=24),
            "tip": "email_dogrulama",
        }
    )

    return jwt.encode(
        payload,
        ayarlar.SECRET_KEY,
        algorithm=ayarlar.ALGORITHM,
    )

