"""Şikâyet/talep uç noktaları — sistemin merkezi işlevselliği."""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import gecerli_kullanicial, sadece_personel_ve_admin
from app.core.database import get_db
from app.models.aktivite_kaydi import AktiviteKaydi
from app.models.atama import Atama
from app.models.bildirim import BildirimTuru
from app.models.durum_gecmisi import DurumGecmisi
from app.models.kategori import Kategori
from app.models.kullanici import Kullanici, KullaniciRolu
from app.models.mahalle import Mahalle
from app.models.talep import Talep, TalepDurumu, TalepOnceligi
from app.models.talep_dosyasi import DosyaTuru, TalepDosyasi
from app.schemas.ortak import SayfalanmisYanit
from app.schemas.talep import (
    TalepAtaIstegi,
    TalepCozIstegi,
    TalepDetayYaniti,
    TalepDosyaYaniti,
    TalepDurumGuncelleIstegi,
    TalepHaritaNoktasi,
    TalepListeYaniti,
    TalepOlusturIstegi,
)
from app.services.bildirim_servisi import bildirim_olustur
from app.utils.dosya_yardimcisi import dosya_kaydet
from app.utils.takip_no import takip_no_uret
from app.core.config import get_settings
from pathlib import Path

router = APIRouter()
ayarlar = get_settings()

ALLOWED_EXTENSIONS = {
    DosyaTuru.FOTOGRAF: {".jpg", ".jpeg", ".png", ".webp"},
    DosyaTuru.VIDEO: {".mp4", ".mov", ".avi", ".webm"},
    DosyaTuru.SES: {".mp3", ".wav", ".ogg"},
    DosyaTuru.BELGE: {".pdf", ".doc", ".docx"},
    DosyaTuru.SONUC_FOTOGRAFI: {".jpg", ".jpeg", ".png", ".webp"},
}

def _talep_sorgu_temel(db: Session):
    return db.query(Talep).options(
        joinedload(Talep.kategori), joinedload(Talep.mahalle), joinedload(Talep.olusturan)
    )


def _erisim_kontrolu(talep: Talep, kullanici: Kullanici) -> None:
    """Vatandaşların yalnızca kendi taleplerine erişebilmesini garanti eder."""
    if kullanici.rol == KullaniciRolu.VATANDAS and talep.olusturan_id != kullanici.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bu talebe erişim yetkiniz yok.")


@router.post("/", response_model=TalepDetayYaniti, status_code=status.HTTP_201_CREATED)
def talep_olustur(
    istek: TalepOlusturIstegi,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(gecerli_kullanicial),
):
    """Yeni bir şikâyet/talep oluşturur ve otomatik takip numarası üretir."""
    kategori = db.query(Kategori).filter(Kategori.id == istek.kategori_id).first()
    if kategori is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Belirtilen kategori bulunamadı.")

    mahalle = db.query(Mahalle).filter(Mahalle.id == istek.mahalle_id).first()
    if mahalle is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Belirtilen mahalle bulunamadı.")

    talep = Talep(
        takip_no=takip_no_uret(db),
        baslik=istek.baslik,
        aciklama=istek.aciklama,
        kategori_id=istek.kategori_id,
        mahalle_id=istek.mahalle_id,
        adres_detay=istek.adres_detay,
        enlem=istek.enlem,
        boylam=istek.boylam,
        oncelik=istek.oncelik,
        olusturan_id=kullanici.id,
        ai_onerilen_kategori_id=istek.ai_onerilen_kategori_id,
        ai_onerilen_oncelik=istek.ai_onerilen_oncelik,
        ai_guven_skoru=istek.ai_guven_skoru,
    )
    db.add(talep)
    db.flush()  # talep.id'yi commit etmeden önce almak için

    db.add(
        DurumGecmisi(
            talep_id=talep.id,
            onceki_durum=None,
            yeni_durum=TalepDurumu.BEKLIYOR,
            aciklama="Talep vatandaş tarafından oluşturuldu.",
            degistiren_id=kullanici.id,
        )
    )
    db.add(
        AktiviteKaydi(
            kullanici_id=kullanici.id,
            eylem="talep_olusturuldu",
            hedef_tablo="talepler",
            hedef_id=talep.id,
            detay=f"{talep.takip_no} numaralı talep oluşturuldu.",
        )
    )
    db.commit()

    return _talep_sorgu_temel(db).filter(Talep.id == talep.id).first()


@router.get("/", response_model=SayfalanmisYanit[TalepListeYaniti])
def talepleri_listele(
    durum: TalepDurumu | None = None,
    kategori_id: uuid.UUID | None = None,
    mahalle_id: uuid.UUID | None = None,
    oncelik: TalepOnceligi | None = None,
    sayfa: int = Query(1, ge=1),
    sayfa_boyutu: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(gecerli_kullanicial),
):
    """
    Talepleri listeler. Vatandaşlar yalnızca kendi taleplerini görür;
    personel ve yöneticiler tüm talepleri görebilir.
    """
    sorgu = _talep_sorgu_temel(db)

    if kullanici.rol == KullaniciRolu.VATANDAS:
        sorgu = sorgu.filter(Talep.olusturan_id == kullanici.id)

    if durum is not None:
        sorgu = sorgu.filter(Talep.durum == durum)
    if kategori_id is not None:
        sorgu = sorgu.filter(Talep.kategori_id == kategori_id)
    if mahalle_id is not None:
        sorgu = sorgu.filter(Talep.mahalle_id == mahalle_id)
    if oncelik is not None:
        sorgu = sorgu.filter(Talep.oncelik == oncelik)

    toplam = sorgu.count()
    kayitlar = (
        sorgu.order_by(Talep.olusturulma_tarihi.desc())
        .offset((sayfa - 1) * sayfa_boyutu)
        .limit(sayfa_boyutu)
        .all()
    )

    return SayfalanmisYanit(toplam=toplam, sayfa=sayfa, sayfa_boyutu=sayfa_boyutu, veriler=kayitlar)


@router.get("/harita", response_model=list[TalepHaritaNoktasi])
def talepleri_haritada_goster(
    durum: TalepDurumu | None = None,
    kategori_id: uuid.UUID | None = None,
    db: Session = Depends(get_db),
):
    """Harita bileşeni için talep konumlarını GeoJSON benzeri formatta döner. Girişsiz erişilebilir."""
    sorgu = db.query(Talep).options(joinedload(Talep.kategori))
    if durum is not None:
        sorgu = sorgu.filter(Talep.durum == durum)
    if kategori_id is not None:
        sorgu = sorgu.filter(Talep.kategori_id == kategori_id)

    return [
        TalepHaritaNoktasi(
            id=t.id,
            takip_no=t.takip_no,
            baslik=t.baslik,
            enlem=t.enlem,
            boylam=t.boylam,
            durum=t.durum,
            oncelik=t.oncelik,
            kategori_adi=t.kategori.ad,
        )
        for t in sorgu.all()
    ]


@router.get("/takip/{takip_no}", response_model=TalepDetayYaniti)
def takip_no_ile_sorgula(takip_no: str, db: Session = Depends(get_db)):
    """Takip numarasıyla girişsiz sorgulama yapılabilir (vatandaş SMS/e-posta ile aldığı numarayla sorgular)."""
    talep = _talep_sorgu_temel(db).filter(Talep.takip_no == takip_no).first()
    if talep is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bu takip numarasına ait talep bulunamadı.")
    return talep


@router.get("/{talep_id}", response_model=TalepDetayYaniti)
def talep_getir(
    talep_id: uuid.UUID,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(gecerli_kullanicial),
):
    """Bir talebin tüm detaylarını (dosyalar, durum geçmişi dahil) döner."""
    talep = _talep_sorgu_temel(db).filter(Talep.id == talep_id).first()
    if talep is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Talep bulunamadı.")

    _erisim_kontrolu(talep, kullanici)
    return talep


@router.post("/{talep_id}/dosya", response_model=TalepDosyaYaniti, status_code=status.HTTP_201_CREATED)
def talep_dosyasi_yukle(
    talep_id: uuid.UUID,
    dosya_turu: DosyaTuru,
    dosya: UploadFile = File(...),
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(gecerli_kullanicial),
):
    """Bir talebe fotoğraf, video, ses veya belge ekler."""
    talep = db.query(Talep).filter(Talep.id == talep_id).first()
    if talep is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Talep bulunamadı.")

    _erisim_kontrolu(talep, kullanici)

    if dosya_turu == DosyaTuru.SONUC_FOTOGRAFI and kullanici.rol == KullaniciRolu.VATANDAS:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sonuç fotoğrafı yalnızca personel/yönetici tarafından yüklenebilir.",
        )

    if not dosya.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dosya adı bulunamadı."
        )

    uzanti = Path(dosya.filename).suffix.lower()

    if uzanti not in ALLOWED_EXTENSIONS[dosya_turu]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bu dosya türü için '{uzanti}' uzantısına izin verilmiyor."
        )

    ALLOWED_MIME_TYPES = {
        DosyaTuru.FOTOGRAF: {
            "image/jpeg",
            "image/png",
            "image/webp",
        },
        DosyaTuru.VIDEO: {
            "video/mp4",
            "video/quicktime",
            "video/x-msvideo",
            "video/webm",
        },
        DosyaTuru.SES: {
            "audio/mpeg",
            "audio/wav",
            "audio/ogg",
        },
        DosyaTuru.BELGE: {
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
        DosyaTuru.SONUC_FOTOGRAFI: {
            "image/jpeg",
            "image/png",
            "image/webp",
        },
    }

    if dosya.content_type not in ALLOWED_MIME_TYPES[dosya_turu]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz dosya türü."
        )

    icerik = dosya.file.read()

    if len(icerik) > ayarlar.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Dosya en fazla {ayarlar.MAX_UPLOAD_SIZE_MB} MB olabilir."
        )

    dosya.file.seek(0)

    goreli_yol, boyut_bayt = dosya_kaydet(dosya, dosya_turu, "sikayetler")

    kayit = TalepDosyasi(
        talep_id=talep.id,
        dosya_turu=dosya_turu,
        dosya_yolu=goreli_yol,
        orijinal_ad=dosya.filename or "isimsiz_dosya",
        boyut_bayt=boyut_bayt,
        yukleyen_id=kullanici.id,
    )
    db.add(kayit)
    db.commit()
    db.refresh(kayit)
    return kayit


@router.put("/{talep_id}/durum", response_model=TalepDetayYaniti)
def talep_durumunu_guncelle(
    talep_id: uuid.UUID,
    istek: TalepDurumGuncelleIstegi,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel_ve_admin),
):
    """Bir talebin durumunu günceller ve zaman tüneline (durum geçmişi) kayıt ekler. Personel/yönetici."""
    talep = db.query(Talep).filter(Talep.id == talep_id).first()
    if talep is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Talep bulunamadı.")

    onceki_durum = talep.durum
    talep.durum = istek.durum
    if istek.durum == TalepDurumu.COZULDU:
        talep.cozulme_tarihi = datetime.now(timezone.utc)

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
    return _talep_sorgu_temel(db).filter(Talep.id == talep_id).first()


@router.post("/{talep_id}/ata", response_model=TalepDetayYaniti)
def talep_ata(
    talep_id: uuid.UUID,
    istek: TalepAtaIstegi,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel_ve_admin),
):
    """Bir talebi bir personele atar. Personel/yönetici."""
    talep = db.query(Talep).filter(Talep.id == talep_id).first()
    if talep is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Talep bulunamadı.")

    personel = db.query(Kullanici).filter(Kullanici.id == istek.personel_id).first()
    if personel is None or personel.rol not in (KullaniciRolu.PERSONEL, KullaniciRolu.ADMIN):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Belirtilen kullanıcı bir personel değil.")

    db.add(Atama(talep_id=talep.id, personel_id=personel.id, atayan_id=kullanici.id, not_=istek.not_))

    onceki_durum = talep.durum
    talep.durum = TalepDurumu.ATANDI
    db.add(
        DurumGecmisi(
            talep_id=talep.id,
            onceki_durum=onceki_durum,
            yeni_durum=TalepDurumu.ATANDI,
            aciklama=f"{personel.ad} {personel.soyad} adlı personele atandı.",
            degistiren_id=kullanici.id,
        )
    )

    bildirim_olustur(
        db,
        kullanici_id=personel.id,
        tur=BildirimTuru.TALEP_ATANDI,
        baslik="Yeni bir talep size atandı",
        mesaj=f"{talep.takip_no} numaralı talep size atandı.",
        ilgili_talep_id=talep.id,
    )
    bildirim_olustur(
        db,
        kullanici_id=talep.olusturan_id,
        tur=BildirimTuru.TALEP_ATANDI,
        baslik="Talebiniz atandı",
        mesaj=f"{talep.takip_no} numaralı talebiniz ilgili birime atandı.",
        ilgili_talep_id=talep.id,
    )

    db.commit()
    return _talep_sorgu_temel(db).filter(Talep.id == talep_id).first()


@router.post("/{talep_id}/coz", response_model=TalepDetayYaniti)
def talep_coz(
    talep_id: uuid.UUID,
    istek: TalepCozIstegi,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_personel_ve_admin),
):
    """Bir talebi çözüldü olarak işaretler. Personel/yönetici."""
    talep = db.query(Talep).filter(Talep.id == talep_id).first()
    if talep is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Talep bulunamadı.")

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
    return _talep_sorgu_temel(db).filter(Talep.id == talep_id).first()
