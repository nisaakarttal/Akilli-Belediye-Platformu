"""İlçe ve mahalle uç noktaları."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import sadece_admin
from app.core.database import get_db
from app.models.ilce import Ilce
from app.models.kullanici import Kullanici
from app.models.mahalle import Mahalle
from app.schemas.konum import IlceOlusturIstegi, IlceYaniti, MahalleOlusturIstegi, MahalleYaniti

router = APIRouter()


@router.get("/ilceler", response_model=list[IlceYaniti])
def ilceleri_listele(db: Session = Depends(get_db)):
    """Tüm ilçeleri listeler."""
    return db.query(Ilce).order_by(Ilce.ad).all()


@router.post("/ilceler", response_model=IlceYaniti, status_code=status.HTTP_201_CREATED)
def ilce_olustur(
    istek: IlceOlusturIstegi,
    db: Session = Depends(get_db),
    _: Kullanici = Depends(sadece_admin),
):
    """Yeni bir ilçe tanımlar. Yalnızca yönetici."""
    mevcut = db.query(Ilce).filter(Ilce.ad == istek.ad).first()
    if mevcut is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Bu isimde bir ilçe zaten mevcut.")

    ilce = Ilce(**istek.model_dump())
    db.add(ilce)
    db.commit()
    db.refresh(ilce)
    return ilce


@router.get("/mahalleler", response_model=list[MahalleYaniti])
def mahalleleri_listele(
    ilce_id: uuid.UUID | None = Query(None, description="Belirli bir ilçeye ait mahalleleri filtreler"),
    db: Session = Depends(get_db),
):
    """Mahalleleri listeler; isteğe bağlı olarak ilçeye göre filtrelenebilir."""
    sorgu = db.query(Mahalle)
    if ilce_id is not None:
        sorgu = sorgu.filter(Mahalle.ilce_id == ilce_id)
    return sorgu.order_by(Mahalle.ad).all()


@router.post("/mahalleler", response_model=MahalleYaniti, status_code=status.HTTP_201_CREATED)
def mahalle_olustur(
    istek: MahalleOlusturIstegi,
    db: Session = Depends(get_db),
    _: Kullanici = Depends(sadece_admin),
):
    """Yeni bir mahalle tanımlar. Yalnızca yönetici."""
    ilce = db.query(Ilce).filter(Ilce.id == istek.ilce_id).first()
    if ilce is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Belirtilen ilçe bulunamadı.")

    mahalle = Mahalle(**istek.model_dump())
    db.add(mahalle)
    db.commit()
    db.refresh(mahalle)
    return mahalle
