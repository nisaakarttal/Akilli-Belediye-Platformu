"""
Kimlik doğrulama ve rol bazlı yetkilendirme için paylaşılan FastAPI bağımlılıkları.
"""

import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import tokeni_coz
from app.models.kullanici import Kullanici, KullaniciRolu

oauth2_semasi = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/giris")


def gecerli_kullanicial(
    token: str = Depends(oauth2_semasi),
    db: Session = Depends(get_db),
) -> Kullanici:
    """Token'ı çözer ve ilgili kullanıcıyı veritabanından getirir."""
    yetkisiz_hata = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Kimlik bilgileri doğrulanamadı.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = tokeni_coz(token)
    if payload is None or payload.get("tip") != "erisim":
        raise yetkisiz_hata

    kullanici_id = payload.get("sub")
    if kullanici_id is None:
        raise yetkisiz_hata

    try:
        kullanici_uuid = uuid.UUID(kullanici_id)
    except ValueError:
        raise yetkisiz_hata

    kullanici = db.query(Kullanici).filter(Kullanici.id == kullanici_uuid).first()
    if kullanici is None:
        raise yetkisiz_hata

    if not kullanici.aktif_mi:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hesabınız pasif duruma alınmıştır. Lütfen belediye ile iletişime geçin.",
        )

    return kullanici


def gecerli_aktif_kullanici(
    kullanici: Kullanici = Depends(gecerli_kullanicial),
) -> Kullanici:
    """Basit bir alias — ileride ek aktiflik kontrolleri buraya eklenebilir."""
    return kullanici


def rol_gerektir(*izinli_roller: KullaniciRolu):
    """
    Belirtilen rollerden birine sahip olmayan kullanıcıları 403 ile reddeden
    bir bağımlılık üretici (dependency factory).

    Kullanım: Depends(rol_gerektir(KullaniciRolu.ADMIN))
    """

    def kontrol_et(kullanici: Kullanici = Depends(gecerli_kullanicial)) -> Kullanici:
        if kullanici.rol not in izinli_roller:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bu işlemi gerçekleştirme yetkiniz bulunmamaktadır.",
            )
        return kullanici

    return kontrol_et


sadece_admin = rol_gerektir(KullaniciRolu.ADMIN)
sadece_personel = rol_gerektir(KullaniciRolu.PERSONEL)
sadece_personel_ve_admin = rol_gerektir(KullaniciRolu.PERSONEL, KullaniciRolu.ADMIN)
