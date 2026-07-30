"""Bildirim oluşturma yardımcı servisi."""

import uuid
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.ws_manager import baglanti_yoneticisi
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
    Yeni bir bildirim kaydı oluşturur ve WebSocket üzerinden ilgili kullanıcıya
    gerçek zamanlı olarak iletir. Not: Bu fonksiyon `db.commit()` çağırmaz —
    çağıran fonksiyon, bildirimi ilgili işlemle (durum güncelleme, atama vb.)
    aynı veritabanı işlemi (transaction) içinde birlikte commit eder. Kaydın
    id'sini elde edebilmek için yalnızca `db.flush()` çağrılır.
    """
    bildirim = Bildirim(
        kullanici_id=kullanici_id,
        tur=tur,
        baslik=baslik,
        mesaj=mesaj,
        ilgili_talep_id=ilgili_talep_id,
    )
    db.add(bildirim)
    db.flush()

    baglanti_yoneticisi.kullaniciya_gonder(
        kullanici_id,
        {
            "id": str(bildirim.id),
            "tur": tur.value,
            "baslik": baslik,
            "mesaj": mesaj,
            "ilgili_talep_id": str(ilgili_talep_id) if ilgili_talep_id else None,
            "okundu_mu": False,
            "olusturulma_tarihi": datetime.now(timezone.utc).isoformat(),
        },
    )

    return bildirim
