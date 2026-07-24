import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.talep import TalepDurumu, TalepOnceligi
from app.models.talep_dosyasi import DosyaTuru
from app.schemas.kategori import KategoriYaniti
from app.schemas.konum import MahalleYaniti


class TalepOlusturIstegi(BaseModel):
    baslik: str = Field(..., min_length=5, max_length=200)
    aciklama: str = Field(..., min_length=10)
    kategori_id: uuid.UUID
    mahalle_id: uuid.UUID
    adres_detay: str | None = Field(None, max_length=500)
    enlem: float = Field(..., ge=-90, le=90)
    boylam: float = Field(..., ge=-180, le=180)
    oncelik: TalepOnceligi = TalepOnceligi.ORTA

    # Frontend, talep oluşturmadan önce /api/v1/ai/analiz-et uç noktasını çağırıp
    # önerilen değerleri bu alanlarla birlikte gönderebilir (bilgi amaçlı saklanır,
    # nihai kategori/öncelik seçimi her zaman vatandaşa/personele aittir).
    ai_onerilen_kategori_id: uuid.UUID | None = None
    ai_onerilen_oncelik: TalepOnceligi | None = None
    ai_guven_skoru: float | None = Field(None, ge=0.0, le=1.0)


class TalepDurumGuncelleIstegi(BaseModel):
    durum: TalepDurumu
    aciklama: str | None = Field(None, max_length=500)


class TalepAtaIstegi(BaseModel):
    personel_id: uuid.UUID
    not_: str | None = Field(None, max_length=500, alias="not")

    model_config = {"populate_by_name": True}


class TalepCozIstegi(BaseModel):
    cozum_notu: str = Field(..., min_length=5)


class TalepDosyaYaniti(BaseModel):
    id: uuid.UUID
    dosya_turu: DosyaTuru
    dosya_yolu: str
    orijinal_ad: str
    boyut_bayt: int
    olusturulma_tarihi: datetime

    model_config = {"from_attributes": True}


class DurumGecmisiYaniti(BaseModel):
    id: uuid.UUID
    onceki_durum: TalepDurumu | None
    yeni_durum: TalepDurumu
    aciklama: str | None
    olusturulma_tarihi: datetime

    model_config = {"from_attributes": True}


class TalepOlusturanYaniti(BaseModel):
    id: uuid.UUID
    ad: str
    soyad: str

    model_config = {"from_attributes": True}


class TalepListeYaniti(BaseModel):
    id: uuid.UUID
    takip_no: str
    baslik: str
    durum: TalepDurumu
    oncelik: TalepOnceligi
    kategori: KategoriYaniti
    mahalle: MahalleYaniti
    olusturulma_tarihi: datetime

    model_config = {"from_attributes": True}


class TalepDetayYaniti(BaseModel):
    id: uuid.UUID
    takip_no: str
    baslik: str
    aciklama: str
    durum: TalepDurumu
    oncelik: TalepOnceligi
    kategori: KategoriYaniti
    mahalle: MahalleYaniti
    adres_detay: str | None
    enlem: float
    boylam: float
    ai_onerilen_oncelik: TalepOnceligi | None
    ai_guven_skoru: float | None
    olusturan: TalepOlusturanYaniti
    cozum_notu: str | None
    cozulme_tarihi: datetime | None
    olusturulma_tarihi: datetime
    guncellenme_tarihi: datetime
    dosyalar: list[TalepDosyaYaniti]
    durum_gecmisi: list[DurumGecmisiYaniti]

    model_config = {"from_attributes": True}


class TalepHaritaNoktasi(BaseModel):
    id: uuid.UUID
    takip_no: str
    baslik: str
    enlem: float
    boylam: float
    durum: TalepDurumu
    oncelik: TalepOnceligi
    kategori_adi: str
