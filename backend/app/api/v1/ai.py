"""Yapay zekâ uç noktaları: şikâyet analizi ve sohbet asistanı."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import gecerli_kullanicial
from app.core.database import get_db
from app.models.ai_kaydi import AiKaydi
from app.models.kullanici import Kullanici
from app.schemas.ai import AnalizIstegi, AnalizYaniti, SohbetIstegi, SohbetYaniti
from app.services.ai_servisi import sikayet_analiz_et, sohbet_yaniti_uret

router = APIRouter()


@router.post("/analiz-et", response_model=AnalizYaniti)
def sikayeti_analiz_et(
    istek: AnalizIstegi,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(gecerli_kullanicial),
):
    """
    Şikâyet başlığı ve açıklamasını analiz eder; uygun kategoriyi, öncelik
    seviyesini ve varsa eksik bilgileri önerir. Talep oluşturma formunda,
    vatandaş metni yazdıktan sonra bu uç nokta çağrılarak öneri gösterilir.
    """
    sonuc = sikayet_analiz_et(db, istek.baslik, istek.aciklama, kullanici_id=kullanici.id)
    onerilen_kategori = sonuc["onerilen_kategori"]

    return AnalizYaniti(
        onerilen_kategori_id=onerilen_kategori.id if onerilen_kategori else None,
        onerilen_kategori_adi=onerilen_kategori.ad if onerilen_kategori else None,
        onerilen_oncelik=sonuc["onerilen_oncelik"],
        guven_skoru=sonuc["guven_skoru"],
        eksik_bilgiler=sonuc["eksik_bilgiler"],
        ai_mesaji=sonuc["ai_mesaji"],
    )


@router.post("/sohbet", response_model=SohbetYaniti)
def sohbet_et(
    istek: SohbetIstegi,
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(gecerli_kullanicial),
):
    """AI asistan ile sohbet eder (ör. 'Emlak vergisini nasıl öderim?')."""
    yanit = sohbet_yaniti_uret(db, istek.mesaj, kullanici_id=kullanici.id)
    return SohbetYaniti(yanit=yanit)


@router.get("/sohbet-gecmisi")
def sohbet_gecmisi(
    db: Session = Depends(get_db),
    kullanici: Kullanici = Depends(gecerli_kullanicial),
):
    """Kullanıcının önceki sohbet kayıtlarını (en yeni 50) döner."""
    kayitlar = (
        db.query(AiKaydi)
        .filter(AiKaydi.kullanici_id == kullanici.id, AiKaydi.islem_turu == "sohbet")
        .order_by(AiKaydi.olusturulma_tarihi.desc())
        .limit(50)
        .all()
    )
    return [
        {"girdi": k.girdi_metni, "cikti": k.cikti_metni, "tarih": k.olusturulma_tarihi}
        for k in reversed(kayitlar)
    ]
