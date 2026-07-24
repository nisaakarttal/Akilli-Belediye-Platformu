import uuid

from pydantic import BaseModel, Field

from app.models.talep import TalepOnceligi


class AnalizIstegi(BaseModel):
    baslik: str = Field(..., min_length=5, max_length=200)
    aciklama: str = Field(..., min_length=10)


class AnalizYaniti(BaseModel):
    onerilen_kategori_id: uuid.UUID | None
    onerilen_kategori_adi: str | None
    onerilen_oncelik: TalepOnceligi
    guven_skoru: float
    eksik_bilgiler: list[str]
    ai_mesaji: str


class SohbetIstegi(BaseModel):
    mesaj: str = Field(..., min_length=1, max_length=2000)


class SohbetYaniti(BaseModel):
    yanit: str
