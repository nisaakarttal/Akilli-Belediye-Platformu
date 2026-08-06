"""Şifre, JWT ve input validation için saf birim testleri."""

import pytest
from pydantic import ValidationError

from app.core.security import erisim_tokeni_olustur, sifre_dogrula, sifre_hashle, tokeni_coz
from app.schemas.kullanici import KullaniciKayitIstegi


def test_sifre_hashleme_ve_dogrulama():
    duz_sifre = "GucluSifre!123"
    hash_deger = sifre_hashle(duz_sifre)
    assert hash_deger != duz_sifre
    assert sifre_dogrula(duz_sifre, hash_deger) is True
    assert sifre_dogrula("YanlisSifre", hash_deger) is False


def test_ayni_sifre_farkli_hash_uretir():
    ilk = sifre_hashle("GucluSifre!123")
    ikinci = sifre_hashle("GucluSifre!123")
    assert ilk != ikinci
    assert sifre_dogrula("GucluSifre!123", ilk)
    assert sifre_dogrula("GucluSifre!123", ikinci)


def test_erisim_tokeni_olustur_ve_coz():
    token = erisim_tokeni_olustur({"sub": "test-kullanici-id"})
    payload = tokeni_coz(token)
    assert payload is not None
    assert payload["sub"] == "test-kullanici-id"
    assert payload["tip"] == "erisim"


def test_gecersiz_token_coz():
    assert tokeni_coz("gecersiz.bir.token") is None


def test_kayit_telefon_formatini_dogrular():
    with pytest.raises(ValidationError):
        KullaniciKayitIstegi(
            ad="Test",
            soyad="Kullanıcı",
            e_posta="test@example.com",
            telefon="5551234567",
            sifre="Test12345",
        )


def test_kayit_sifresi_harf_ve_rakam_istemeli():
    with pytest.raises(ValidationError):
        KullaniciKayitIstegi(
            ad="Test",
            soyad="Kullanıcı",
            e_posta="test@example.com",
            telefon="05551234567",
            sifre="sadeceharf",
        )
