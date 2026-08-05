"""Talep atama/yetki ve görünürlük için ortak yardımcılar."""

import uuid

from sqlalchemy import func
from sqlalchemy.orm import Query, Session

from app.models.atama import Atama
from app.models.talep import Talep

PERSONEL_NOTU_ON_EKI = "[PERSONEL_NOTU] "
ESKI_PERSONEL_NOTU_ON_EKI = "İşlem notu: "


def son_atamalar_alt_sorgusu(db: Session):
    """Her talebin tek güncel atamasını row_number ile güvenli biçimde seçer."""
    sirali_atamalar = (
        db.query(
            Atama.talep_id.label("talep_id"),
            Atama.personel_id.label("personel_id"),
            func.row_number()
            .over(
                partition_by=Atama.talep_id,
                order_by=(Atama.olusturulma_tarihi.desc(), Atama.id.desc()),
            )
            .label("sira"),
        )
        .subquery()
    )
    return sirali_atamalar


def personelin_guncel_talep_sorgusu(db: Session, personel_id: uuid.UUID) -> Query:
    """Yalnızca personelin halen sorumlu olduğu (son ataması ona ait) talepleri döndürür."""
    son_atamalar = son_atamalar_alt_sorgusu(db)
    return (
        db.query(Talep)
        .join(son_atamalar, son_atamalar.c.talep_id == Talep.id)
        .filter(son_atamalar.c.sira == 1, son_atamalar.c.personel_id == personel_id)
    )


def personelin_guncel_atamasi_var_mi(db: Session, talep_id: uuid.UUID, personel_id: uuid.UUID) -> bool:
    """Talebin son atamasının belirtilen personele ait olup olmadığını kontrol eder."""
    son_atama = (
        db.query(Atama)
        .filter(Atama.talep_id == talep_id)
        .order_by(Atama.olusturulma_tarihi.desc(), Atama.id.desc())
        .first()
    )
    return son_atama is not None and son_atama.personel_id == personel_id


def personel_notu_olustur(metin: str) -> str:
    """İç notu, vatandaş yanıtlarından filtrelenebilecek biçimde işaretler."""
    return f"{PERSONEL_NOTU_ON_EKI}{metin}"


def personel_notu_mu(aciklama: str | None) -> bool:
    if not aciklama:
        return False
    return aciklama.startswith(PERSONEL_NOTU_ON_EKI) or aciklama.startswith(ESKI_PERSONEL_NOTU_ON_EKI)


def personel_notunu_temizle(aciklama: str | None) -> str | None:
    """Personel ekranında teknik işareti göstermeden iç not metnini döndürür."""
    if not aciklama:
        return aciklama
    if aciklama.startswith(PERSONEL_NOTU_ON_EKI):
        return f"İşlem notu: {aciklama[len(PERSONEL_NOTU_ON_EKI):]}"
    return aciklama
