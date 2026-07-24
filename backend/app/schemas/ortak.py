"""Ortak (paylaşılan) Pydantic şemaları."""

from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class MesajYaniti(BaseModel):
    """Basit başarı/bilgi mesajı döndüren uç noktalar için."""

    mesaj: str


class SayfalanmisYanit(BaseModel, Generic[T]):
    """Liste uç noktaları için standart sayfalama zarfı."""

    toplam: int = Field(..., description="Filtreye uyan toplam kayıt sayısı")
    sayfa: int = Field(..., description="Mevcut sayfa numarası (1'den başlar)")
    sayfa_boyutu: int = Field(..., description="Sayfa başına kayıt sayısı")
    veriler: list[T]
