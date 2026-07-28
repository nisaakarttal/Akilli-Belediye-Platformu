"""
Tüm SQLAlchemy modellerini tek noktadan içe aktarır.
Alembic'in `--autogenerate` özelliğinin tüm tabloları görebilmesi için
her yeni model burada da içe aktarılmalıdır.
"""

from app.models.kullanici import Kullanici, KullaniciRolu
from app.models.ilce import Ilce
from app.models.mahalle import Mahalle
from app.models.kategori import Kategori
from app.models.talep import Talep, TalepDurumu, TalepOnceligi
from app.models.talep_dosyasi import TalepDosyasi, DosyaTuru
from app.models.durum_gecmisi import DurumGecmisi
from app.models.atama import Atama
from app.models.bildirim import Bildirim, BildirimTuru
from app.models.ai_kaydi import AiKaydi
from app.models.aktivite_kaydi import AktiviteKaydi
from .refresh_token import RefreshToken

__all__ = [
    "Kullanici",
    "KullaniciRolu",
    "Ilce",
    "Mahalle",
    "Kategori",
    "Talep",
    "TalepDurumu",
    "TalepOnceligi",
    "TalepDosyasi",
    "DosyaTuru",
    "DurumGecmisi",
    "Atama",
    "Bildirim",
    "BildirimTuru",
    "AiKaydi",
    "AktiviteKaydi",
]

