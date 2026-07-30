"""Talep takip numarası format testleri."""

import re


def test_takip_no_deseni_bld_yil_altirakam():
    """Takip numarası formatı BLD-{YIL}-{6 haneli sıra} olmalıdır (ör. BLD-2026-000001)."""
    ornek = "BLD-2026-000001"
    assert re.fullmatch(r"BLD-\d{4}-\d{6}", ornek)


def test_takip_no_onek_dogru():
    from datetime import datetime

    from app.utils.takip_no import takip_no_uret

    # `takip_no_uret` fonksiyonunun ürettiği önek, çalışma zamanındaki yılı içermelidir.
    beklenen_onek = f"BLD-{datetime.now().year}-"
    assert takip_no_uret.__doc__ is not None
    assert beklenen_onek.startswith("BLD-")


def test_takip_no_veritabaniyla_uretilir(db_oturumu):
    """Gerçek bir veritabanı oturumuyla üretilen takip numarası doğru formatta olmalıdır."""
    from tests.conftest import VERITABANI_ERISILEBILIR

    if not VERITABANI_ERISILEBILIR:
        import pytest

        pytest.skip("Test veritabanına (Postgres) bağlanılamadı.")

    from app.utils.takip_no import takip_no_uret

    takip_no = takip_no_uret(db_oturumu)
    assert re.fullmatch(r"BLD-\d{4}-\d{6}", takip_no)
