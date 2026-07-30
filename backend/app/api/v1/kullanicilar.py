"""Kullanıcı yönetimi uç noktaları."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.api.deps import gecerli_kullanicial, sadece_admin
from app.core.database import get_db
from app.models.kullanici import Kullanici, KullaniciRolu
from app.schemas.kullanici import (
    KullaniciGuncelleIstegi,
    KullaniciRolGuncelleIstegi,
    KullaniciYaniti,
)
from app.schemas.ortak import MesajYaniti, SayfalanmisYanit
from app.services.aktivite_servisi import aktivite_kaydet

router = APIRouter()


@router.get("/", response_model=SayfalanmisYanit[KullaniciYaniti])
def kullanicilari_listele(
    rol: KullaniciRolu | None = Query(None, description="Role göre filtrele"),
    arama: str | None = Query(None, description="Ad, soyad veya e-postada arama yapar"),
    sayfa: int = Query(1, ge=1),
    sayfa_boyutu: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: Kullanici = Depends(sadece_admin),
):
    """Tüm kullanıcıları listeler — yalnızca yöneticiler erişebilir."""
    sorgu = db.query(Kullanici)

    if rol is not None:
        sorgu = sorgu.filter(Kullanici.rol == rol)

    if arama:
        desen = f"%{arama}%"
        sorgu = sorgu.filter(
            (Kullanici.ad.ilike(desen)) | (Kullanici.soyad.ilike(desen)) | (Kullanici.e_posta.ilike(desen))
        )

    toplam = sorgu.count()
    kayitlar = (
        sorgu.order_by(Kullanici.olusturulma_tarihi.desc())
        .offset((sayfa - 1) * sayfa_boyutu)
        .limit(sayfa_boyutu)
        .all()
    )

    return SayfalanmisYanit(toplam=toplam, sayfa=sayfa, sayfa_boyutu=sayfa_boyutu, veriler=kayitlar)


@router.get("/{kullanici_id}", response_model=KullaniciYaniti)
def kullanici_getir(
    kullanici_id: uuid.UUID,
    db: Session = Depends(get_db),
    giris_yapan: Kullanici = Depends(gecerli_kullanicial),
):
    """Bir kullanıcının detayını döner. Vatandaşlar yalnızca kendi bilgilerini görebilir."""
    if giris_yapan.rol != KullaniciRolu.ADMIN and giris_yapan.id != kullanici_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bu kaydı görüntüleme yetkiniz yok.")

    kullanici = db.query(Kullanici).filter(Kullanici.id == kullanici_id).first()
    if kullanici is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kullanıcı bulunamadı.")

    return kullanici


@router.put("/{kullanici_id}", response_model=KullaniciYaniti)
def kullanici_guncelle(
    kullanici_id: uuid.UUID,
    istek: KullaniciGuncelleIstegi,
    request: Request,
    db: Session = Depends(get_db),
    giris_yapan: Kullanici = Depends(gecerli_kullanicial),
):
    """Profil bilgilerini günceller. Vatandaşlar yalnızca kendi profilini düzenleyebilir."""
    if giris_yapan.rol != KullaniciRolu.ADMIN and giris_yapan.id != kullanici_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bu kaydı düzenleme yetkiniz yok.")

    kullanici = db.query(Kullanici).filter(Kullanici.id == kullanici_id).first()
    if kullanici is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kullanıcı bulunamadı.")

    degisen_alanlar = istek.model_dump(exclude_unset=True)
    for alan, deger in degisen_alanlar.items():
        setattr(kullanici, alan, deger)

    if giris_yapan.rol == KullaniciRolu.ADMIN:
        aktivite_kaydet(
            db,
            kullanici_id=giris_yapan.id,
            eylem="kullanici_guncellendi",
            hedef_tablo="kullanicilar",
            hedef_id=kullanici.id,
            detay=f"Güncellenen alanlar: {', '.join(degisen_alanlar.keys()) or 'yok'}",
            request=request,
        )

    db.commit()
    db.refresh(kullanici)
    return kullanici


@router.put("/{kullanici_id}/rol", response_model=KullaniciYaniti)
def kullanici_rolunu_guncelle(
    kullanici_id: uuid.UUID,
    istek: KullaniciRolGuncelleIstegi,
    request: Request,
    db: Session = Depends(get_db),
    kullanici_yapan: Kullanici = Depends(sadece_admin),
):
    """Bir kullanıcının rolünü değiştirir (ör. vatandaşı personel yapmak). Yalnızca yönetici."""
    kullanici = db.query(Kullanici).filter(Kullanici.id == kullanici_id).first()
    if kullanici is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kullanıcı bulunamadı.")

    eski_rol = kullanici.rol

    kullanici.rol = istek.rol
    if istek.departman is not None:
        kullanici.departman = istek.departman

    aktivite_kaydet(
        db,
        kullanici_id=kullanici_yapan.id,
        eylem="kullanici_rolu_guncellendi",
        hedef_tablo="kullanicilar",
        hedef_id=kullanici.id,
        detay=f"Rol '{eski_rol.value}' -> '{istek.rol.value}' olarak değiştirildi.",
        request=request,
    )

    db.commit()
    db.refresh(kullanici)
    return kullanici


@router.put("/{kullanici_id}/durum", response_model=MesajYaniti)
def kullanici_durumunu_degistir(
    kullanici_id: uuid.UUID,
    request: Request,
    aktif_mi: bool = Query(..., description="true: hesabı etkinleştirir, false: pasif yapar"),
    db: Session = Depends(get_db),
    kullanici_yapan: Kullanici = Depends(sadece_admin),
):
    """Kullanıcı hesabını etkinleştirir/pasif yapar. Yalnızca yönetici."""
    kullanici = db.query(Kullanici).filter(Kullanici.id == kullanici_id).first()
    if kullanici is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kullanıcı bulunamadı.")

    kullanici.aktif_mi = aktif_mi

    durum_metni = "etkinleştirildi" if aktif_mi else "pasif duruma alındı"

    aktivite_kaydet(
        db,
        kullanici_id=kullanici_yapan.id,
        eylem="kullanici_durumu_degistirildi",
        hedef_tablo="kullanicilar",
        hedef_id=kullanici.id,
        detay=f"Hesap {durum_metni}.",
        request=request,
    )

    db.commit()
    return MesajYaniti(mesaj=f"Kullanıcı hesabı {durum_metni}.")
