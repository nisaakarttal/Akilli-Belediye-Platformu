"""Yönetici istatistik/dashboard uç noktaları."""

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import sadece_admin
from app.core.cache import cache_getir, cache_yaz
from app.core.database import get_db
from app.models.aktivite_kaydi import AktiviteKaydi
from app.models.atama import Atama
from app.models.kategori import Kategori
from app.models.kullanici import Kullanici, KullaniciRolu
from app.models.mahalle import Mahalle
from app.models.memnuniyet import Memnuniyet
from app.models.talep import Talep, TalepDurumu
from app.schemas.admin import (
    AktiviteKaydiYaniti,
    GenelIstatistikYaniti,
    GunlukTalepNoktasi,
    KategoriDagilimNoktasi,
    MahalleAnalizNoktasi,
    MahalleDagilimNoktasi,
    MemnuniyetKategoriNoktasi,
    MemnuniyetPersonelNoktasi,
    PersonelPerformansNoktasi,
)
from app.schemas.ortak import SayfalanmisYanit

router = APIRouter()

DASHBOARD_CACHE_SURESI = 300  # saniye


@router.get("/istatistikler", response_model=GenelIstatistikYaniti)
def genel_istatistikler(db: Session = Depends(get_db), _: Kullanici = Depends(sadece_admin)):
    """Genel özet istatistikler: toplam, bugünkü/haftalık/aylık talep sayıları, tamamlanma oranı."""
    cache_anahtari = "dashboard:genel-istatistikler"
    onbellekteki = cache_getir(cache_anahtari)
    if onbellekteki is not None:
        return onbellekteki

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
    tum_talepler = db.query(Talep).all()
    geciken = sum(t.gecikti_mi for t in tum_talepler)
    acil = sum(t.oncelik.value == "acil" for t in tum_talepler)
    sla_olculen = [t for t in tum_talepler if t.son_cozum_tarihi is not None]
    sla_basarili = sum(not t.gecikti_mi for t in sla_olculen)
    sla_basari_orani = round((sla_basarili / len(sla_olculen)) * 100, 1) if sla_olculen else 100.0

    tamamlanma_orani = round((cozulen / toplam) * 100, 1) if toplam > 0 else 0.0

    sonuc = GenelIstatistikYaniti(
        toplam_talep=toplam,
        bugunku_talep=bugunku,
        bu_hafta_talep=bu_hafta,
        bu_ay_talep=bu_ay,
        cozulen_talep=cozulen,
        bekleyen_talep=bekleyen,
        tamamlanma_orani=tamamlanma_orani,
        geciken_talep=geciken,
        acil_talep=acil,
        sla_basari_orani=sla_basari_orani,
    )
    cache_yaz(cache_anahtari, sonuc.model_dump(mode="json"), sure_saniye=DASHBOARD_CACHE_SURESI)
    return sonuc


@router.get("/istatistikler/kategori-dagilimi", response_model=list[KategoriDagilimNoktasi])
def kategori_dagilimi(db: Session = Depends(get_db), _: Kullanici = Depends(sadece_admin)):
    """Kategoriye göre talep sayısı dağılımı (pasta/çubuk grafik için)."""
    cache_anahtari = "dashboard:kategori-dagilimi"
    onbellekteki = cache_getir(cache_anahtari)
    if onbellekteki is not None:
        return onbellekteki

    sonuclar = (
        db.query(Kategori.ad, func.count(Talep.id))
        .join(Talep, Talep.kategori_id == Kategori.id)
        .group_by(Kategori.ad)
        .order_by(func.count(Talep.id).desc())
        .all()
    )
    sonuc = [KategoriDagilimNoktasi(kategori_adi=ad, sayi=sayi) for ad, sayi in sonuclar]
    cache_yaz(cache_anahtari, [n.model_dump(mode="json") for n in sonuc], sure_saniye=DASHBOARD_CACHE_SURESI)
    return sonuc


@router.get("/istatistikler/mahalle-dagilimi", response_model=list[MahalleDagilimNoktasi])
def mahalle_dagilimi(db: Session = Depends(get_db), _: Kullanici = Depends(sadece_admin)):
    """Mahalleye göre talep sayısı dağılımı."""
    cache_anahtari = "dashboard:mahalle-dagilimi"
    onbellekteki = cache_getir(cache_anahtari)
    if onbellekteki is not None:
        return onbellekteki

    sonuclar = (
        db.query(Mahalle.ad, func.count(Talep.id))
        .join(Talep, Talep.mahalle_id == Mahalle.id)
        .group_by(Mahalle.ad)
        .order_by(func.count(Talep.id).desc())
        .all()
    )
    sonuc = [MahalleDagilimNoktasi(mahalle_adi=ad, sayi=sayi) for ad, sayi in sonuclar]
    cache_yaz(cache_anahtari, [n.model_dump(mode="json") for n in sonuc], sure_saniye=DASHBOARD_CACHE_SURESI)
    return sonuc


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


@router.get("/istatistikler/mahalle-analizi", response_model=list[MahalleAnalizNoktasi])
def mahalle_analizi(db: Session = Depends(get_db), _: Kullanici = Depends(sadece_admin)):
    """
    Mahalle bazlı analiz: talep sayısı, ortalama çözüm süresi (saat) ve en çok
    şikâyet alınan kategori. Sonuçlar talep sayısına göre azalan sırada döner,
    yani en çok şikâyet alan mahalleler listenin başında yer alır.
    """
    cozum_suresi_saat = func.extract("epoch", Talep.cozulme_tarihi - Talep.olusturulma_tarihi) / 3600.0

    temel = (
        db.query(Mahalle.ad, func.count(Talep.id), func.avg(cozum_suresi_saat))
        .join(Talep, Talep.mahalle_id == Mahalle.id)
        .group_by(Mahalle.ad)
        .order_by(func.count(Talep.id).desc())
        .all()
    )

    sonuclar = []
    for mahalle_adi, talep_sayisi, ortalama_saat in temel:
        en_cok_kategori = (
            db.query(Kategori.ad)
            .join(Talep, Talep.kategori_id == Kategori.id)
            .join(Mahalle, Talep.mahalle_id == Mahalle.id)
            .filter(Mahalle.ad == mahalle_adi)
            .group_by(Kategori.ad)
            .order_by(func.count(Talep.id).desc())
            .first()
        )
        sonuclar.append(
            MahalleAnalizNoktasi(
                mahalle_adi=mahalle_adi,
                talep_sayisi=talep_sayisi,
                ortalama_cozum_suresi_saat=round(ortalama_saat, 1) if ortalama_saat is not None else None,
                en_cok_sikayet_kategorisi=en_cok_kategori[0] if en_cok_kategori else None,
            )
        )
    return sonuclar


@router.get("/istatistikler/personel-performans", response_model=list[PersonelPerformansNoktasi])
def personel_performansi(db: Session = Depends(get_db), _: Kullanici = Depends(sadece_admin)):
    """
    Personel bazlı performans özeti: çözülen/bekleyen talep sayısı, ortalama
    çözüm süresi, tamamlanma oranı, memnuniyet ortalaması ve bunları
    birleştiren bir performans puanı (0-100).
    """
    personeller = (
        db.query(Kullanici).filter(Kullanici.rol.in_([KullaniciRolu.PERSONEL, KullaniciRolu.ADMIN])).all()
    )

    sonuclar = []
    for personel in personeller:
        talep_idleri = (
            db.query(Atama.talep_id).filter(Atama.personel_id == personel.id).distinct().subquery()
        )
        atanan_talepler = db.query(Talep).filter(Talep.id.in_(talep_idleri)).all()

        if not atanan_talepler:
            continue

        cozulen = [t for t in atanan_talepler if t.durum in (TalepDurumu.COZULDU, TalepDurumu.KAPATILDI)]
        bekleyen = [t for t in atanan_talepler if t.durum not in (TalepDurumu.COZULDU, TalepDurumu.KAPATILDI)]

        sureler = [
            (t.cozulme_tarihi - t.olusturulma_tarihi).total_seconds() / 3600.0
            for t in cozulen
            if t.cozulme_tarihi is not None
        ]
        ortalama_sure = round(sum(sureler) / len(sureler), 1) if sureler else None

        tamamlanma_orani = round((len(cozulen) / len(atanan_talepler)) * 100, 1)

        memnuniyet_puanlari = [t.memnuniyet.puan for t in cozulen if t.memnuniyet is not None]
        memnuniyet_ortalamasi = (
            round(sum(memnuniyet_puanlari) / len(memnuniyet_puanlari), 2) if memnuniyet_puanlari else None
        )

        zamaninda_orani = (
            len([t for t in cozulen if not t.gecikti_mi]) / len(cozulen) if cozulen else 0.0
        )

        # Performans puanı: tamamlanma oranı (%40), memnuniyet (%30) ve
        # zamanında çözme oranı (%30) ağırlıklandırılarak hesaplanır.
        # Henüz değerlendirme almamış personel için memnuniyet ağırlığı
        # tamamlanma oranına eklenir.
        memnuniyet_bileseni = (
            (memnuniyet_ortalamasi / 5 * 100) if memnuniyet_ortalamasi is not None else tamamlanma_orani
        )
        performans_puani = round(
            (tamamlanma_orani * 0.4) + (memnuniyet_bileseni * 0.3) + (zamaninda_orani * 100 * 0.3), 1
        )

        sonuclar.append(
            PersonelPerformansNoktasi(
                personel_id=personel.id,
                ad_soyad=f"{personel.ad} {personel.soyad}",
                cozulen_talep=len(cozulen),
                bekleyen_talep=len(bekleyen),
                ortalama_cozum_suresi_saat=ortalama_sure,
                tamamlanma_orani=tamamlanma_orani,
        geciken_talep=geciken,
        acil_talep=acil,
        sla_basari_orani=sla_basari_orani,
                memnuniyet_ortalamasi=memnuniyet_ortalamasi,
                performans_puani=performans_puani,
            )
        )

    sonuclar.sort(key=lambda x: x.performans_puani, reverse=True)
    return sonuclar


@router.get("/istatistikler/memnuniyet-personel", response_model=list[MemnuniyetPersonelNoktasi])
def memnuniyet_personel_bazinda(db: Session = Depends(get_db), _: Kullanici = Depends(sadece_admin)):
    """Personel bazında ortalama memnuniyet puanı (kendisine atanan ve değerlendirilmiş talepler üzerinden)."""
    sonuclar = (
        db.query(Kullanici.id, Kullanici.ad, Kullanici.soyad, func.avg(Memnuniyet.puan), func.count(Memnuniyet.id))
        .join(Atama, Atama.personel_id == Kullanici.id)
        .join(Memnuniyet, Memnuniyet.talep_id == Atama.talep_id)
        .group_by(Kullanici.id, Kullanici.ad, Kullanici.soyad)
        .order_by(func.avg(Memnuniyet.puan).desc())
        .all()
    )
    return [
        MemnuniyetPersonelNoktasi(
            personel_id=personel_id,
            ad_soyad=f"{ad} {soyad}",
            ortalama_puan=round(float(ortalama), 2),
            degerlendirme_sayisi=sayi,
        )
        for personel_id, ad, soyad, ortalama, sayi in sonuclar
    ]


@router.get("/istatistikler/memnuniyet-kategori", response_model=list[MemnuniyetKategoriNoktasi])
def memnuniyet_kategori_bazinda(db: Session = Depends(get_db), _: Kullanici = Depends(sadece_admin)):
    """Kategori bazında ortalama memnuniyet puanı."""
    sonuclar = (
        db.query(Kategori.ad, func.avg(Memnuniyet.puan), func.count(Memnuniyet.id))
        .join(Talep, Talep.kategori_id == Kategori.id)
        .join(Memnuniyet, Memnuniyet.talep_id == Talep.id)
        .group_by(Kategori.ad)
        .order_by(func.avg(Memnuniyet.puan).desc())
        .all()
    )
    return [
        MemnuniyetKategoriNoktasi(
            kategori_adi=ad, ortalama_puan=round(float(ortalama), 2), degerlendirme_sayisi=sayi
        )
        for ad, ortalama, sayi in sonuclar
    ]


@router.get("/aktivite-kayitlari", response_model=SayfalanmisYanit[AktiviteKaydiYaniti])
def aktivite_kayitlarini_listele(
    eylem: str | None = Query(None, description="Eylem adına göre filtrele (ör. 'kategori_guncellendi')"),
    hedef_tablo: str | None = Query(None, description="Hedef tabloya göre filtrele (ör. 'kategoriler')"),
    kullanici_id: str | None = Query(None, description="Belirli bir kullanıcının işlemlerine göre filtrele"),
    sayfa: int = Query(1, ge=1),
    sayfa_boyutu: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _: Kullanici = Depends(sadece_admin),
):
    """
    Denetim (audit) kayıtlarını listeler: yönetici işlemleri (kategori/kullanıcı
    değişiklikleri), sistem tarafından üretilen kayıtlar (zamanlanmış görevler,
    rate limit ihlalleri) dahil tüm işlem geçmişi. Yalnızca yönetici.
    """
    sorgu = db.query(AktiviteKaydi)

    if eylem is not None:
        sorgu = sorgu.filter(AktiviteKaydi.eylem == eylem)
    if hedef_tablo is not None:
        sorgu = sorgu.filter(AktiviteKaydi.hedef_tablo == hedef_tablo)
    if kullanici_id is not None:
        sorgu = sorgu.filter(AktiviteKaydi.kullanici_id == kullanici_id)

    toplam = sorgu.count()
    kayitlar = (
        sorgu.order_by(AktiviteKaydi.olusturulma_tarihi.desc())
        .offset((sayfa - 1) * sayfa_boyutu)
        .limit(sayfa_boyutu)
        .all()
    )

    return SayfalanmisYanit(toplam=toplam, sayfa=sayfa, sayfa_boyutu=sayfa_boyutu, veriler=kayitlar)
