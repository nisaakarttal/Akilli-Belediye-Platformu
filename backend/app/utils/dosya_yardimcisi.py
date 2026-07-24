"""Şikâyet/talep dosya yükleme doğrulama ve kaydetme yardımcıları."""

import os
import uuid

from fastapi import HTTPException, UploadFile, status

from app.core.config import get_settings
from app.models.talep_dosyasi import DosyaTuru

ayarlar = get_settings()

IZINLI_UZANTILAR: dict[DosyaTuru, set[str]] = {
    DosyaTuru.FOTOGRAF: {".jpg", ".jpeg", ".png", ".webp"},
    DosyaTuru.VIDEO: {".mp4", ".mov", ".webm"},
    DosyaTuru.SES: {".mp3", ".wav", ".m4a", ".ogg"},
    DosyaTuru.BELGE: {".pdf", ".doc", ".docx"},
    DosyaTuru.SONUC_FOTOGRAFI: {".jpg", ".jpeg", ".png", ".webp"},
}


def dosya_kaydet(dosya: UploadFile, dosya_turu: DosyaTuru, alt_klasor: str) -> tuple[str, int]:
    """
    Yüklenen dosyanın uzantısını ve boyutunu doğrular, `uploads/{alt_klasor}/`
    altına rastgele bir isimle kaydeder. (göreli_yol, boyut_bayt) döner.
    """
    uzanti = os.path.splitext(dosya.filename or "")[1].lower()
    izinli = IZINLI_UZANTILAR.get(dosya_turu, set())

    if uzanti not in izinli:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{dosya_turu.value}' türü için izin verilen uzantılar: {', '.join(sorted(izinli))}",
        )

    icerik = dosya.file.read()
    boyut_bayt = len(icerik)
    maks_bayt = ayarlar.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    if boyut_bayt == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Yüklenen dosya boş.")

    if boyut_bayt > maks_bayt:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Dosya boyutu {ayarlar.MAX_UPLOAD_SIZE_MB} MB sınırını aşıyor.",
        )

    hedef_klasor = os.path.join(ayarlar.UPLOAD_DIR, alt_klasor)
    os.makedirs(hedef_klasor, exist_ok=True)

    dosya_adi = f"{uuid.uuid4()}{uzanti}"
    tam_yol = os.path.join(hedef_klasor, dosya_adi)

    with open(tam_yol, "wb") as hedef:
        hedef.write(icerik)

    goreli_yol = f"{alt_klasor}/{dosya_adi}"
    return goreli_yol, boyut_bayt
