import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class KullaniciRolu(str, enum.Enum):
    VATANDAS = "vatandas"
    PERSONEL = "personel"
    ADMIN = "admin"


class Kullanici(Base):
    """Sistemdeki tüm kullanıcılar: vatandaş, personel ve yöneticiler."""

    __tablename__ = "kullanicilar"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ad: Mapped[str] = mapped_column(String(100), nullable=False)
    soyad: Mapped[str] = mapped_column(String(100), nullable=False)
    tc_kimlik_no: Mapped[str | None] = mapped_column(String(11), unique=True, nullable=True)
    e_posta: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    telefon: Mapped[str] = mapped_column(String(20), nullable=False)
    sifre_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    rol: Mapped[KullaniciRolu] = mapped_column(
        Enum(
            KullaniciRolu,
            name="kullanici_rolu",
            values_callable=lambda enum_cls: [e.value for e in enum_cls],
        ),
        default=KullaniciRolu.VATANDAS,
        nullable=False,
    )
    profil_fotografi: Mapped[str | None] = mapped_column(String(500), nullable=True)
    adres: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Personel için: hangi departmanda çalıştığı (Fen İşleri, Temizlik İşleri vb.)
    departman: Mapped[str | None] = mapped_column(String(150), nullable=True)

    aktif_mi: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    e_posta_dogrulandi_mi: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    olusturulma_tarihi: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    guncellenme_tarihi: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    son_giris_tarihi: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # İlişkiler
    talepler = relationship("Talep", back_populates="olusturan", foreign_keys="Talep.olusturan_id")
    atamalar = relationship("Atama", back_populates="personel", foreign_keys="Atama.personel_id")
    bildirimler = relationship("Bildirim", back_populates="kullanici")

    def __repr__(self) -> str:
        return f"<Kullanici {self.ad} {self.soyad} ({self.rol})>"
