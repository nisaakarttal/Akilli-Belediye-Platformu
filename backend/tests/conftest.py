"""
Pytest fixtures: test veritabanı oturumu ve FastAPI test istemcisi.

Testler, projenin gerçek Postgres veritabanı yapılandırmasını kullanır
(bkz. Dockerfile / docker-compose). Varsayılan olarak `DATABASE_URL` ile
aynı sunucuda `_test` son ekli ayrı bir veritabanı kullanılır; farklı bir
test veritabanı kullanmak için `TEST_DATABASE_URL` ortam değişkenini
tanımlayın.

Test veritabanına erişilemiyorsa (ör. CI ortamında Postgres kurulu değilse)
veritabanı gerektiren testler otomatik olarak atlanır (skip) — yalnızca
saf birim testleri (ör. `test_guvenlik.py`) çalışır.
"""

import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker

from app.core.database import Base, get_db
from app.main import app

TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://kapakli_admin:kapakli_sifre@localhost:5432/kapakli_belediye",
    ).rsplit("/", 1)[0]
    + "/kapakli_belediye_test",
)

test_engine = create_engine(TEST_DATABASE_URL, pool_pre_ping=True)
TestOturum = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

try:
    with test_engine.connect():
        VERITABANI_ERISILEBILIR = True
except OperationalError:
    VERITABANI_ERISILEBILIR = False

veritabani_gerekli = pytest.mark.skipif(
    not VERITABANI_ERISILEBILIR,
    reason="Test veritabanına (Postgres) bağlanılamadı; bkz. TEST_DATABASE_URL.",
)


@pytest.fixture(scope="session", autouse=True)
def _test_veritabanini_hazirla():
    if VERITABANI_ERISILEBILIR:
        Base.metadata.create_all(bind=test_engine)
    yield
    if VERITABANI_ERISILEBILIR:
        Base.metadata.drop_all(bind=test_engine)


@pytest.fixture()
def db_oturumu():
    """Her test için ayrı bir veritabanı oturumu açar, test sonunda değişiklikleri geri alır."""
    oturum = TestOturum()
    try:
        yield oturum
    finally:
        oturum.rollback()
        oturum.close()


@pytest.fixture()
def istemci(db_oturumu):
    """FastAPI test istemcisi; `get_db` bağımlılığını test oturumuyla değiştirir."""

    def _get_db_override():
        try:
            yield db_oturumu
        finally:
            pass

    app.dependency_overrides[get_db] = _get_db_override
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
