import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.bildirim import BildirimTuru


class BildirimYaniti(BaseModel):
    id: uuid.UUID
    tur: BildirimTuru
    baslik: str
    mesaj: str
    ilgili_talep_id: uuid.UUID | None
    okundu_mu: bool
    olusturulma_tarihi: datetime

    model_config = {"from_attributes": True}
