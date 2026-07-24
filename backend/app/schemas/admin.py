from pydantic import BaseModel


class GenelIstatistikYaniti(BaseModel):
    toplam_talep: int
    bugunku_talep: int
    bu_hafta_talep: int
    bu_ay_talep: int
    cozulen_talep: int
    bekleyen_talep: int
    tamamlanma_orani: float


class KategoriDagilimNoktasi(BaseModel):
    kategori_adi: str
    sayi: int


class MahalleDagilimNoktasi(BaseModel):
    mahalle_adi: str
    sayi: int


class GunlukTalepNoktasi(BaseModel):
    tarih: str
    sayi: int
