"""Bildirim oluşturma yardımcı servisi."""

import uuid

from sqlalchemy.orm import Session

from app.models.bildirim import Bildirim, BildirimTuru


def bildirim_olustur(
    db: Session,
    kullanici_id: uuid.UUID,
    tur: BildirimTuru,
    baslik: str,
    mesaj: str,
    ilgili_talep_id: uuid.UUID | None = None,
) -> Bildirim:
    """
    Yeni bir bildirim kaydı oluşturur. Not: Bu fonksiyon `db.commit()` çağırmaz —
    çağıran fonksiyon, bildirimi ilgili işlemle (durum güncelleme, atama vb.)
    aynı veritabanı işlemi (transaction) içinde birlikte commit eder.
    """
    bildirim = Bildirim(
        kullanici_id=kullanici_id,
        tur=tur,
        baslik=baslik,
        mesaj=mesaj,
        ilgili_talep_id=ilgili_talep_id,
    )
    db.add(bildirim)
    return bildirim
