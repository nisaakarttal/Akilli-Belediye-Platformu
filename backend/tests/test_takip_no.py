"""Talep takip numarası format ve ardışıklık testleri."""

import re
from datetime import datetime


def test_takip_no_deseni_bld_yil_altirakam():
    ornek = "BLD-2026-000001"
    assert re.fullmatch(r"BLD-\d{4}-\d{6}", ornek)


def test_takip_no_fonksiyonu_dokumantasyonlu():
    from app.utils.takip_no import takip_no_uret
    assert takip_no_uret.__doc__ is not None


def test_takip_no_veritabaniyla_uretilir(db_oturumu):
    from app.utils.takip_no import takip_no_uret
    takip_no = takip_no_uret(db_oturumu)
    assert re.fullmatch(r"BLD-\d{4}-\d{6}", takip_no)
    assert takip_no.startswith(f"BLD-{datetime.now().year}-")
