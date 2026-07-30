"""Denetim (audit) kaydı oluşturma yardımcı servisi."""

import uuid

from fastapi import Request
from sqlalchemy.orm import Session

from app.models.aktivite_kaydi import AktiviteKaydi


def aktivite_kaydet(
    db: Session,
    kullanici_id: uuid.UUID | None,
    eylem: str,
    hedef_tablo: str,
    hedef_id: uuid.UUID | None = None,
    detay: str | None = None,
    request: Request | None = None,
) -> AktiviteKaydi:
    """
    Yeni bir denetim (audit) kaydı oluşturur. Not: Bu fonksiyon `db.commit()`
    çağırmaz — çağıran fonksiyon, kaydı ilgili işlemle (kategori güncelleme,
    kullanıcı rolü değiştirme vb.) aynı veritabanı işlemi (transaction)
    içinde birlikte commit eder.
    """
    kayit = AktiviteKaydi(
        kullanici_id=kullanici_id,
        eylem=eylem,
        hedef_tablo=hedef_tablo,
        hedef_id=hedef_id,
        detay=detay,
        ip_adresi=request.client.host if request and request.client else None,
    )
    db.add(kayit)
    return kayit
