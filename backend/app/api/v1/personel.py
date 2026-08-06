"""Personel uç noktaları — yalnızca personele güncel olarak atanmış taleplerin yönetimi."""

import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.deps import sadece_personel
from app.core.database import get_db
from app.models.bildirim import BildirimTuru
from app.models.durum_gecmisi import DurumGecmisi
from app.models.kullanici import Kullanici
from app.models.memnuniyet import Memnuniyet
from app.models.talep import Talep, TalepDurumu, TalepOnceligi
from app.schemas.talep import TalepCozIstegi, TalepDetayYaniti, TalepDurumGuncelleIstegi, TalepListeYaniti
from app.services.bildirim_servisi import bildirim_olustur
from app.services.talep_yetki_servisi import (
    personel_notu_olustur,
    personel_notunu_temizle,
    personelin_guncel_atamasi_var_mi,
    personelin_guncel_talep_sorgusu,
)

router = APIRouter()


class PersonelNotIstegi(BaseModel):
    not_: str = Field(..., min_length=2, max_length=500, alias="not")

    model_config = {"populate_by_name": True}


class VatandasBilgilendirmeIstegi(BaseModel):
    mesaj: str = Field(..., min_length=2, max_length=500)


class PersonelIstatistikleri(BaseModel):
    toplam: int
    bekleyen: int
    inceleniyor: int
    atandi: int
    cozuldu: int
    geciken: int
    acil: int
    son_7_gun_cozulen: int


class PersonelDashboardYaniti(BaseModel):
    istatistikler: PersonelIstatistikleri
    son_atananlar: list[TalepListeYaniti]
    acil_talepler: list[TalepListeYaniti]


class PersonelMemnuniyetKaydi(BaseModel):
    talep_id: uuid.UUID
    takip_no: str
    baslik: str
    puan: int
    yorum: str | None
    olusturulma_tarihi: datetime


class PersonelMemnuniyetIstatistikleri(BaseModel):
    toplam_degerlendirme: int
    ortalama_puan: float | None
    olumlu_oran: float
    bes_yildiz: int
    dagilim: dict[int, int]
    son_degerlendirmeler: list[PersonelMemnuniyetKaydi]


def _atanmis_talep_sorgusu(db: Session, kullanici: Kullanici):
    return personelin_guncel_talep_sorgusu(db, kullanici.id).options(
        joinedload(Talep.kategori),
        joinedload(Talep.mahalle),
        joinedload(Talep.olusturan),
        joinedload(Talep.dosyalar),
        joinedload(Talep.durum_gecmisi),
    )


def _atanmis_talebi_getir(db: Session, kullanici: Kullanici, talep_id: uuid.UUID) -> Talep:
    if not personelin_guncel_atamasi_var_mi(db, talep_id, kullanici.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu talep güncel olarak size atanmadığı için işlem yapamazsınız.",
        )
    talep = _atanmis_talep_sorgusu(db, kullanici).filter(Talep.id == talep_id).first()
    if talep is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Talep bulunamadı.")
    return talep


def _personel_detay_yaniti(talep: Talep) -> TalepDetayYaniti:
    """İç not işaretini personel arayüzüne teknik prefix olmadan döndürür."""
    yanit = TalepDetayYaniti.model_validate(talep)
    for kayit in yanit.durum_gecmisi:
        kayit.aciklama = personel_notunu_temizle(kayit.aciklama)
    return yanit


@router.get("/dashboard", response_model=PersonelDashboardYaniti)
def personel_dashboard(
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel),
):
    """Personelin yalnızca güncel atamalarından dashboard özetini üretir."""
    sorgu = _atanmis_talep_sorgusu(db, kullanici)
    talepler = sorgu.order_by(Talep.olusturulma_tarihi.desc()).all()

    return PersonelDashboardYaniti(
        istatistikler=PersonelIstatistikleri(
            toplam=len(talepler),
            bekleyen=sum(t.durum == TalepDurumu.BEKLIYOR for t in talepler),
            inceleniyor=sum(t.durum == TalepDurumu.INCELENIYOR for t in talepler),
            atandi=sum(t.durum == TalepDurumu.ATANDI for t in talepler),
            cozuldu=sum(t.durum in (TalepDurumu.COZULDU, TalepDurumu.KAPATILDI) for t in talepler),
            geciken=sum(t.gecikti_mi for t in talepler),
            acil=sum(t.oncelik == TalepOnceligi.ACIL for t in talepler),
            son_7_gun_cozulen=sum(
                t.cozulme_tarihi is not None
                and t.cozulme_tarihi >= datetime.now(timezone.utc) - timedelta(days=7)
                for t in talepler
            ),
        ),
        son_atananlar=talepler[:5],
        acil_talepler=[t for t in talepler if t.oncelik == TalepOnceligi.ACIL][:5],
    )


@router.get("/memnuniyet-istatistikleri", response_model=PersonelMemnuniyetIstatistikleri)
def personel_memnuniyet_istatistikleri(
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel),
):
    """Personelin halen sorumlu olduğu talepler için vatandaş memnuniyet özetini döndürür."""
    talep_idleri = personelin_guncel_talep_sorgusu(db, kullanici.id).with_entities(Talep.id).subquery()
    kayitlar = (
        db.query(Memnuniyet, Talep)
        .join(Talep, Talep.id == Memnuniyet.talep_id)
        .filter(Memnuniyet.talep_id.in_(select(talep_idleri.c.id)))
        .order_by(Memnuniyet.olusturulma_tarihi.desc())
        .all()
    )

    puanlar = [memnuniyet.puan for memnuniyet, _ in kayitlar]
    toplam = len(puanlar)
    dagilim = {puan: puanlar.count(puan) for puan in range(1, 6)}
    olumlu = sum(puan >= 4 for puan in puanlar)

    return PersonelMemnuniyetIstatistikleri(
        toplam_degerlendirme=toplam,
        ortalama_puan=round(sum(puanlar) / toplam, 2) if toplam else None,
        olumlu_oran=round((olumlu / toplam) * 100, 1) if toplam else 0.0,
        bes_yildiz=dagilim[5],
        dagilim=dagilim,
        son_degerlendirmeler=[
            PersonelMemnuniyetKaydi(
                talep_id=talep.id,
                takip_no=talep.takip_no,
                baslik=talep.baslik,
                puan=memnuniyet.puan,
                yorum=memnuniyet.yorum,
                olusturulma_tarihi=memnuniyet.olusturulma_tarihi,
            )
            for memnuniyet, talep in kayitlar[:10]
        ],
    )


@router.get("/atanan-talepler", response_model=list[TalepListeYaniti])
def atanan_talepleri_listele(
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel),
):
    return _atanmis_talep_sorgusu(db, kullanici).order_by(Talep.olusturulma_tarihi.desc()).all()


@router.get("/atanan-talepler/{talep_id}", response_model=TalepDetayYaniti)
def atanan_talep_detayi(
    talep_id: uuid.UUID,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel),
):
    return _personel_detay_yaniti(_atanmis_talebi_getir(db, kullanici, talep_id))


@router.put("/atanan-talepler/{talep_id}/durum", response_model=TalepDetayYaniti)
def atanan_talep_durumunu_guncelle(
    talep_id: uuid.UUID,
    istek: TalepDurumGuncelleIstegi,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel),
):
    talep = _atanmis_talebi_getir(db, kullanici, talep_id)
    izinli_durumlar = {
        TalepDurumu.BEKLIYOR,
        TalepDurumu.INCELENIYOR,
        TalepDurumu.COZULDU,
        TalepDurumu.KAPATILDI,
    }
    if istek.durum not in izinli_durumlar:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Personel bu durum değerini seçemez.")

    onceki_durum = talep.durum
    talep.durum = istek.durum
    if istek.durum == TalepDurumu.COZULDU:
        talep.cozulme_tarihi = datetime.now(timezone.utc)
        if istek.aciklama:
            talep.cozum_notu = istek.aciklama
    elif onceki_durum == TalepDurumu.COZULDU:
        talep.cozulme_tarihi = None

    db.add(
        DurumGecmisi(
            talep_id=talep.id,
            onceki_durum=onceki_durum,
            yeni_durum=istek.durum,
            aciklama=istek.aciklama,
            degistiren_id=kullanici.id,
        )
    )
    bildirim_olustur(
        db,
        kullanici_id=talep.olusturan_id,
        tur=BildirimTuru.DURUM_DEGISTI,
        baslik="Talebinizin durumu güncellendi",
        mesaj=f"{talep.takip_no} numaralı talebinizin durumu güncellendi.",
        ilgili_talep_id=talep.id,
    )
    db.commit()
    return _personel_detay_yaniti(_atanmis_talebi_getir(db, kullanici, talep_id))


@router.post("/atanan-talepler/{talep_id}/coz", response_model=TalepDetayYaniti)
def atanan_talebi_coz(
    talep_id: uuid.UUID,
    istek: TalepCozIstegi,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel),
):
    """Personelin kendi talebini çözüm notuyla çözüldü olarak işaretlemesini sağlar."""
    talep = _atanmis_talebi_getir(db, kullanici, talep_id)
    onceki_durum = talep.durum
    talep.durum = TalepDurumu.COZULDU
    talep.cozum_notu = istek.cozum_notu
    talep.cozulme_tarihi = datetime.now(timezone.utc)

    db.add(
        DurumGecmisi(
            talep_id=talep.id,
            onceki_durum=onceki_durum,
            yeni_durum=TalepDurumu.COZULDU,
            aciklama=istek.cozum_notu,
            degistiren_id=kullanici.id,
        )
    )
    bildirim_olustur(
        db,
        kullanici_id=talep.olusturan_id,
        tur=BildirimTuru.TALEP_COZULDU,
        baslik="Talebiniz çözüldü",
        mesaj=f"{talep.takip_no} numaralı talebiniz çözüldü. Detaylar için talebinizi inceleyebilirsiniz.",
        ilgili_talep_id=talep.id,
    )
    db.commit()
    return _personel_detay_yaniti(_atanmis_talebi_getir(db, kullanici, talep_id))


@router.post("/atanan-talepler/{talep_id}/not", response_model=TalepDetayYaniti)
def islem_notu_ekle(
    talep_id: uuid.UUID,
    istek: PersonelNotIstegi,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel),
):
    talep = _atanmis_talebi_getir(db, kullanici, talep_id)
    db.add(
        DurumGecmisi(
            talep_id=talep.id,
            onceki_durum=talep.durum,
            yeni_durum=talep.durum,
            aciklama=personel_notu_olustur(istek.not_),
            degistiren_id=kullanici.id,
        )
    )
    db.commit()
    return _personel_detay_yaniti(_atanmis_talebi_getir(db, kullanici, talep_id))


@router.post("/atanan-talepler/{talep_id}/bilgilendir", response_model=TalepDetayYaniti)
def vatandasi_bilgilendir(
    talep_id: uuid.UUID,
    istek: VatandasBilgilendirmeIstegi,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel),
):
    talep = _atanmis_talebi_getir(db, kullanici, talep_id)
    db.add(
        DurumGecmisi(
            talep_id=talep.id,
            onceki_durum=talep.durum,
            yeni_durum=talep.durum,
            aciklama=f"Vatandaş bilgilendirmesi: {istek.mesaj}",
            degistiren_id=kullanici.id,
        )
    )
    bildirim_olustur(
        db,
        kullanici_id=talep.olusturan_id,
        tur=BildirimTuru.SISTEM,
        baslik=f"{talep.takip_no} talebiniz hakkında bilgilendirme",
        mesaj=istek.mesaj,
        ilgili_talep_id=talep.id,
    )
    db.commit()
    return _personel_detay_yaniti(_atanmis_talebi_getir(db, kullanici, talep_id))
