"""Şikâyet/talep kategorileri uç noktaları."""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.api.deps import sadece_admin
from app.core.cache import cache_getir, cache_yaz, desene_gore_temizle
from app.core.database import get_db
from app.models.kategori import Kategori
from app.models.kullanici import Kullanici
from app.schemas.kategori import KategoriGuncelleIstegi, KategoriOlusturIstegi, KategoriYaniti
from app.schemas.ortak import MesajYaniti
from app.services.aktivite_servisi import aktivite_kaydet

router = APIRouter()

CACHE_DESENI = "kategoriler:*"


@router.get("/", response_model=list[KategoriYaniti])
def kategorileri_listele(
    pasifleri_dahil_et: bool = Query(False, description="Yönetim ekranları için pasife alınmış kategorileri de döner"),
    db: Session = Depends(get_db),
):
    """Tüm kategorileri listeler — herkes erişebilir (şikâyet formu için gereklidir)."""
    cache_anahtari = f"kategoriler:liste:{pasifleri_dahil_et}"
    onbellekteki = cache_getir(cache_anahtari)
    if onbellekteki is not None:
        return onbellekteki

    sorgu = db.query(Kategori)
    if not pasifleri_dahil_et:
        sorgu = sorgu.filter(Kategori.silindi_mi.is_(False))
    kayitlar = sorgu.order_by(Kategori.ad).all()

    sonuc = [KategoriYaniti.model_validate(k).model_dump(mode="json") for k in kayitlar]
    cache_yaz(cache_anahtari, sonuc, sure_saniye=3600)
    return kayitlar


@router.post("/", response_model=KategoriYaniti, status_code=status.HTTP_201_CREATED)
def kategori_olustur(
    istek: KategoriOlusturIstegi,
    request: Request,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_admin),
):
    """Yeni bir kategori oluşturur. Yalnızca yönetici."""
    mevcut = db.query(Kategori).filter(Kategori.ad == istek.ad).first()
    if mevcut is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Bu isimde bir kategori zaten mevcut.")

    kategori = Kategori(**istek.model_dump())
    db.add(kategori)
    db.flush()

    aktivite_kaydet(
        db,
        kullanici_id=kullanici.id,
        eylem="kategori_olusturuldu",
        hedef_tablo="kategoriler",
        hedef_id=kategori.id,
        detay=f"'{kategori.ad}' kategorisi oluşturuldu.",
        request=request,
    )

    db.commit()
    db.refresh(kategori)
    desene_gore_temizle(CACHE_DESENI)
    return kategori


@router.put("/{kategori_id}", response_model=KategoriYaniti)
def kategori_guncelle(
    kategori_id: uuid.UUID,
    istek: KategoriGuncelleIstegi,
    request: Request,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_admin),
):
    """Bir kategoriyi günceller. Yalnızca yönetici."""
    kategori = db.query(Kategori).filter(Kategori.id == kategori_id).first()
    if kategori is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kategori bulunamadı.")

    degisen_alanlar = istek.model_dump(exclude_unset=True)
    for alan, deger in degisen_alanlar.items():
        setattr(kategori, alan, deger)

    aktivite_kaydet(
        db,
        kullanici_id=kullanici.id,
        eylem="kategori_guncellendi",
        hedef_tablo="kategoriler",
        hedef_id=kategori.id,
        detay=f"Güncellenen alanlar: {', '.join(degisen_alanlar.keys()) or 'yok'}",
        request=request,
    )

    db.commit()
    db.refresh(kategori)
    desene_gore_temizle(CACHE_DESENI)
    return kategori


@router.delete("/{kategori_id}", response_model=MesajYaniti)
def kategori_sil(
    kategori_id: uuid.UUID,
    db: Session = Depends(get_db),
    _: Kullanici = Depends(sadece_admin),
):
    """Bir kategoriyi siler. Bu kategoriye bağlı talep varsa silme işlemi engellenir."""
    kategori = db.query(Kategori).filter(Kategori.id == kategori_id).first()
    if kategori is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kategori bulunamadı.")

    if len(kategori.talepler) > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bu kategoriye bağlı talepler bulunduğu için silinemez.",
        )

    db.delete(kategori)
    db.commit()
    desene_gore_temizle(CACHE_DESENI)
    return MesajYaniti(mesaj="Kategori başarıyla silindi.")


@router.put("/{kategori_id}/pasif-yap", response_model=MesajYaniti)
def kategori_pasif_yap(
    kategori_id: uuid.UUID,
    request: Request,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_admin),
):
    """
    Soft delete: Kategoriyi kalıcı olarak silmeden pasif duruma alır.
    Kategori normal listelerde görünmez ancak veritabanında/ilişkili talep
    kayıtlarında korunur; gerekirse `geri-yukle` ile eski haline döndürülebilir.
    """
    kategori = db.query(Kategori).filter(Kategori.id == kategori_id).first()
    if kategori is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kategori bulunamadı.")

    if kategori.silindi_mi:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Kategori zaten pasif durumda.")

    kategori.silindi_mi = True
    kategori.silinme_tarihi = datetime.now(timezone.utc)

    aktivite_kaydet(
        db,
        kullanici_id=kullanici.id,
        eylem="kategori_pasif_yapildi",
        hedef_tablo="kategoriler",
        hedef_id=kategori.id,
        detay=f"'{kategori.ad}' kategorisi pasif duruma alındı (soft delete).",
        request=request,
    )

    db.commit()
    desene_gore_temizle(CACHE_DESENI)
    return MesajYaniti(mesaj="Kategori pasif duruma alındı.")


@router.put("/{kategori_id}/geri-yukle", response_model=KategoriYaniti)
def kategori_geri_yukle(
    kategori_id: uuid.UUID,
    request: Request,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_admin),
):
    """Pasif duruma alınmış (soft delete edilmiş) bir kategoriyi eski haline döndürür."""
    kategori = db.query(Kategori).filter(Kategori.id == kategori_id).first()
    if kategori is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kategori bulunamadı.")

    if not kategori.silindi_mi:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Kategori zaten aktif durumda.")

    kategori.silindi_mi = False
    kategori.silinme_tarihi = None

    aktivite_kaydet(
        db,
        kullanici_id=kullanici.id,
        eylem="kategori_geri_yuklendi",
        hedef_tablo="kategoriler",
        hedef_id=kategori.id,
        detay=f"'{kategori.ad}' kategorisi geri yüklendi.",
        request=request,
    )

    db.commit()
    db.refresh(kategori)
    desene_gore_temizle(CACHE_DESENI)
    return kategori


@router.delete("/{kategori_id}/kalici", response_model=MesajYaniti)
def kategori_kalici_sil(
    kategori_id: uuid.UUID,
    request: Request,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(sadece_admin),
):
    """
    Bir kategoriyi veritabanından kalıcı olarak siler. Yalnızca daha önce
    pasif duruma alınmış (soft delete edilmiş) ve bağlı talebi olmayan
    kategoriler kalıcı olarak silinebilir. Bu işlem geri alınamaz.
    """
    kategori = db.query(Kategori).filter(Kategori.id == kategori_id).first()
    if kategori is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kategori bulunamadı.")

    if not kategori.silindi_mi:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kalıcı silme öncesinde kategori pasif duruma alınmalıdır.",
        )

    if len(kategori.talepler) > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Bu kategoriye bağlı talepler bulunduğu için kalıcı olarak silinemez.",
        )

    aktivite_kaydet(
        db,
        kullanici_id=kullanici.id,
        eylem="kategori_kalici_silindi",
        hedef_tablo="kategoriler",
        hedef_id=kategori.id,
        detay=f"'{kategori.ad}' kategorisi kalıcı olarak silindi.",
        request=request,
    )

    db.delete(kategori)
    db.commit()
    desene_gore_temizle(CACHE_DESENI)
    return MesajYaniti(mesaj="Kategori kalıcı olarak silindi.")
