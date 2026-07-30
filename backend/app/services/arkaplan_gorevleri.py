"""
Arka planda (background) çalıştırılacak, uzun sürebilecek işler.

FastAPI'nin yerleşik `BackgroundTasks` mekanizmasıyla kullanılmak üzere
tasarlanmıştır: istek yanıtı hemen döner, bu fonksiyonlar yanıt
gönderildikten sonra arka planda çalışır. Bu nedenle burada oluşan
hatalar (SMTP, dosya G/Ç vb.) kullanıcıya yansıtılmaz, yalnızca loglanır.
"""

import logging
import os

from PIL import Image

from app.core.config import get_settings
from app.services import eposta_servisi

logger = logging.getLogger("arkaplan_gorevleri")

ayarlar = get_settings()

KUCUK_ONIZLEME_BOYUTU = (320, 320)


def arka_planda_hos_geldin_epostasi_gonder(alici_eposta: str, alici_ad: str) -> None:
    """Hoş geldin e-postasını arka planda gönderir; hata durumunda isteği etkilemez."""
    try:
        eposta_servisi.hos_geldin_epostasi_gonder(alici_eposta, alici_ad)
    except Exception:  # noqa: BLE001
        logger.exception("Hoş geldin e-postası gönderilemedi: %s", alici_eposta)


def arka_planda_email_dogrulama_epostasi_gonder(alici_eposta: str, alici_ad: str, baglanti: str) -> None:
    """Email doğrulama bağlantısını arka planda gönderir."""
    try:
        eposta_servisi.email_dogrulama_epostasi_gonder(alici_eposta, alici_ad, baglanti)
    except Exception:  # noqa: BLE001
        logger.exception("Email doğrulama epostası gönderilemedi: %s", alici_eposta)


def arka_planda_sifre_sifirlama_epostasi_gonder(alici_eposta: str, alici_ad: str, baglanti: str) -> None:
    """Şifre sıfırlama bağlantısını arka planda gönderir."""
    try:
        eposta_servisi.sifre_sifirlama_epostasi_gonder(alici_eposta, alici_ad, baglanti)
    except Exception:  # noqa: BLE001
        logger.exception("Şifre sıfırlama epostası gönderilemedi: %s", alici_eposta)


def arka_planda_kucuk_onizleme_olustur(goreli_dosya_yolu: str) -> None:
    """
    Yüklenen bir fotoğraf için küçük önizleme (thumbnail) oluşturur ve
    aynı klasöre `..._onizleme.jpg` adıyla kaydeder. Sadece görsel
    dosyalar için anlamlıdır; hata durumunda sessizce loglanır.
    """
    tam_yol = os.path.join(ayarlar.UPLOAD_DIR, goreli_dosya_yolu)
    try:
        with Image.open(tam_yol) as resim:
            resim.thumbnail(KUCUK_ONIZLEME_BOYUTU)
            kok, _ = os.path.splitext(tam_yol)
            resim.convert("RGB").save(f"{kok}_onizleme.jpg", "JPEG", quality=80)
        logger.info("Küçük önizleme oluşturuldu: %s", goreli_dosya_yolu)
    except Exception:  # noqa: BLE001
        logger.exception("Küçük önizleme oluşturulamadı: %s", goreli_dosya_yolu)
