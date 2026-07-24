import uuid

from pydantic import BaseModel, Field


class IlceOlusturIstegi(BaseModel):
    ad: str = Field(..., min_length=2, max_length=100)
    il: str = Field("Tekirdağ", max_length=100)
    merkez_enlem: float
    merkez_boylam: float


class IlceYaniti(BaseModel):
    id: uuid.UUID
    ad: str
    il: str
    merkez_enlem: float
    merkez_boylam: float

    model_config = {"from_attributes": True}


class MahalleOlusturIstegi(BaseModel):
    ad: str = Field(..., min_length=2, max_length=150)
    ilce_id: uuid.UUID
    merkez_enlem: float
    merkez_boylam: float


class MahalleYaniti(BaseModel):
    id: uuid.UUID
    ad: str
    ilce_id: uuid.UUID
    merkez_enlem: float
    merkez_boylam: float

    model_config = {"from_attributes": True}
