"""Personel uç noktaları — atanan taleplerin görüntülenmesi."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.api.deps import sadece_personel_ve_admin
from app.core.database import get_db
from app.models.atama import Atama
from app.models.kullanici import Kullanici
from app.models.talep import Talep
from app.schemas.talep import TalepListeYaniti

router = APIRouter()


@router.get("/atanan-talepler", response_model=list[TalepListeYaniti])
def atanan_talepleri_listele(
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel_ve_admin),
):
    """Giriş yapmış personele atanmış tüm talepleri listeler."""
    talep_idleri = (
        db.query(Atama.talep_id).filter(Atama.personel_id == kullanici.id).distinct().subquery()
    )
    return (
        db.query(Talep)
        .options(joinedload(Talep.kategori), joinedload(Talep.mahalle))
        .filter(Talep.id.in_(talep_idleri))
        .order_by(Talep.olusturulma_tarihi.desc())
        .all()
    )
