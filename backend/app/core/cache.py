"""
Redis tabanlı basit önbellek (cache) yardımcıları.

Redis'e ulaşılamıyorsa (yapılandırılmamış/geçici erişim sorunu) tüm
fonksiyonlar sessizce devre dışı kalır; uygulama önbelleksiz şekilde
çalışmaya devam eder — cache asla isteği başarısız kılmaz.
"""

import json
import logging
from typing import Any

import redis

from app.core.config import get_settings

logger = logging.getLogger("cache")

ayarlar = get_settings()

_redis_istemcisi: redis.Redis | None = None
_redis_denendi = False


def redis_istemcisi_al() -> redis.Redis | None:
    """Redis istemcisini (varsa) döner; bağlantı kurulamazsa None döner."""
    global _redis_istemcisi, _redis_denendi
    if not _redis_denendi:
        _redis_denendi = True
        try:
            istemci = redis.Redis.from_url(
                ayarlar.REDIS_URL, decode_responses=True, socket_connect_timeout=1
            )
            istemci.ping()
            _redis_istemcisi = istemci
        except Exception:  # noqa: BLE001 — cache olmadan da uygulama çalışmaya devam etmeli
            logger.warning("Redis'e bağlanılamadı, önbellek devre dışı.")
            _redis_istemcisi = None
    return _redis_istemcisi


def cache_getir(anahtar: str) -> Any | None:
    """Önbellekten bir değeri okur; yoksa/erişilemezse None döner."""
    istemci = redis_istemcisi_al()
    if istemci is None:
        return None
    try:
        deger = istemci.get(anahtar)
        return json.loads(deger) if deger is not None else None
    except Exception:  # noqa: BLE001
        return None


def cache_yaz(anahtar: str, deger: Any, sure_saniye: int | None = None) -> None:
    """Bir değeri belirtilen süre (saniye) boyunca önbelleğe yazar."""
    istemci = redis_istemcisi_al()
    if istemci is None:
        return
    try:
        istemci.set(
            anahtar,
            json.dumps(deger, default=str, ensure_ascii=False),
            ex=sure_saniye or ayarlar.CACHE_VARSAYILAN_SURE_SANIYE,
        )
    except Exception:  # noqa: BLE001
        pass


def cache_temizle(*anahtarlar: str) -> None:
    """Belirtilen anahtarları önbellekten siler."""
    istemci = redis_istemcisi_al()
    if istemci is None or not anahtarlar:
        return
    try:
        istemci.delete(*anahtarlar)
    except Exception:  # noqa: BLE001
        pass


def desene_gore_temizle(desen: str) -> None:
    """`desen` ile eşleşen tüm anahtarları siler (ör. 'kategoriler:*')."""
    istemci = redis_istemcisi_al()
    if istemci is None:
        return
    try:
        anahtarlar = list(istemci.scan_iter(match=desen))
        if anahtarlar:
            istemci.delete(*anahtarlar)
    except Exception:  # noqa: BLE001
        pass
