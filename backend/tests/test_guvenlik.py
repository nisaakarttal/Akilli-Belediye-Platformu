"""Şifre hashleme ve JWT token işlemleri için birim testleri (veritabanı gerektirmez)."""

from app.core.security import (
    erisim_tokeni_olustur,
    sifre_dogrula,
    sifre_hashle,
    tokeni_coz,
)


def test_sifre_hashleme_ve_dogrulama():
    duz_sifre = "GucluSifre!123"
    hash_deger = sifre_hashle(duz_sifre)

    assert hash_deger != duz_sifre
    assert sifre_dogrula(duz_sifre, hash_deger) is True
    assert sifre_dogrula("YanlisSifre", hash_deger) is False


def test_erisim_tokeni_olustur_ve_coz():
    token = erisim_tokeni_olustur({"sub": "test-kullanici-id"})
    payload = tokeni_coz(token)

    assert payload is not None
    assert payload["sub"] == "test-kullanici-id"
    assert payload["tip"] == "erisim"


def test_gecersiz_token_coz():
    assert tokeni_coz("gecersiz.bir.token") is None
