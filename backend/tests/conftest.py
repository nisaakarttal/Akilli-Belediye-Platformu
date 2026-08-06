"""KapsamlÄ± pytest fixture'larÄ±.

Testler yalnÄ±zca TEST_DATABASE_URL ile gÃ¶sterilen AYRI bir PostgreSQL veritabanÄ±nda
Ã§alÄ±ÅŸmalÄ±dÄ±r. Fixture her veritabanÄ± testi Ã¶ncesinde ÅŸemayÄ± sÄ±fÄ±rlar; Ã¼retim
veritabanÄ±nÄ± TEST_DATABASE_URL olarak kullanmayÄ±n.
"""

from __future__ import annotations

import os
import uuid
from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session, sessionmaker

from app.core.database import Base, get_db
from app.core.security import erisim_tokeni_olustur, sifre_hashle
from app.main import app
from app.models.atama import Atama
from app.models.bildirim import Bildirim, BildirimTuru
from app.models.ilce import Ilce
from app.models.kategori import Kategori
from app.models.kullanici import Kullanici, KullaniciRolu
from app.models.mahalle import Mahalle
from app.models.memnuniyet import Memnuniyet
from app.models.talep import Talep, TalepDurumu, TalepOnceligi


def _test_url_uret() -> str:
    acik = os.getenv("TEST_DATABASE_URL")
    if acik:
        return acik

    ana = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://kapakli_admin:kapakli_sifre@localhost:5432/kapakli_belediye",
    )
    if "/" not in ana:
        return ana
    return ana.rsplit("/", 1)[0] + "/kapakli_belediye_test"


TEST_DATABASE_URL = _test_url_uret()

# YanlÄ±ÅŸlÄ±kla Ã¼retim DB'si Ã¼zerinde drop/create yapÄ±lmasÄ±nÄ± Ã¶nleyen basit koruma.
if os.getenv("DATABASE_URL") and TEST_DATABASE_URL == os.getenv("DATABASE_URL"):
    raise RuntimeError("TEST_DATABASE_URL, DATABASE_URL ile aynÄ± olamaz. AyrÄ± bir test veritabanÄ± kullanÄ±n.")


test_engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)
TestOturum = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

try:
    with test_engine.connect():
        VERITABANI_ERISILEBILIR = True
except (OperationalError, OSError):
    VERITABANI_ERISILEBILIR = False

veritabani_gerekli = pytest.mark.skipif(
    not VERITABANI_ERISILEBILIR,
    reason="Test veritabanÄ±na (Postgres) baÄŸlanÄ±lamadÄ±; TEST_DATABASE_URL deÄŸerini kontrol edin.",
)


@pytest.fixture(autouse=True)
def _kategori_cache_devre_disi(monkeypatch):
    """Redis/cache nedeniyle testlerin birbirini etkilemesini engeller."""
    monkeypatch.setattr("app.api.v1.kategoriler.cache_getir", lambda *_args, **_kwargs: None)
    monkeypatch.setattr("app.api.v1.kategoriler.cache_yaz", lambda *_args, **_kwargs: None)
    monkeypatch.setattr("app.api.v1.kategoriler.desene_gore_temizle", lambda *_args, **_kwargs: None)


@pytest.fixture()
def db_oturumu() -> Session:
    if not VERITABANI_ERISILEBILIR:
        pytest.skip("Test veritabanÄ±na (Postgres) baÄŸlanÄ±lamadÄ±.")

    # Uygulama endpointleri commit yaptÄ±ÄŸÄ± iÃ§in rollback tek baÅŸÄ±na yeterli deÄŸildir.
    # Her DB testi Ã¶ncesinde temiz ÅŸema kurarak test izolasyonu saÄŸlanÄ±r.
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)

    oturum = TestOturum()
    try:
        yield oturum
    finally:
        oturum.close()


@pytest.fixture()
def istemci(db_oturumu: Session, monkeypatch):
    def _get_db_override():
        yield db_oturumu

    app.dependency_overrides[get_db] = _get_db_override

    # Test sırasında gerçek scheduler başlatılmamalı.
    # Her TestClient yeni event loop oluşturduğu için global APScheduler
    # ikinci testte "Event loop is closed" hatasına neden olabilir.
    monkeypatch.setattr("app.main.zamanlayiciyi_baslat", lambda: None)
    monkeypatch.setattr("app.main.zamanlayiciyi_durdur", lambda: None)

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()


def _kullanici_olustur(
    db: Session,
    *,
    rol: KullaniciRolu,
    e_posta: str,
    ad: str,
    soyad: str,
    departman: str | None = None,
    aktif_mi: bool = True,
) -> Kullanici:
    kullanici = Kullanici(
        ad=ad,
        soyad=soyad,
        e_posta=e_posta,
        telefon="05551234567",
        sifre_hash=sifre_hashle("TestSifre123"),
        rol=rol,
        departman=departman,
        aktif_mi=aktif_mi,
        email_dogrulandi=True,
    )
    db.add(kullanici)
    db.flush()
    return kullanici


@pytest.fixture()
def temel_veriler(db_oturumu: Session):
    ilce = Ilce(
        ad="KapaklÄ±",
        il="TekirdaÄŸ",
        merkez_enlem=41.3290,
        merkez_boylam=27.9750,
    )
    db_oturumu.add(ilce)
    db_oturumu.flush()

    mahalle = Mahalle(
        ad="Cumhuriyet Mahallesi",
        ilce_id=ilce.id,
        merkez_enlem=41.3310,
        merkez_boylam=27.9800,
    )
    kategori = Kategori(
        ad="AydÄ±nlatma",
        aciklama="Sokak aydÄ±nlatma talepleri",
        sorumlu_departman="Fen Ä°ÅŸleri",
        renk="#2563EB",
        sla_saat=48,
    )
    db_oturumu.add_all([mahalle, kategori])

    vatandas = _kullanici_olustur(
        db_oturumu,
        rol=KullaniciRolu.VATANDAS,
        e_posta="vatandas1@example.com",
        ad="AyÅŸe",
        soyad="VatandaÅŸ",
    )
    vatandas2 = _kullanici_olustur(
        db_oturumu,
        rol=KullaniciRolu.VATANDAS,
        e_posta="vatandas2@example.com",
        ad="Mehmet",
        soyad="VatandaÅŸ",
    )
    personel = _kullanici_olustur(
        db_oturumu,
        rol=KullaniciRolu.PERSONEL,
        e_posta="personel1@example.com",
        ad="Pelin",
        soyad="Personel",
        departman="Fen Ä°ÅŸleri",
    )
    personel2 = _kullanici_olustur(
        db_oturumu,
        rol=KullaniciRolu.PERSONEL,
        e_posta="personel2@example.com",
        ad="Can",
        soyad="Personel",
        departman="Fen Ä°ÅŸleri",
    )
    admin = _kullanici_olustur(
        db_oturumu,
        rol=KullaniciRolu.ADMIN,
        e_posta="admin@example.com",
        ad="Admin",
        soyad="KullanÄ±cÄ±",
    )

    db_oturumu.commit()
    return {
        "ilce": ilce,
        "mahalle": mahalle,
        "kategori": kategori,
        "vatandas": vatandas,
        "vatandas2": vatandas2,
        "personel": personel,
        "personel2": personel2,
        "admin": admin,
    }


@pytest.fixture()
def auth_basligi():
    def _uret(kullanici: Kullanici) -> dict[str, str]:
        token = erisim_tokeni_olustur({"sub": str(kullanici.id)})
        return {"Authorization": f"Bearer {token}"}

    return _uret


@pytest.fixture()
def talep_olusturucu(db_oturumu: Session, temel_veriler):
    sayac = {"deger": 0}

    def _olustur(
        *,
        olusturan: Kullanici | None = None,
        durum: TalepDurumu = TalepDurumu.BEKLIYOR,
        oncelik: TalepOnceligi = TalepOnceligi.ORTA,
        gecikmis: bool = False,
        baslik: str = "Sokak lambasÄ± Ã§alÄ±ÅŸmÄ±yor",
    ) -> Talep:
        sayac["deger"] += 1
        sahip = olusturan or temel_veriler["vatandas"]
        son_cozum = datetime.now(timezone.utc) + timedelta(hours=48)
        if gecikmis:
            son_cozum = datetime.now(timezone.utc) - timedelta(hours=1)

        talep = Talep(
            takip_no=f"BLD-2026-{sayac['deger']:06d}",
            baslik=baslik,
            aciklama="Test talebi iÃ§in yeterince uzun aÃ§Ä±klama metni.",
            kategori_id=temel_veriler["kategori"].id,
            mahalle_id=temel_veriler["mahalle"].id,
            adres_detay="Test Sokak No: 1",
            enlem=41.331,
            boylam=27.980,
            oncelik=oncelik,
            durum=durum,
            olusturan_id=sahip.id,
            son_cozum_tarihi=son_cozum,
        )
        if durum in (TalepDurumu.COZULDU, TalepDurumu.KAPATILDI):
            talep.cozulme_tarihi = datetime.now(timezone.utc)
        db_oturumu.add(talep)
        db_oturumu.commit()
        db_oturumu.refresh(talep)
        return talep

    return _olustur


@pytest.fixture()
def atama_olusturucu(db_oturumu: Session, temel_veriler):
    def _ata(talep: Talep, personel: Kullanici | None = None, atayan: Kullanici | None = None) -> Atama:
        kayit = Atama(
            talep_id=talep.id,
            personel_id=(personel or temel_veriler["personel"]).id,
            atayan_id=(atayan or temel_veriler["admin"]).id,
            not_="Test atamasÄ±",
        )
        db_oturumu.add(kayit)
        db_oturumu.commit()
        db_oturumu.refresh(kayit)
        return kayit

    return _ata


@pytest.fixture()
def bildirim_olusturucu(db_oturumu: Session):
    def _olustur(kullanici: Kullanici, talep: Talep | None = None, *, okundu_mu: bool = False) -> Bildirim:
        bildirim = Bildirim(
            kullanici_id=kullanici.id,
            tur=BildirimTuru.SISTEM,
            baslik="Test bildirimi",
            mesaj="Test bildirim iÃ§eriÄŸi",
            ilgili_talep_id=talep.id if talep else None,
            okundu_mu=okundu_mu,
        )
        db_oturumu.add(bildirim)
        db_oturumu.commit()
        db_oturumu.refresh(bildirim)
        return bildirim

    return _olustur


@pytest.fixture()
def memnuniyet_olusturucu(db_oturumu: Session):
    def _olustur(talep: Talep, kullanici: Kullanici, puan: int = 5, yorum: str = "Ã‡ok memnun kaldÄ±m") -> Memnuniyet:
        kayit = Memnuniyet(talep_id=talep.id, olusturan_id=kullanici.id, puan=puan, yorum=yorum)
        db_oturumu.add(kayit)
        db_oturumu.commit()
        db_oturumu.refresh(kayit)
        return kayit

    return _olustur

