"""
SQLAlchemy veritabanı bağlantısı ve oturum (session) yönetimi.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings

ayarlar = get_settings()

engine = create_engine(
    ayarlar.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

OturumYerel = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Tüm SQLAlchemy modelleri için temel sınıf."""
    pass


def get_db():
    """
    FastAPI bağımlılık (dependency) fonksiyonu.
    Her istek için yeni bir veritabanı oturumu açar ve işlem bitince kapatır.
    """
    db = OturumYerel()
    try:
        yield db
    finally:
        db.close()
