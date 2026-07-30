"""
APScheduler tabanlı zamanlanmış görevler (arka planda periyodik işler).

`zamanlayiciyi_baslat()` uygulama başlangıcında (main.py) çağrılır ve
aşağıdaki periyodik görevleri kaydeder:
- SLA süresi geçen taleplerin tespiti ve bildirimi
- Uzun süredir cevaplanmayan başvurular için hatırlatma
- Günlük özet rapor oluşturma
"""

import logging
from datetime import datetime, timedelta, timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.core.database import OturumYerel
from app.models.aktivite_kaydi import AktiviteKaydi
from app.models.bildirim import BildirimTuru
from app.models.talep import Talep, TalepDurumu
from app.services.bildirim_servisi import bildirim_olustur

logger = logging.getLogger("scheduler")

zamanlayici = AsyncIOScheduler(timezone="UTC")


def suresi_gecen_talepleri_kontrol_et() -> None:
    """SLA süresi (son_cozum_tarihi) geçmiş, henüz çözülmemiş talepleri tespit eder ve bildirim gönderir."""
    db = OturumYerel()
    try:
        simdi = datetime.now(timezone.utc)
        gecikenler = (
            db.query(Talep)
            .filter(Talep.son_cozum_tarihi.isnot(None))
            .filter(Talep.son_cozum_tarihi < simdi)
            .filter(Talep.durum.notin_([TalepDurumu.COZULDU, TalepDurumu.KAPATILDI]))
            .all()
        )
        for talep in gecikenler:
            bildirim_olustur(
                db,
                kullanici_id=talep.olusturan_id,
                tur=BildirimTuru.SISTEM,
                baslik="Talebiniz gecikti",
                mesaj=f"{talep.takip_no} numaralı talebiniz belirlenen çözüm süresini aştı.",
                ilgili_talep_id=talep.id,
            )
        if gecikenler:
            db.commit()
        logger.info("SLA kontrolü tamamlandı: %s geciken talep bulundu.", len(gecikenler))
    except Exception:  # noqa: BLE001 — zamanlanmış görev uygulamayı çökertmemeli
        db.rollback()
        logger.exception("SLA kontrolü sırasında hata oluştu.")
    finally:
        db.close()


def cevaplanmayan_basvurulari_hatirlat() -> None:
    """3 günden uzun süredir 'bekliyor' durumunda kalmış talepler için hatırlatma bildirimi gönderir."""
    db = OturumYerel()
    try:
        esik = datetime.now(timezone.utc) - timedelta(days=3)
        bekleyenler = (
            db.query(Talep)
            .filter(Talep.durum == TalepDurumu.BEKLIYOR)
            .filter(Talep.olusturulma_tarihi < esik)
            .all()
        )
        for talep in bekleyenler:
            bildirim_olustur(
                db,
                kullanici_id=talep.olusturan_id,
                tur=BildirimTuru.SISTEM,
                baslik="Talebiniz inceleniyor",
                mesaj=f"{talep.takip_no} numaralı talebiniz hâlâ değerlendirme aşamasındadır.",
                ilgili_talep_id=talep.id,
            )
        if bekleyenler:
            db.commit()
        logger.info("Cevaplanmayan başvuru hatırlatması tamamlandı: %s kayıt.", len(bekleyenler))
    except Exception:  # noqa: BLE001
        db.rollback()
        logger.exception("Hatırlatma görevi sırasında hata oluştu.")
    finally:
        db.close()


def gunluk_ozet_raporu_olustur() -> None:
    """Günlük özet istatistikleri hesaplayıp denetim (audit) kaydına yazar — otomatik rapor."""
    db = OturumYerel()
    try:
        simdi = datetime.now(timezone.utc)
        bugun_baslangic = simdi.replace(hour=0, minute=0, second=0, microsecond=0)

        toplam = db.query(Talep).count()
        bugunku = db.query(Talep).filter(Talep.olusturulma_tarihi >= bugun_baslangic).count()
        cozulen = db.query(Talep).filter(Talep.durum.in_([TalepDurumu.COZULDU, TalepDurumu.KAPATILDI])).count()
        bekleyen = db.query(Talep).filter(Talep.durum == TalepDurumu.BEKLIYOR).count()
        geciken = (
            db.query(Talep)
            .filter(Talep.son_cozum_tarihi.isnot(None))
            .filter(Talep.son_cozum_tarihi < simdi)
            .filter(Talep.durum.notin_([TalepDurumu.COZULDU, TalepDurumu.KAPATILDI]))
            .count()
        )

        db.add(
            AktiviteKaydi(
                kullanici_id=None,
                eylem="gunluk_rapor_olusturuldu",
                hedef_tablo="talepler",
                hedef_id=None,
                detay=(
                    f"Toplam: {toplam}, bugünkü: {bugunku}, çözülen: {cozulen}, "
                    f"bekleyen: {bekleyen}, geciken: {geciken}"
                ),
            )
        )
        db.commit()
        logger.info("Günlük özet rapor oluşturuldu.")
    except Exception:  # noqa: BLE001
        db.rollback()
        logger.exception("Günlük rapor oluşturma sırasında hata oluştu.")
    finally:
        db.close()


def zamanlayiciyi_baslat() -> None:
    """Uygulama başlangıcında çağrılır; periyodik görevleri kaydeder ve zamanlayıcıyı başlatır."""
    zamanlayici.add_job(
        suresi_gecen_talepleri_kontrol_et,
        trigger=IntervalTrigger(hours=1),
        id="sla_kontrolu",
        replace_existing=True,
    )
    zamanlayici.add_job(
        cevaplanmayan_basvurulari_hatirlat,
        trigger=IntervalTrigger(hours=12),
        id="cevaplanmayan_hatirlatma",
        replace_existing=True,
    )
    zamanlayici.add_job(
        gunluk_ozet_raporu_olustur,
        trigger=IntervalTrigger(hours=24),
        id="gunluk_rapor",
        replace_existing=True,
    )
    zamanlayici.start()
    logger.info("Zamanlayıcı (scheduler) başlatıldı.")


def zamanlayiciyi_durdur() -> None:
    """Uygulama kapanışında zamanlayıcıyı düzgün şekilde durdurur."""
    if zamanlayici.running:
        zamanlayici.shutdown(wait=False)
