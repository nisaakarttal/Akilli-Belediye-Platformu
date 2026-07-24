"""Talep takip numarası üretimi (ör. KAP-2026-00042)."""

import re
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.talep import Talep


def takip_no_uret(db: Session) -> str:
    """
    İçinde bulunulan yıl için bir sonraki sıralı takip numarasını üretir.
    Format: KAP-{YIL}-{5 haneli sıra numarası}

    Not: Yüksek eşzamanlılık senaryolarında (aynı anda çok sayıda talep
    oluşturulması) küçük bir çakışma riski vardır; üretim ortamında bu,
    veritabanı sekansı (sequence) veya `SELECT ... FOR UPDATE` ile
    güçlendirilebilir.
    """
    yil = datetime.now().year
    onek = f"KAP-{yil}-"

    son_kayit = (
        db.query(Talep)
        .filter(Talep.takip_no.like(f"{onek}%"))
        .order_by(Talep.takip_no.desc())
        .first()
    )

    if son_kayit is None:
        sira = 1
    else:
        eslesme = re.search(r"(\d+)$", son_kayit.takip_no)
        sira = int(eslesme.group(1)) + 1 if eslesme else 1

    return f"{onek}{sira:05d}"
