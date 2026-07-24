import uuid

from pydantic import BaseModel, Field


class KategoriOlusturIstegi(BaseModel):
    ad: str = Field(..., min_length=2, max_length=150)
    aciklama: str | None = Field(None, max_length=500)
    ikon: str | None = Field(None, max_length=100)
    sorumlu_departman: str = Field(..., min_length=2, max_length=150)
    renk: str = Field("#2563EB", max_length=20)


class KategoriGuncelleIstegi(BaseModel):
    ad: str | None = Field(None, min_length=2, max_length=150)
    aciklama: str | None = Field(None, max_length=500)
    ikon: str | None = Field(None, max_length=100)
    sorumlu_departman: str | None = Field(None, min_length=2, max_length=150)
    renk: str | None = Field(None, max_length=20)


class KategoriYaniti(BaseModel):
    id: uuid.UUID
    ad: str
    aciklama: str | None
    ikon: str | None
    sorumlu_departman: str
    renk: str

    model_config = {"from_attributes": True}
