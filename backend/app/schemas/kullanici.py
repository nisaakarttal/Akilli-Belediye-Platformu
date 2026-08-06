"""Kullanıcı ile ilgili istek/yanıt şemaları."""

import re
import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.models.kullanici import KullaniciRolu

TELEFON_DESENI = re.compile(r"^0(5\d{2})\d{7}$")


class KullaniciKayitIstegi(BaseModel):
    """Vatandaş kayıt formu."""

    ad: str = Field(..., min_length=2, max_length=100)
    soyad: str = Field(..., min_length=2, max_length=100)
    e_posta: EmailStr
    telefon: str = Field(..., description="Örn: 05551234567")
    sifre: str = Field(..., min_length=8, max_length=100)
    tc_kimlik_no: str | None = Field(None, min_length=11, max_length=11)
    adres: str | None = None

    @field_validator("telefon")
    @classmethod
    def telefon_dogrula(cls, deger: str) -> str:
        if not TELEFON_DESENI.match(deger):
            raise ValueError("Telefon numarası 05XXXXXXXXX formatında olmalıdır.")
        return deger

    @field_validator("sifre")
    @classmethod
    def sifre_dogrula(cls, deger: str) -> str:
        if not re.search(r"[A-Za-z]", deger) or not re.search(r"\d", deger):
            raise ValueError("Şifre en az bir harf ve bir rakam içermelidir.")
        return deger

    @field_validator("tc_kimlik_no")
    @classmethod
    def tc_kimlik_no_dogrula(cls, deger: str | None) -> str | None:
        if deger is not None and not deger.isdigit():
            raise ValueError("T.C. Kimlik No yalnızca rakamlardan oluşmalıdır.")
        return deger


class KullaniciGirisIstegi(BaseModel):
    """Giriş formu."""

    e_posta: EmailStr
    sifre: str


class SifremiUnuttumIstegi(BaseModel):
    e_posta: EmailStr


class SifreSifirlaIstegi(BaseModel):
    token: str
    yeni_sifre: str = Field(..., min_length=8, max_length=100)

    @field_validator("yeni_sifre")
    @classmethod
    def sifre_dogrula(cls, deger: str) -> str:
        if not re.search(r"[A-Za-z]", deger) or not re.search(r"\d", deger):
            raise ValueError("Şifre en az bir harf ve bir rakam içermelidir.")
        return deger


class SifreDegistirIstegi(BaseModel):
    mevcut_sifre: str = Field(..., min_length=1, max_length=100)
    yeni_sifre: str = Field(..., min_length=8, max_length=100)

    @field_validator("yeni_sifre")
    @classmethod
    def yeni_sifre_dogrula(cls, deger: str) -> str:
        if not re.search(r"[A-Za-z]", deger) or not re.search(r"\d", deger):
            raise ValueError("Şifre en az bir harf ve bir rakam içermelidir.")
        return deger


class KullaniciGuncelleIstegi(BaseModel):
    """Profil güncelleme — tüm alanlar isteğe bağlıdır (kısmi güncelleme)."""

    ad: str | None = Field(None, min_length=2, max_length=100)
    soyad: str | None = Field(None, min_length=2, max_length=100)
    telefon: str | None = None
    adres: str | None = None

    @field_validator("telefon")
    @classmethod
    def telefon_dogrula(cls, deger: str | None) -> str | None:
        if deger is not None and not TELEFON_DESENI.match(deger):
            raise ValueError("Telefon numarası 05XXXXXXXXX formatında olmalıdır.")
        return deger


class KullaniciRolGuncelleIstegi(BaseModel):
    rol: KullaniciRolu
    departman: str | None = None


class KullaniciYaniti(BaseModel):
    """Dışarıya döndürülen kullanıcı bilgisi — şifre hash'i asla dahil edilmez."""

    id: uuid.UUID
    ad: str
    soyad: str
    e_posta: EmailStr
    telefon: str
    rol: KullaniciRolu
    profil_fotografi: str | None
    adres: str | None
    departman: str | None
    aktif_mi: bool
    olusturulma_tarihi: datetime

    model_config = {"from_attributes": True}


class TokenYaniti(BaseModel):
    erisim_tokeni: str
    yenileme_tokeni: str
    token_turu: str = "bearer"
    kullanici: KullaniciYaniti


class YenilemeIstegi(BaseModel):
    yenileme_tokeni: str
