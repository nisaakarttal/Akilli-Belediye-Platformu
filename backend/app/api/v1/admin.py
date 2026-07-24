"""Yönetici istatistik/dashboard uç noktaları."""

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import sadece_admin
from app.core.database import get_db
from app.models.kategori import Kategori
from app.models.kullanici import Kullanici
from app.models.mahalle import Mahalle
from app.models.talep import Talep, TalepDurumu
from app.schemas.admin import (
    GenelIstatistikYaniti,
    GunlukTalepNoktasi,
    KategoriDagilimNoktasi,
    MahalleDagilimNoktasi,
)

router = APIRouter()


@router.get("/istatistikler", response_model=GenelIstatistikYaniti)
def genel_istatistikler(db: Session = Depends(get_db), _: Kullanici = Depends(sadece_admin)):
    """Genel özet istatistikler: toplam, bugünkü/haftalık/aylık talep sayıları, tamamlanma oranı."""
    simdi = datetime.now(timezone.utc)
    bugun_baslangic = simdi.replace(hour=0, minute=0, second=0, microsecond=0)
    hafta_baslangic = bugun_baslangic - timedelta(days=bugun_baslangic.weekday())
    ay_baslangic = bugun_baslangic.replace(day=1)

    toplam = db.query(Talep).count()
    bugunku = db.query(Talep).filter(Talep.olusturulma_tarihi >= bugun_baslangic).count()
    bu_hafta = db.query(Talep).filter(Talep.olusturulma_tarihi >= hafta_baslangic).count()
    bu_ay = db.query(Talep).filter(Talep.olusturulma_tarihi >= ay_baslangic).count()
    cozulen = (
        db.query(Talep)
        .filter(Talep.durum.in_([TalepDurumu.COZULDU, TalepDurumu.KAPATILDI]))
        .count()
    )
    bekleyen = db.query(Talep).filter(Talep.durum == TalepDurumu.BEKLIYOR).count()

    tamamlanma_orani = round((cozulen / toplam) * 100, 1) if toplam > 0 else 0.0

    return GenelIstatistikYaniti(
        toplam_talep=toplam,
        bugunku_talep=bugunku,
        bu_hafta_talep=bu_hafta,
        bu_ay_talep=bu_ay,
        cozulen_talep=cozulen,
        bekleyen_talep=bekleyen,
        tamamlanma_orani=tamamlanma_orani,
    )


@router.get("/istatistikler/kategori-dagilimi", response_model=list[KategoriDagilimNoktasi])
def kategori_dagilimi(db: Session = Depends(get_db), _: Kullanici = Depends(sadece_admin)):
    """Kategoriye göre talep sayısı dağılımı (pasta/çubuk grafik için)."""
    sonuclar = (
        db.query(Kategori.ad, func.count(Talep.id))
        .join(Talep, Talep.kategori_id == Kategori.id)
        .group_by(Kategori.ad)
        .order_by(func.count(Talep.id).desc())
        .all()
    )
    return [KategoriDagilimNoktasi(kategori_adi=ad, sayi=sayi) for ad, sayi in sonuclar]


@router.get("/istatistikler/mahalle-dagilimi", response_model=list[MahalleDagilimNoktasi])
def mahalle_dagilimi(db: Session = Depends(get_db), _: Kullanici = Depends(sadece_admin)):
    """Mahalleye göre talep sayısı dağılımı."""
    sonuclar = (
        db.query(Mahalle.ad, func.count(Talep.id))
        .join(Talep, Talep.mahalle_id == Mahalle.id)
        .group_by(Mahalle.ad)
        .order_by(func.count(Talep.id).desc())
        .all()
    )
    return [MahalleDagilimNoktasi(mahalle_adi=ad, sayi=sayi) for ad, sayi in sonuclar]


@router.get("/istatistikler/gunluk-talepler", response_model=list[GunlukTalepNoktasi])
def gunluk_talepler(
    gun_sayisi: int = 30,
    db: Session = Depends(get_db),
    _: Kullanici = Depends(sadece_admin),
):
    """Son N gün için günlük talep sayısı (çizgi grafik için)."""
    baslangic = datetime.now(timezone.utc) - timedelta(days=gun_sayisi)
    sonuclar = (
        db.query(func.date(Talep.olusturulma_tarihi).label("tarih"), func.count(Talep.id))
        .filter(Talep.olusturulma_tarihi >= baslangic)
        .group_by("tarih")
        .order_by("tarih")
        .all()
    )
    return [GunlukTalepNoktasi(tarih=str(tarih), sayi=sayi) for tarih, sayi in sonuclar]
