"""Şikâyet/talep kategorileri uç noktaları."""

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import sadece_admin
from app.core.database import get_db
from app.models.kategori import Kategori
from app.models.kullanici import Kullanici
from app.schemas.kategori import KategoriGuncelleIstegi, KategoriOlusturIstegi, KategoriYaniti
from app.schemas.ortak import MesajYaniti

router = APIRouter()


@router.get("/", response_model=list[KategoriYaniti])
def kategorileri_listele(db: Session = Depends(get_db)):
    """Tüm kategorileri listeler — herkes erişebilir (şikâyet formu için gereklidir)."""
    return db.query(Kategori).order_by(Kategori.ad).all()


@router.post("/", response_model=KategoriYaniti, status_code=status.HTTP_201_CREATED)
def kategori_olustur(
    istek: KategoriOlusturIstegi,
    db: Session = Depends(get_db),
    _: Kullanici = Depends(sadece_admin),
):
    """Yeni bir kategori oluşturur. Yalnızca yönetici."""
    mevcut = db.query(Kategori).filter(Kategori.ad == istek.ad).first()
    if mevcut is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Bu isimde bir kategori zaten mevcut.")

    kategori = Kategori(**istek.model_dump())
    db.add(kategori)
    db.commit()
    db.refresh(kategori)
    return kategori


@router.put("/{kategori_id}", response_model=KategoriYaniti)
def kategori_guncelle(
    kategori_id: uuid.UUID,
    istek: KategoriGuncelleIstegi,
    db: Session = Depends(get_db),
    _: Kullanici = Depends(sadece_admin),
):
    """Bir kategoriyi günceller. Yalnızca yönetici."""
    kategori = db.query(Kategori).filter(Kategori.id == kategori_id).first()
    if kategori is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kategori bulunamadı.")

    for alan, deger in istek.model_dump(exclude_unset=True).items():
        setattr(kategori, alan, deger)

    db.commit()
    db.refresh(kategori)
    return kategori


@router.delete("/{kategori_id}", response_model=MesajYaniti)
def kategori_sil(
    kategori_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: Kullanici = Depends(sadece_admin),
):
    """Bir kategoriyi siler. Bu kategoriye bağlı talep varsa silme işlemi engellenir."""
    kategori = db.query(Kategori).filter(Kategori.id == kategori_id).first()
    if kategori is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kategori bulunamadı.")

    if len(kategori.talepler) > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bu kategoriye bağlı talepler bulunduğu için silinemez.",
        )

    db.delete(kategori)
    db.commit()
    return MesajYaniti(mesaj="Kategori başarıyla silindi.")
