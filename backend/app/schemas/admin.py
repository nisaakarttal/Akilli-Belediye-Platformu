import uuid
from datetime import datetime

from pydantic import BaseModel


class GenelIstatistikYaniti(BaseModel):
    toplam_talep: int
    bugunku_talep: int
    bu_hafta_talep: int
    bu_ay_talep: int
    cozulen_talep: int
    bekleyen_talep: int
    tamamlanma_orani: float
    geciken_talep: int
    acil_talep: int
    sla_basari_orani: float


class KategoriDagilimNoktasi(BaseModel):
    kategori_adi: str
    sayi: int


class MahalleDagilimNoktasi(BaseModel):
    mahalle_adi: str
    sayi: int


class GunlukTalepNoktasi(BaseModel):
    tarih: str
    sayi: int


class MahalleAnalizNoktasi(BaseModel):
    """Mahalle bazlı analiz: talep sayısı, ortalama çözüm süresi ve en çok şikâyet alınan kategori."""

    mahalle_adi: str
    talep_sayisi: int
    ortalama_cozum_suresi_saat: float | None
    en_cok_sikayet_kategorisi: str | None


class PersonelPerformansNoktasi(BaseModel):
    """Personel bazlı performans özeti."""

    personel_id: uuid.UUID
    ad_soyad: str
    cozulen_talep: int
    bekleyen_talep: int
    ortalama_cozum_suresi_saat: float | None
    tamamlanma_orani: float
    geciken_talep: int
    acil_talep: int
    sla_basari_orani: float
    memnuniyet_ortalamasi: float | None
    performans_puani: float


class MemnuniyetPersonelNoktasi(BaseModel):
    personel_id: uuid.UUID
    ad_soyad: str
    ortalama_puan: float
    degerlendirme_sayisi: int


class MemnuniyetKategoriNoktasi(BaseModel):
    kategori_adi: str
    ortalama_puan: float
    degerlendirme_sayisi: int


class AktiviteKaydiYaniti(BaseModel):
    """Denetim (audit) kaydı — yönetici işlemlerinin ve sistem görevlerinin izlenmesi için."""

    id: uuid.UUID
    kullanici_id: uuid.UUID | None
    eylem: str
    hedef_tablo: str
    hedef_id: uuid.UUID | None
    detay: str | None
    ip_adresi: str | None
    olusturulma_tarihi: datetime

    model_config = {"from_attributes": True}
