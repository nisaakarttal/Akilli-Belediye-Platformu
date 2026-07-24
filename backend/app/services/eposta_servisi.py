"""
E-posta gönderim servisi.

Üretim ortamında gerçek bir SMTP sağlayıcısı (SendGrid, Amazon SES, kurumsal
SMTP sunucusu vb.) bağlanana kadar, e-postalar konsola yazdırılır. Bu sayede
geliştirme ortamında şifre sıfırlama/doğrulama akışları kesintisiz test
edilebilir. SMTP bilgileri `.env` dosyasına eklendiğinde `_smtp_ile_gonder`
fonksiyonu devreye alınmalıdır.
"""

import logging

logger = logging.getLogger("eposta_servisi")


def sifre_sifirlama_epostasi_gonder(alici_eposta: str, alici_ad: str, sifirlama_baglantisi: str) -> None:
    konu = "Kapaklı Belediyesi — Şifre Sıfırlama Talebi"
    icerik = (
        f"Sayın {alici_ad},\n\n"
        f"Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayınız. "
        f"Bu bağlantı 30 dakika süreyle geçerlidir.\n\n"
        f"{sifirlama_baglantisi}\n\n"
        f"Bu talebi siz oluşturmadıysanız bu e-postayı dikkate almayabilirsiniz.\n\n"
        f"Kapaklı Belediyesi Bilgi İşlem Müdürlüğü"
    )
    _gonder(alici_eposta, konu, icerik)


def hos_geldin_epostasi_gonder(alici_eposta: str, alici_ad: str) -> None:
    konu = "Kapaklı Akıllı Belediye Platformu'na Hoş Geldiniz"
    icerik = (
        f"Sayın {alici_ad},\n\n"
        f"Kapaklı Akıllı Belediye Platformu'na hoş geldiniz. Artık şikâyet ve "
        f"taleplerinizi dijital ortamda oluşturabilir, durumlarını anlık olarak "
        f"takip edebilirsiniz.\n\n"
        f"Kapaklı Belediyesi"
    )
    _gonder(alici_eposta, konu, icerik)


def _gonder(alici: str, konu: str, icerik: str) -> None:
    # TODO(Aşama sonrası): .env üzerinden SMTP ayarları tanımlandığında
    # burada smtplib veya bir e-posta sağlayıcı SDK'sı ile gerçek gönderim yapılacak.
    logger.info("[E-POSTA] Alıcı: %s | Konu: %s\n%s", alici, konu, icerik)
