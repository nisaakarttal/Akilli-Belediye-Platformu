import logging
import os
import smtplib

from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger("eposta_servisi")


SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USERNAME)


def sifre_sifirlama_epostasi_gonder(
    alici_eposta: str,
    alici_ad: str,
    sifirlama_baglantisi: str,
) -> None:
    konu = "Kapaklı Belediyesi - Şifre Sıfırlama Talebi"

    icerik = f"""
Sayın {alici_ad},

Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayınız.

Bu bağlantı 30 dakika boyunca geçerlidir.

{sifirlama_baglantisi}

Eğer bu işlemi siz gerçekleştirmediyseniz bu e-postayı dikkate almayabilirsiniz.

İyi günler dileriz.

Kapaklı Belediyesi
Bilgi İşlem Müdürlüğü
"""

    _smtp_ile_gonder(alici_eposta, konu, icerik)


def hos_geldin_epostasi_gonder(
    alici_eposta: str,
    alici_ad: str,
) -> None:
    konu = "Kapaklı Akıllı Belediye Platformu'na Hoş Geldiniz"

    icerik = f"""
Sayın {alici_ad},

Kapaklı Akıllı Belediye Platformu'na hoş geldiniz.

Artık;

• Talep oluşturabilirsiniz.
• Şikâyet oluşturabilirsiniz.
• Başvurularınızı takip edebilirsiniz.
• Bildirim alabilirsiniz.

İyi günler dileriz.

Kapaklı Belediyesi
"""

    _smtp_ile_gonder(alici_eposta, konu, icerik)


def _smtp_ile_gonder(
    alici: str,
    konu: str,
    icerik: str,
) -> None:
    if not all(
        [
            SMTP_HOST,
            SMTP_PORT,
            SMTP_USERNAME,
            SMTP_PASSWORD,
            SMTP_FROM,
        ]
    ):
        raise ValueError(
            "SMTP ayarları eksik. Lütfen .env dosyasını kontrol edin."
        )

    mesaj = MIMEMultipart()
    mesaj["From"] = SMTP_FROM
    mesaj["To"] = alici
    mesaj["Subject"] = Header(konu, "utf-8")

    mesaj.attach(MIMEText(icerik, "plain", "utf-8"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()

            smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
            smtp.send_message(mesaj)

        logger.info("E-posta başarıyla gönderildi: %s", alici)

    except smtplib.SMTPAuthenticationError:
        logger.exception("SMTP kullanıcı adı veya şifre hatalı.")
        raise

    except smtplib.SMTPException:
        logger.exception("SMTP sunucusu ile iletişim kurulamadı.")
        raise

    except Exception:
        logger.exception("Beklenmeyen bir hata oluştu.")
        raise