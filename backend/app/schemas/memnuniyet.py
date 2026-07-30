"""Vatandaş memnuniyet değerlendirmesi ile ilgili istek/yanıt şemaları."""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class MemnuniyetOlusturIstegi(BaseModel):
    puan: int = Field(..., ge=1, le=5, description="1 (çok kötü) ile 5 (çok iyi) arası puan")
    yorum: str | None = Field(None, max_length=1000)


class MemnuniyetYaniti(BaseModel):
    id: uuid.UUID
    talep_id: uuid.UUID
    puan: int
    yorum: str | None
    olusturulma_tarihi: datetime

    model_config = {"from_attributes": True}
