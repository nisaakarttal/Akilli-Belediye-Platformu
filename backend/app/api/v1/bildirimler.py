"""Bildirim uç noktaları."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import gecerli_kullanicial
from app.core.database import get_db
from app.models.bildirim import Bildirim
from app.models.kullanici import Kullanici
from app.schemas.bildirim import BildirimYaniti
from app.schemas.ortak import MesajYaniti

router = APIRouter()


@router.get("/", response_model=list[BildirimYaniti])
def bildirimleri_listele(
    sadece_okunmamis: bool = False,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(gecerli_kullanicial),
):
    """Giriş yapmış kullanıcının bildirimlerini listeler (en yeni 100)."""
    sorgu = db.query(Bildirim).filter(Bildirim.kullanici_id == kullanici.id)
    if sadece_okunmamis:
        sorgu = sorgu.filter(Bildirim.okundu_mu.is_(False))
    return sorgu.order_by(Bildirim.olusturulma_tarihi.desc()).limit(100).all()


@router.put("/{bildirim_id}/okundu", response_model=MesajYaniti)
def bildirimi_okundu_yap(
    bildirim_id: uuid.UUID,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(gecerli_kullanicial),
):
    """Tek bir bildirimi okundu olarak işaretler."""
    bildirim = (
        db.query(Bildirim)
        .filter(Bildirim.id == bildirim_id, Bildirim.kullanici_id == kullanici.id)
        .first()
    )
    if bildirim is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bildirim bulunamadı.")

    bildirim.okundu_mu = True
    db.commit()
    return MesajYaniti(mesaj="Bildirim okundu olarak işaretlendi.")


@router.put("/{bildirim_id}/okunmadi", response_model=MesajYaniti)
def bildirimi_okunmadi_yap(
    bildirim_id: uuid.UUID,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(gecerli_kullanicial),
):
    """Tek bir bildirimi okunmadı olarak işaretler."""
    bildirim = (
        db.query(Bildirim)
        .filter(Bildirim.id == bildirim_id, Bildirim.kullanici_id == kullanici.id)
        .first()
    )
    if bildirim is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bildirim bulunamadı.")

    bildirim.okundu_mu = False
    db.commit()
    return MesajYaniti(mesaj="Bildirim okunmadı olarak işaretlendi.")


@router.put("/tumunu-okundu-yap", response_model=MesajYaniti)
def tum_bildirimleri_okundu_yap(
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(gecerli_kullanicial),
):
    """Kullanıcının tüm okunmamış bildirimlerini okundu olarak işaretler."""
    db.query(Bildirim).filter(
        Bildirim.kullanici_id == kullanici.id, Bildirim.okundu_mu.is_(False)
    ).update({"okundu_mu": True})
    db.commit()
    return MesajYaniti(mesaj="Tüm bildirimler okundu olarak işaretlendi.")